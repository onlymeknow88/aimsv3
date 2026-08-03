<?php

namespace Modules\DocumentSystem\Jobs;

use Modules\DocumentSystem\Entities\Document;
use Modules\DocumentSystem\Entities\InvitedPeople;
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
            $expire_date = Carbon::parse($document->doc_created)->addYears(4)->startOfDay();
            $today = Carbon::today();

            if ($expire_date->copy()->subMonths(7)->equalTo($today)) {
                $ids['7_months'][] = [
                    'id' => $document->id,
                    'title' => $document->title,
                    'document_number' => $document->fix_document_number,
                    'receiver' => $receiver,
                ];
            }

            if ($expire_date->copy()->subMonths(3)->equalTo($today)) {
                $ids['3_months'][] = [
                    'id' => $document->id,
                    'title' => $document->title,
                    'document_number' => $document->fix_document_number,
                    'receiver' => $receiver,
                ];
            }

            if ($expire_date->copy()->subMonths(1)->equalTo($today)) {
                $ids['1_month'][] = [
                    'id' => $document->id,
                    'title' => $document->title,
                    'document_number' => $document->fix_document_number,
                    'receiver' => $receiver,
                ];
            }

            if ($expire_date->copy()->subWeeks(1)->equalTo($today)) {
                $ids['1_week'][] = [
                    'id' => $document->id,
                    'title' => $document->title,
                    'document_number' => $document->fix_document_number,
                    'receiver' => $receiver,
                ];
            }
        }

        if (isset($ids['7_months'])) {
            $emails = [];
            foreach ($ids['7_months'] as $item) {
                $emails = array_merge($emails, $item['receiver']);
            }
            $emails = array_unique($emails);
            $send = $this->notify($emails, $ids['7_months'], '7 Bulan');
        }

        if (isset($ids['3_months'])) {
            $emails = [];
            foreach ($ids['3_months'] as $item) {
                $emails = array_merge($emails, $item['receiver']);
            }
            $emails = array_unique($emails);
            $send = $this->notify($emails, $ids['3_months'], '3 Bulan');
        }

        if (isset($ids['1_month'])) {
            $emails = [];
            foreach ($ids['1_month'] as $item) {
                $emails = array_merge($emails, $item['receiver']);
            }
            $emails = array_unique($emails);
            $send = $this->notify($emails, $ids['1_month'], '1 Bulan');
        }

        if (isset($ids['1_week'])) {
            $emails = [];
            foreach ($ids['1_week'] as $item) {
                $emails = array_merge($emails, $item['receiver']);
            }
            $emails = array_unique($emails);
            $send = $this->notify($emails, $ids['1_week'], '1 Minggu');
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
     * Function to send email via Power Automate
     */
    private function notify($emails, $documents, $day)
    {
        try {
            if (count($emails) > 0) {
                $receiver = is_array($emails)
                    ? implode(';', $emails)
                    : $emails;

                $html = view('documentsystem::email_templates.almost_expire_document', [
                    'documents' => $documents,
                    'day'       => $day,
                ])->render();

                sendPowerAutomateEmail([
                    'SendTo'        => $receiver,
                    'Title'         => 'Reminder: Document Will Expire in ' . (is_numeric($day) ? $day . ' Day(s)' : $day),
                    'MsgBody'       => $html,
                    'AttchmentPath' => '',
                    'AttchmentName' => '',
                    'SendCC'        => '',
                ]);
            }
            return 'success';
        } catch (\Throwable $th) {
            return $th->getMessage() . ' ' . $th->getLine() . ' ' . $th->getFile();
        }
    }
}
