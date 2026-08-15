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

    Route::get('/incident-notification', [DashboardPortalController::class, 'incidentNotificationIndex'])
        ->middleware('module.permission:dashboard-portal,can_view')
        ->name('dashboard-portal.incident-notification');

    Route::get('/production', [DashboardPortalController::class, 'productionIndex'])
        ->middleware('module.permission:dashboard-portal,can_view')
        ->name('dashboard-portal.production');

    Route::get('/safety-performance', [DashboardPortalController::class, 'safetyPerformanceIndex'])
        ->middleware('module.permission:dashboard-portal,can_view')
        ->name('dashboard-portal.safety-performance');

    Route::get('/health-performance', [DashboardPortalController::class, 'healthPerformanceIndex'])
        ->middleware('module.permission:dashboard-portal,can_view')
        ->name('dashboard-portal.health-performance');
});
