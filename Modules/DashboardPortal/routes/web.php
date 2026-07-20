<?php

use Illuminate\Support\Facades\Route;
use Modules\DashboardPortal\Http\Controllers\DashboardPortalController;

// Protected Dashboard Portal Routes
Route::middleware(['web', 'auth'])->prefix('dashboard-portal')->group(function () {
    Route::get('/', function () {
        return redirect()->route('dashboard-portal.dashboard');
    });

    Route::get('/dashboard', [DashboardPortalController::class, 'dashboardIndex'])
        ->middleware('module.permission:dashboard-portal,can_view')
        ->name('dashboard-portal.dashboard');

    Route::get('/slideshow', [DashboardPortalController::class, 'slideshowIndex'])
        ->middleware('module.permission:dashboard-portal,can_view')
        ->name('dashboard-portal.slideshow');

    Route::get('/banner', [DashboardPortalController::class, 'bannerIndex'])
        ->middleware('module.permission:dashboard-portal,can_view')
        ->name('dashboard-portal.banner');

    Route::get('/general', [DashboardPortalController::class, 'generalIndex'])
        ->middleware('module.permission:dashboard-portal,can_view')
        ->name('dashboard-portal.general');

    Route::get('/news-and-update', [DashboardPortalController::class, 'newsAndUpdateIndex'])
        ->middleware('module.permission:dashboard-portal,can_view')
        ->name('dashboard-portal.news-and-update');
});
