<?php

namespace Modules\DocumentSystem\Jobs;

use Modules\DocumentSystem\Entities\Document;
use Modules\DocumentSystem\Entities\JsaDocument;
use App\Notifications\NewJsaDocumentNotification;
use App\Services\EmailService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class NotifyCreateJsaDocument implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $document_id;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($document_id)
    {
        $this->document_id = $document_id;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $document = JsaDocument::with([
            'peoples:document_id,email',
            'attachments:document_id,path',
            'user:id,name'
        ])
            ->find($this->document_id);

        $peoples = $document->peoples;
        $documents = $document->attachments;
        $payload = [
            'type' => 'new_document_jsa',
            'receiver' => collect($peoples)->pluck('email')->all(),
            'title' => $document->title,
            'pic' => $document->user->name,
            'has_attachments' => true,
            'files' => collect($documents)->pluck('path')->all(),
        ];

        $email = new EmailService();
        $email->sendEmail($payload);
    }
}
