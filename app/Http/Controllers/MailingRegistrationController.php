<?php

namespace App\Http\Controllers;

use App\Models\MailingContact;
use App\Models\MailingAutomation;
use Illuminate\Support\Facades\URL;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class MailingRegistrationController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required','string','max:120'],
            'email' => ['required','email','max:255'],
            'phone' => ['required','string','min:6','max:40'],
            'practice_reminders' => ['accepted'],
            'marketing_consent' => ['nullable','boolean'],
        ]);
        $email = Str::lower(trim($data['email']));
        $contact = MailingContact::firstOrNew(['email' => $email]);
        $contact->name = trim($data['name']);
        $contact->phone = $data['phone'] ?? $contact->phone;
        $contact->source = 'editoria';
        $contact->practice_reminders = true;
        $contact->marketing_consent = $contact->marketing_consent || (bool) ($data['marketing_consent'] ?? false);
        $contact->consented_at = now();
        $contact->unsubscribed_at = null;
        $contact->unsubscribe_token ??= Str::random(48);
        $contact->save();

        if (! $contact->email_verified_at) $this->sendVerification($contact);
        // Registration succeeds even if verification mail fails.
        return response()->json(['ok' => true]);
    }


    private function sendVerification(MailingContact $contact): void
    {
        $template = MailingAutomation::where('event_key', 'email_verification')->where('is_enabled', true)->first();
        if (! $template) return;
        if ($contact->email_verification_sent_at && $contact->email_verification_sent_at->greaterThan(now()->subMinutes(10))) return;

        $token = Str::random(64);
        $contact->forceFill([
            'email_verification_token_hash' => hash('sha256', $token),
            'email_verification_expires_at' => now()->addHours(48),
            'email_verification_status' => 'pending',
            'email_verification_error' => null,
        ])->save();
        $link = URL::temporarySignedRoute('mailing.verify', now()->addHours(48), ['contact' => $contact->id, 'token' => $token]);
        $subject = str_replace('{name}', $contact->name, $template->subject);
        $body = str_replace(['{name}', '{confirmation_link}'], [$contact->name, $link], $template->body);
        try {
            Mail::raw($body, fn ($message) => $message->to($contact->email)->subject($subject));
            $contact->forceFill(['email_verification_sent_at' => now(), 'email_verification_status' => 'pending'])->save();
        } catch (\Throwable $e) {
            $contact->forceFill([
                'email_verification_status' => 'send_failed',
                'email_verification_error' => mb_substr($e->getMessage(), 0, 2000),
            ])->save();
            report($e);
        }
    }

    public function verify(Request $request, MailingContact $contact, string $token)
    {
        abort_unless($request->hasValidSignature(), 403);
        abort_unless(
            $contact->email_verification_token_hash
            && hash_equals($contact->email_verification_token_hash, hash('sha256', $token))
            && $contact->email_verification_expires_at?->isFuture(), 403
        );
        $contact->forceFill([
            'email_verified_at' => now(),
            'email_verification_status' => 'verified',
            'email_verification_token_hash' => null,
            'email_verification_expires_at' => null,
            'email_verification_error' => null,
        ])->save();
        return response('Email подтверждён! Спасибо за регистрацию.', 200)
            ->header('Content-Type', 'text/plain; charset=utf-8');
    }

    public function unsubscribe(string $token)
    {
        $contact = MailingContact::where('unsubscribe_token', $token)->firstOrFail();
        $contact->update(['practice_reminders' => false, 'marketing_consent' => false, 'unsubscribed_at' => now()]);
        return response('Вы отписались от писем. Ваши настройки сохранены.', 200)->header('Content-Type', 'text/plain; charset=utf-8');
    }
}
