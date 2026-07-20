<?php

namespace Modules\DocumentSystem\Jobs;

use Modules\DocumentSystem\Entities\Document;
use Modules\DocumentSystem\Entities\JsaDocument;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class CheckExpireJsaDocumentJob implements ShouldQueue
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
            $documents = JsaDocument::select('id', 'status', 'doc_created')
                ->where('status', JsaDocument::ACTIVE)
                ->get();

            $emails = [];
            $ids = [];
            foreach ($documents as $document) {
                $expire_date = Carbon::parse($document->doc_created)->addYear(1);
                if (Carbon::parse($expire_date) <= Carbon::now()) {
                    $exp_doc = JsaDocument::with('peoples')
                        ->find($document->id);
                    $ids[] = $document->id;
                    $peoples = $exp_doc->peoples;
                    if (count($peoples) > 0) {
                        $emails = collect($peoples)->pluck('email')->all();
                    }
                    $exp_doc->status = JsaDocument::EXPIRED;
                    $exp_doc->save();
                }
            }

            if (count($emails) > 0) {
                NotifyExpireJsaDocumentJob::dispatch($emails, $ids);
            }
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
        }
    }
}
