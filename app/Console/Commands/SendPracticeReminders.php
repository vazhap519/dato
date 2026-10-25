<?php

namespace App\Console\Commands;

use App\Models\MailingContact;
use App\Models\MailingDelivery;
use App\Models\MailingFormSetting;
use Carbon\CarbonImmutable;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Throwable;

class SendPracticeReminders extends Command
{
    protected $signature = 'mailing:practice-reminders';
    protected $description = 'Send due practice reminders through configured Laravel mailer';

    public function handle(): int
    {
        // Fail closed: no settings record, or disabled, means no email delivery.
        if (! MailingFormSetting::query()->where('auto_reminders_enabled', true)->exists()) {
            return self::SUCCESS;
        }

        $now = CarbonImmutable::now('Europe/Moscow');
        $daysUntilFriday = (5 - $now->dayOfWeekIso + 7) % 7;
        $friday = $now->startOfDay()->addDays($daysUntilFriday)->setTime(19, 0);
        if ($friday->lessThanOrEqualTo($now)) $friday = $friday->addWeek();
        $times = [
            'day_before' => $friday->subDay(),
            'hour_before' => $friday->subHour(),
            'ten_minutes_before' => $friday->subMinutes(10),
        ];
        $due = collect($times)->filter(fn ($at) => abs($now->diffInMinutes($at, false)) < 2);
        if ($due->isEmpty()) return self::SUCCESS;
        foreach ($due as $type => $at) {
            MailingContact::query()->where('practice_reminders', true)->whereNotNull('email_verified_at')->whereNull('unsubscribed_at')
                ->where('created_at', '<=', $at->utc())->chunkById(100, function ($contacts) use ($type, $friday) {
                    foreach ($contacts as $contact) {
                        if (! MailingFormSetting::query()->where('auto_reminders_enabled', true)->exists()) return;
                        $date = $friday->toDateString();
                        $delivery = MailingDelivery::firstOrCreate(
                            ['mailing_contact_id'=>$contact->id,'type'=>$type,'practice_date'=>$date],
                            ['status'=>'pending']
                        );
                        if ($delivery->status === 'sent') continue;
                        try {
                            $subject = match ($type) {
                                'day_before' => 'Завтра встречаемся на практикуме «Познай СЕБЯ»',
                                'hour_before' => 'До начала практикума остался час',
                                default => 'Начинаем через 10 минут',
                            };
                            $body = "Привет, {$contact->name}!\n\n"
                                . "Напоминаю: наш бесплатный практикум «Познай СЕБЯ» начинается в пятницу в 19:00 по Москве.\n"
                                . "Информация о подключении — в Telegram-канале, в который ты перешёл после регистрации.\n\n"
                                . "До встречи!\nДавид\n\n"
                                . "Отписаться от напоминаний: ".route('mailing.unsubscribe', $contact->unsubscribe_token);
                            Mail::raw($body, fn ($message) => $message->to($contact->email)->subject($subject));
                            $delivery->update(['status'=>'sent','sent_at'=>now(),'error'=>null]);
                        } catch (Throwable $e) {
                            $delivery->update(['status'=>'failed','error'=>mb_substr($e->getMessage(),0,2000)]);
                            report($e);
                        }
                    }
                });
        }
        return self::SUCCESS;
    }
}
