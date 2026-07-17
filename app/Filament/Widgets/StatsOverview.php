<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Users', \App\Models\User::where('is_active', true)->count())
                ->description('User aktif di sistem')
                ->color('success')
                ->icon('heroicon-o-users'),

            Stat::make('Companies', \App\Models\Company::count())
                ->description('Total perusahaan terdaftar')
                ->color('primary')
                ->icon('heroicon-o-building-library'),

            Stat::make('Departments', \App\Models\Department::count())
                ->description('Total departemen terdaftar')
                ->color('info')
                ->icon('heroicon-o-building-office'),
        ];
    }
}
