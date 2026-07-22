<?php

namespace Modules\DocumentSystem\Jobs;

use Modules\DocumentSystem\Entities\Document;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class NotifyCreateDocument implements ShouldQueue
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
        $document = Document::with([
            'peoples:document_id,email',
            'attachments:document_id,path',
            'user:id,name'
        ])->find($this->document_id);

        if (! $document) {
            return;
        }

        $receiver = collect($document->peoples)->pluck('email')->implode(';');
        $attachments = $document->attachments;
        $attachmentPath = $attachments->isNotEmpty() ? $attachments->first()->path : '';
        $attachmentName = $attachmentPath ? basename($attachmentPath) : '';

        $html = view('email_templates.document_system_review', [
            'title'      => $document->title,
            'pic'        => $document->user->name,
            'action_url' => url('document-systems/login'),
        ])->render();

        sendPowerAutomateEmail([
            'SendTo'          => $receiver,
            'Title'           => 'New Document: ' . $document->title,
            'MsgBody'         => $html,
            'AttchmentPath'   => $attachmentPath,
            'AttchmentName'   => $attachmentName,
            'SendCC'          => '',
        ]);
    }
}
