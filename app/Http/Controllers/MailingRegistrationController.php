<?php

namespace App\Http\Controllers;

use App\Models\MailingContact;
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
            'phone' => ['nullable','string','max:40'],
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

        // Registration succeeds independently of SMTP availability.
        // The scheduler will handle subsequent reminders.
        return response()->json(['ok' => true]);
    }

    public function unsubscribe(string $token)
    {
        $contact = MailingContact::where('unsubscribe_token', $token)->firstOrFail();
        $contact->update(['practice_reminders' => false, 'marketing_consent' => false, 'unsubscribed_at' => now()]);
        return response('Вы отписались от писем. Ваши настройки сохранены.', 200)->header('Content-Type', 'text/plain; charset=utf-8');
    }
}
