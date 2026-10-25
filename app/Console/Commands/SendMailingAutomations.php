<?php

namespace App\Console\Commands;

use App\Models\MailingAutomation;
use App\Models\MailingContact;
use App\Models\MailingDelivery;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Throwable;

class SendMailingAutomations extends Command
{
    protected $signature = 'mailing:automations';
    protected $description = 'Send enabled verified-contact event emails';

    public function handle(): int
    {
        MailingAutomation::query()
            ->where('is_enabled', true)
            ->where('trigger_event', 'email_verified')
            ->where('event_key', '!=', 'email_verification')
            ->each(function (MailingAutomation $automation) {
                MailingContact::query()
                    ->whereNotNull('email_verified_at')
                    ->where('email_verified_at', '<=', now()->subMinutes($automation->delay_minutes))
                    ->whereNull('unsubscribed_at')
                    ->when($automation->audience === 'marketing', fn ($q) => $q->where('marketing_consent', true))
                    ->when($automation->audience === 'reminders', fn ($q) => $q->where('practice_reminders', true))
                    ->chunkById(100, function ($contacts) use ($automation) {
                        foreach ($contacts as $contact) {
                            if (! $automation->fresh()?->is_enabled) return;
                            $type = 'automation_'.$automation->id;
                            $delivery = MailingDelivery::firstOrCreate(
                                ['mailing_contact_id' => $contact->id, 'type' => $type, 'practice_date' => null],
                                ['status' => 'pending', 'mailing_automation_id' => $automation->id]
                            );
                            if ($delivery->status === 'sent') continue;
                            // Do not automatically retry failures: avoid duplicate sends when SMTP acknowledgement is uncertain.
                            if ($delivery->status === 'failed') continue;
                            $vars = ['{name}', '{email}', '{unsubscribe_link}'];
                            $values = [$contact->name, $contact->email, route('mailing.unsubscribe', $contact->unsubscribe_token)];
                            $subject = str_replace($vars, $values, $automation->subject);
                            $body = str_replace($vars, $values, $automation->body);
                            $body .= "\n\nОтписаться: ".route('mailing.unsubscribe', $contact->unsubscribe_token);
                            try {
                                Mail::raw($body, fn ($message) => $message->to($contact->email)->subject($subject));
                                $delivery->update(['status' => 'sent', 'sent_at' => now(), 'error' => null]);
                            } catch (Throwable $e) {
                                $delivery->update(['status' => 'failed', 'error' => mb_substr($e->getMessage(), 0, 2000)]);
                                report($e);
                            }
                        }
                    });
            });
        return self::SUCCESS;
    }
}
