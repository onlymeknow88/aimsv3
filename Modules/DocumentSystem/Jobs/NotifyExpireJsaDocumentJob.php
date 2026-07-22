<?php

namespace Modules\DocumentSystem\Jobs;

use Modules\DocumentSystem\Entities\JsaDocument;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class NotifyExpireJsaDocumentJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $receiver;
    public $ids;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($receiver, $ids)
    {
        $this->receiver = $receiver;
        $this->ids = $ids;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        if (empty($this->ids) || empty($this->receiver)) {
            return;
        }

        $data = JsaDocument::select('title', 'id', 'document_number', 'department_id')
            ->whereIn('id', $this->ids)
            ->get()
            ->map(fn($doc) => [
                'title'           => $doc->title,
                'document_number' => $doc->document_number,
            ])->all();

        $receiver = is_array($this->receiver)
            ? implode(';', $this->receiver)
            : $this->receiver;

        $html = view('email_templates.expire_document', [
            'documents' => $data,
        ])->render();

        sendPowerAutomateEmail([
            'SendTo'        => $receiver,
            'Title'         => 'Expire JSA Document',
            'MsgBody'       => $html,
            'AttchmentPath' => '',
            'AttchmentName' => '',
            'SendCC'        => '',
        ]);
    }
}
