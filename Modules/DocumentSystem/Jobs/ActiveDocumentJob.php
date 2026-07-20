<?php

namespace Modules\DocumentSystem\Jobs;

use Modules\DocumentSystem\Entities\Document;
use Modules\DocumentSystem\Entities\InvitedPeople;
use App\Models\User;
use App\Notifications\NewDocumentSystemNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Notification;

class ActiveDocumentJob implements ShouldQueue
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
        // get related user which will receive notification
        $document = Document::find($this->document_id);
        $related = InvitedPeople::select("user_id")
            ->where('user_type', 1)
            ->where('document_id', $this->document_id)
            ->get();
        $ids = collect($related)->pluck('user_id')->all();

        $users = User::whereIn('id', $ids)->get();

        Notification::send($users, new NewDocumentSystemNotification($document));
    }
}
