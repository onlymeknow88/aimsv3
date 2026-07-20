<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Modules\DocumentSystem\Entities\JsaDocument;

class NewJsaDocumentNotification extends Notification
{
    use Queueable;

    public $document;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($document)
    {
        $this->afterCommit();
        $this->document = $document;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return [DocumentSystemChannel::class];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        //
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }

    public function toDatabase($notifiable)
    {
        return [
            'n_type' => '2', // for jsa,
            'ds_status' => JsaDocument::ACTIVE, // for active,
            'document' => $this->document,
        ];
    }
}
