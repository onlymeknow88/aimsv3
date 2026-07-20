<?php

namespace Modules\DocumentSystem\Jobs;

use Modules\DocumentSystem\Entities\Document;
use Modules\DocumentSystem\Entities\InvitedPeople;
use App\Services\EmailService;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class NotifyAlmostExpireDocumentJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $documents = Document::select(
            'doc_created',
            'id',
            'title',
            'document_number',
            'sop_number',
            'sop_add_win',
            'sop_add_form',
            'document_level',
            'department_id',
            'prefix_code',
        )
            ->with('peoples')
            ->exceptDraft()
            ->get();
        $ids = [];
        foreach ($documents as $document) {
            if (count($document->peoples) > 0) {
                $receiver = collect($document->peoples)->pluck('email')->all();
            } else {
                $receiver = [];
            }
            $expire_date = Carbon::parse($document->doc_created)->addYear(2);
            $expire_lenght = Carbon::parse(date('Y-m-d'))->diffInDays($expire_date);
            if ($expire_lenght == 7) {
                $ids['week'][] = [
                    'id' => $document->id,
                    'title' => $document->title,
                    'document_number' => $document->fix_document_number,
                    'receiver' => $receiver,
                ];
            }

            if ($expire_lenght == 3) {
                $ids['three'][] = [
                    'id' => $document->id,
                    'title' => $document->title,
                    'document_number' => $document->fix_document_number,
                    'receiver' => $receiver,
                ];
            }

            if ($expire_lenght == 1) {
                $ids['one'][] = [
                    'id' => $document->id,
                    'title' => $document->title,
                    'document_number' => $document->fix_document_number,
                    'receiver' => $receiver,
                ];
            }
        }

        if (isset($ids['week'])) {
            $send = $this->notify($receiver, $ids['week'], 7);
        }
        if (isset($ids['three'])) {
            $peoples = $this->getPeoples(collect($ids['three'])->pluck('id')->all());
            $send = $this->notify($receiver, $ids['three'], 3);
        }
        if (isset($ids['one'])) {
            $peoples = $this->getPeoples(collect($ids['one'])->pluck('id')->all());
            $send = $this->notify($receiver, $ids['one'], 1);
        }
    }

    /**
     * Function to get notify email if exist
     * @param array ids
     * @return array
     */
    private function getPeoples($ids)
    {
        $peoples = [];
        for ($a = 0; $a < count($ids); $a++) {
            $invited = InvitedPeople::select("email")
                ->where('document_id', $ids[$a])
                ->first();
            if ($invited) {
                $peoples[] = $invited->email;
            }
        }

        return $peoples;
    }

    /**
     * Function to send email
     */
    private function notify($emails, $documents, $day)
    {
        try {
            if (count($emails) > 0) {
                $email = new EmailService();
                $payload = [
                    'type' => 'almost_expire_document',
                    'receiver' => $emails,
                    'documents' => $documents,
                    'day' => $day,
                    'has_attachments' => false,
                ];
                $email->sendEmail($payload);
            }
            return 'success';
        } catch (\Throwable $th) {
            return $th->getMessage() . ' ' . $th->getLine() . ' ' . $th->getFile();
        }
    }
}
