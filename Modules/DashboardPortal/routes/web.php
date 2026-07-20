<?php

use Illuminate\Support\Facades\Route;
use Modules\DashboardPortal\Http\Controllers\DashboardPortalController;

// Protected Dashboard Portal Routes
Route::middleware(['web', 'auth'])->prefix('dashboard-portal')->group(function () {
    Route::get('/', [DashboardPortalController::class, 'dashboardIndex'])
        ->middleware('module.permission:dashboard-portal,can_view')
        ->name('dashboard-portal.dashboard');

    Route::get('/slideshow', [DashboardPortalController::class, 'slideshowIndex'])
        ->middleware('module.permission:dashboard-portal,can_view')
        ->name('dashboard-portal.slideshow');
});
