<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SendTwoFactorOtp extends Notification
{
    use Queueable;

    public function __construct(
        private readonly string $otp
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Kode Verifikasi Login AIMS')
            ->greeting('Halo, ' . $notifiable->name . '!')
            ->line('Gunakan kode berikut untuk menyelesaikan proses login:')
            ->line('**' . $this->otp . '**')
            ->line('Kode ini berlaku selama **5 menit** dan hanya dapat digunakan satu kali.')
            ->line('Jika Anda tidak mencoba login, abaikan email ini dan segera hubungi administrator.')
            ->salutation('Salam, Tim AIMS');
    }
}