<?php

namespace Modules\Pica\App\Providers;

use Illuminate\Console\Scheduling\Schedule;
use Modules\Pica\Entities\PicaDocument;
use Nwidart\Modules\Support\ModuleServiceProvider;

class PicaServiceProvider extends ModuleServiceProvider
{
    /**
     * The name of the module.
     */
    protected string $name = 'Pica';

    /**
     * The lowercase version of the module name.
     */
    protected string $nameLower = 'pica';

    /**
     * Command classes to register.
     *
     * @var string[]
     */
    // protected array $commands = [];

    /**
     * Provider classes to register.
     *
     * @var string[]
     */
    protected array $providers = [
        EventServiceProvider::class,
        RouteServiceProvider::class,
    ];

    /**
     * Define module schedules.
     *
     * @param $schedule
     */
    protected function configureSchedules(Schedule $schedule): void
    {
        // Daily: auto-mark Open documents past target_settlement_date as Overdue
        $schedule->call(function () {
            PicaDocument::where('status', 'Open')
                ->whereNotNull('target_settlement_date')
                ->where('target_settlement_date', '<', today())
                ->update(['status' => 'Overdue']);
        })->daily()->name('pica:mark-overdue');
    }
}
