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
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, \App\Traits\SendsEmail;

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
            'invitedPeople:document_id,email',
            'attachments:document_id,path',
            'user:id,name'
        ])->find($this->document_id);

        if (! $document) {
            return;
        }

        $receiver = collect($document->invitedPeople)->pluck('email')->filter()->implode(';');
        $attachments = $document->attachments;
        $attachmentPath = $attachments->isNotEmpty() ? $attachments->first()->path : '';
        $attachmentName = $attachmentPath ? basename($attachmentPath) : '';

        $attachmentsList = [];
        if ($attachmentPath) {
            // If it's a blob storage path, we should fetch it or pass it.
            // Under Laravel SendsEmail trait, it expects a path or structured array.
            // Let's download the attachment if it is stored in Azure Blob:
            try {
                $sas = GetBlobSasUri('aims-cntr', $attachmentPath);
                $url = is_array($sas)
                    ? ($sas['blobUriSas'] ?? $sas['sasUri'] ?? $sas['url'] ?? $sas['blobUri'] ?? null)
                    : $sas;
                if ($url) {
                    $client = new \GuzzleHttp\Client(['verify' => config('app.env') === 'production']);
                    $contents = $client->get($url)->getBody()->getContents();
                    $tempPath = tempnam(sys_get_temp_dir(), 'mail_doc_');
                    file_put_contents($tempPath, $contents);
                    $attachmentsList[] = [
                        'name' => $attachmentName ?: 'document.pdf',
                        'path' => $tempPath,
                    ];
                }
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::error('Failed to download attachment for NotifyCreateDocument job: ' . $e->getMessage());
            }
        }

        if ($receiver) {
            $this->sendEmailWithTemplate(
                viewTemplate: 'documentsystem::email_templates.document_system_review',
                mailData: [
                    'title'      => $document->title,
                    'pic'        => $document->user->name ?? '-',
                    'action_url' => url('document-systems/login'),
                ],
                recipients: $receiver,
                subject: 'New Document: ' . $document->title,
                cc: null,
                bcc: null,
                attachments: $attachmentsList
            );
        }

        // Cleanup temporary files
        foreach ($attachmentsList as $att) {
            if (isset($att['path']) && file_exists($att['path'])) {
                @unlink($att['path']);
            }
        }
    }
}
