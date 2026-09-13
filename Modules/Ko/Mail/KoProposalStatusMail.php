<?php

namespace Modules\Ko\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Notifikasi perubahan status proposal KO ke PJO/pemohon.
 * Parity newaims App\Mail\KO\ProposalUpdated (dikirim tiap verify/reject/
 * komisioning), digeneralisasi satu Mailable antrean agar aman bila
 * MAIL_MAILER=log dan tidak pernah melempar exception ke request.
 */
class KoProposalStatusMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly string $proposalNumber,
        public readonly string $status,
        public readonly string $message,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "[KO] {$this->proposalNumber} — {$this->status}",
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: sprintf(
                '<p>Yth. Bapak/Ibu,</p><p>%s</p><p>Nomor proposal: <strong>%s</strong><br>Status saat ini: <strong>%s</strong></p><p>Terima kasih.</p>',
                e($this->message),
                e($this->proposalNumber),
                e($this->status),
            ),
        );
    }
}
