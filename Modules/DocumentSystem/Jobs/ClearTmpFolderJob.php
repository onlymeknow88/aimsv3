<?php

namespace Modules\DocumentSystem\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\File;

class ClearTmpFolderJob implements ShouldQueue
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
    public function handle(): void
    {
        if (File::exists(public_path('storage/tmp'))) {
            $path = public_path('storage/tmp');
            $all = scandir($path);
            foreach ($all as $a) {
                if ($a != '.' || $a != '..') {
                    if (File::exists(public_path('storage/tmp/' . $a))) {
                        File::deleteDirectories(public_path('storage/tmp/' . $a));
                    }
                }
            }
        }
    }
}
