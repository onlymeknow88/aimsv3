<?php

use Illuminate\Support\Facades\Route;
use Modules\DashboardPortal\Http\Controllers\Api\BannerController;
use Modules\DashboardPortal\Http\Controllers\Api\GeneralController;
use Modules\DashboardPortal\Http\Controllers\Api\HealthPerformanceController;
use Modules\DashboardPortal\Http\Controllers\Api\IncidentNotificationController;
use Modules\DashboardPortal\Http\Controllers\Api\NewsAndUpdateController;
use Modules\DashboardPortal\Http\Controllers\Api\ProductionController;
use Modules\DashboardPortal\Http\Controllers\Api\SafetyPerformanceController;
use Modules\DashboardPortal\Http\Controllers\Api\SlideshowController;

use Modules\DashboardPortal\Http\Controllers\DashboardPortalController;

// Protected Dashboard Portal API Routes (CRUD actions)
Route::middleware(['web', 'auth', 'module.permission:dashboard-portal,can_view'])->prefix('dashboard-portal')->group(function () {
    Route::post('/settings', [DashboardPortalController::class, 'updateSetting'])->middleware('module.permission:dashboard-portal,can_edit');

    // Slideshow
    Route::get('/slideshows', [SlideshowController::class, 'getSlideShow']);
    Route::post('/slideshows', [SlideshowController::class, 'storeSlideShow'])->middleware('module.permission:dashboard-portal,can_create');
    Route::put('/slideshows/{id}', [SlideshowController::class, 'updateSlideShow'])->middleware('module.permission:dashboard-portal,can_edit');
    Route::post('/slideshows/{id}/update', [SlideshowController::class, 'updateSlideShow'])->middleware('module.permission:dashboard-portal,can_edit'); // IIS POST alternative
    Route::delete('/slideshows/{id}', [SlideshowController::class, 'deleteSlideShow'])->middleware('module.permission:dashboard-portal,can_delete');
    Route::post('/slideshows/{id}/delete', [SlideshowController::class, 'deleteSlideShow'])->middleware('module.permission:dashboard-portal,can_delete'); // IIS POST alternative

    // Banner
    Route::get('/banners', [BannerController::class, 'getBanner']);
    Route::post('/banners', [BannerController::class, 'storeBanner'])->middleware('module.permission:dashboard-portal,can_create');
    Route::put('/banners/{id}', [BannerController::class, 'updateBanner'])->middleware('module.permission:dashboard-portal,can_edit');
    Route::post('/banners/{id}/update', [BannerController::class, 'updateBanner'])->middleware('module.permission:dashboard-portal,can_edit'); // IIS POST alternative
    Route::delete('/banners/{id}', [BannerController::class, 'deleteBanner'])->middleware('module.permission:dashboard-portal,can_delete');
    Route::post('/banners/{id}/delete', [BannerController::class, 'deleteBanner'])->middleware('module.permission:dashboard-portal,can_delete'); // IIS POST alternative

    // General KPI
    Route::get('/general', [GeneralController::class, 'index']);
    Route::post('/general', [GeneralController::class, 'store'])->middleware('module.permission:dashboard-portal,can_create');
    Route::put('/general/{id}', [GeneralController::class, 'update'])->middleware('module.permission:dashboard-portal,can_edit');
    Route::post('/general/{id}/update', [GeneralController::class, 'update'])->middleware('module.permission:dashboard-portal,can_edit'); // IIS POST alternative
    Route::delete('/general/{id}', [GeneralController::class, 'destroy'])->middleware('module.permission:dashboard-portal,can_delete');
    Route::post('/general/{id}/delete', [GeneralController::class, 'destroy'])->middleware('module.permission:dashboard-portal,can_delete'); // IIS POST alternative

    // News and Update
    Route::get('/news-and-update', [NewsAndUpdateController::class, 'index']);
    Route::post('/news-and-update', [NewsAndUpdateController::class, 'store'])->middleware('module.permission:dashboard-portal,can_create');
    Route::put('/news-and-update/{id}', [NewsAndUpdateController::class, 'update'])->middleware('module.permission:dashboard-portal,can_edit');
    Route::post('/news-and-update/{id}/update', [NewsAndUpdateController::class, 'update'])->middleware('module.permission:dashboard-portal,can_edit'); // IIS POST alternative
    Route::delete('/news-and-update/{id}', [NewsAndUpdateController::class, 'destroy'])->middleware('module.permission:dashboard-portal,can_delete');
    Route::post('/news-and-update/{id}/delete', [NewsAndUpdateController::class, 'destroy'])->middleware('module.permission:dashboard-portal,can_delete'); // IIS POST alternative

    // Incident Notification
    Route::get('/incident-notification/stats', [IncidentNotificationController::class, 'stats']);
    Route::get('/incident-notification', [IncidentNotificationController::class, 'index']);
    Route::post('/incident-notification', [IncidentNotificationController::class, 'store'])->middleware('module.permission:dashboard-portal,can_create');
    Route::put('/incident-notification/{id}', [IncidentNotificationController::class, 'update'])->middleware('module.permission:dashboard-portal,can_edit');
    Route::post('/incident-notification/{id}/update', [IncidentNotificationController::class, 'update'])->middleware('module.permission:dashboard-portal,can_edit'); // IIS POST alternative
    Route::delete('/incident-notification/{id}', [IncidentNotificationController::class, 'destroy'])->middleware('module.permission:dashboard-portal,can_delete');
    Route::post('/incident-notification/{id}/delete', [IncidentNotificationController::class, 'destroy'])->middleware('module.permission:dashboard-portal,can_delete'); // IIS POST alternative
    Route::post('/incident-notification/bulk-delete', [IncidentNotificationController::class, 'bulkDestroy'])->middleware('module.permission:dashboard-portal,can_delete');
    Route::post('/incident-notification/{id}/toggle-visible', [IncidentNotificationController::class, 'toggleVisible'])->middleware('module.permission:dashboard-portal,can_edit');
    Route::post('/incident-notification/bulk-toggle-visible', [IncidentNotificationController::class, 'bulkToggleVisible'])->middleware('module.permission:dashboard-portal,can_edit');

    // Production
    Route::get('/production/stats',                    [ProductionController::class, 'stats']);
    Route::get('/production',                          [ProductionController::class, 'index']);
    Route::post('/production',                         [ProductionController::class, 'store'])->middleware('module.permission:dashboard-portal,can_create');
    Route::put('/production/{id}',                     [ProductionController::class, 'update'])->middleware('module.permission:dashboard-portal,can_edit');
    Route::post('/production/{id}/update',             [ProductionController::class, 'update'])->middleware('module.permission:dashboard-portal,can_edit'); // IIS POST alternative
    Route::delete('/production/{id}',                  [ProductionController::class, 'destroy'])->middleware('module.permission:dashboard-portal,can_delete');
    Route::post('/production/{id}/delete',             [ProductionController::class, 'destroy'])->middleware('module.permission:dashboard-portal,can_delete'); // IIS POST alternative
    Route::post('/production/bulk-delete',             [ProductionController::class, 'bulkDestroy'])->middleware('module.permission:dashboard-portal,can_delete');
    Route::post('/production/{id}/toggle-visible',     [ProductionController::class, 'toggleVisible'])->middleware('module.permission:dashboard-portal,can_edit');
    Route::post('/production/bulk-toggle-visible',     [ProductionController::class, 'bulkToggleVisible'])->middleware('module.permission:dashboard-portal,can_edit');

    // Safety Performance
    Route::get('/safety-performance/stats',              [SafetyPerformanceController::class, 'stats']);
    Route::get('/safety-performance',                    [SafetyPerformanceController::class, 'index']);
    Route::post('/safety-performance',                   [SafetyPerformanceController::class, 'store'])->middleware('module.permission:dashboard-portal,can_create');
    Route::put('/safety-performance/{id}',               [SafetyPerformanceController::class, 'update'])->middleware('module.permission:dashboard-portal,can_edit');
    Route::post('/safety-performance/{id}/update',       [SafetyPerformanceController::class, 'update'])->middleware('module.permission:dashboard-portal,can_edit');
    Route::delete('/safety-performance/{id}',            [SafetyPerformanceController::class, 'destroy'])->middleware('module.permission:dashboard-portal,can_delete');
    Route::post('/safety-performance/{id}/delete',       [SafetyPerformanceController::class, 'destroy'])->middleware('module.permission:dashboard-portal,can_delete');
    Route::post('/safety-performance/bulk-delete',       [SafetyPerformanceController::class, 'bulkDestroy'])->middleware('module.permission:dashboard-portal,can_delete');
    Route::post('/safety-performance/{id}/toggle-visible', [SafetyPerformanceController::class, 'toggleVisible'])->middleware('module.permission:dashboard-portal,can_edit');

    // Health Performance
    Route::get('/health-performance/stats',              [HealthPerformanceController::class, 'stats']);
    Route::get('/health-performance',                    [HealthPerformanceController::class, 'index']);
    Route::post('/health-performance',                   [HealthPerformanceController::class, 'store'])->middleware('module.permission:dashboard-portal,can_create');
    Route::put('/health-performance/{id}',               [HealthPerformanceController::class, 'update'])->middleware('module.permission:dashboard-portal,can_edit');
    Route::post('/health-performance/{id}/update',       [HealthPerformanceController::class, 'update'])->middleware('module.permission:dashboard-portal,can_edit');
    Route::delete('/health-performance/{id}',            [HealthPerformanceController::class, 'destroy'])->middleware('module.permission:dashboard-portal,can_delete');
    Route::post('/health-performance/{id}/delete',       [HealthPerformanceController::class, 'destroy'])->middleware('module.permission:dashboard-portal,can_delete');
    Route::post('/health-performance/bulk-delete',       [HealthPerformanceController::class, 'bulkDestroy'])->middleware('module.permission:dashboard-portal,can_delete');
    Route::post('/health-performance/{id}/toggle-visible', [HealthPerformanceController::class, 'toggleVisible'])->middleware('module.permission:dashboard-portal,can_edit');
});
