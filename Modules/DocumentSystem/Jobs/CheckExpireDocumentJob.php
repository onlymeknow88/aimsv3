<?php

namespace Modules\DocumentSystem\Jobs;

use App\Services\EmailService;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Modules\DocumentSystem\Entities\Document;

class CheckExpireDocumentJob implements ShouldQueue
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
        DB::beginTransaction();
        try {
            $documents = Document::select('id', 'status', 'doc_created')
                ->where('status', Document::ACTIVE)
                ->get();

            $emails = [];
            $ids = [];
            foreach ($documents as $document) {
                $expire_date = Carbon::parse($document->doc_created)->addYear(2);
                if (Carbon::parse($expire_date) <= Carbon::now()) {
                    $exp_doc = Document::with('peoples')
                        ->find($document->id);
                    $ids[] = $document->id;
                    $peoples = $exp_doc->peoples;
                    if (count($peoples) > 0) {
                        $emails = collect($peoples)->pluck('email')->all();
                    }
                    $exp_doc->status = Document::EXPIRED;
                    $exp_doc->save();
                }
            }

            if (count($emails) > 0) {
                NotifyExpireDocumentJob::dispatch($emails, $ids);
            }
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
        }
    }
}
