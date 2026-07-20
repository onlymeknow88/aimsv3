<?php

namespace Modules\DocumentSystem\Jobs;

use Modules\DocumentSystem\Entities\Document;
use Modules\DocumentSystem\Entities\JsaDocument;
use App\Services\EmailService;
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
        if (
            count($this->ids) > 0 &&
            count($this->receiver) > 0
        ) {
            $data = [];
            for ($a = 0; $a < count($this->ids); $a++) {
                $document = JsaDocument::select(
                    'title',
                    'id',
                    'document_number',
                    'department_id',
                )
                    ->find($this->ids[$a]);
                $data[] = [
                    'title' => $document->title,
                    'document_number' => $document->document_number,
                ];
            }
            $email = new EmailService();
            $email->sendEmail([
                'receiver' => $this->receiver,
                'type' => 'expire_document',
                'documents' => $data,
            ]);
        }
    }
}
