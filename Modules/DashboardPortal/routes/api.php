<?php

use Illuminate\Support\Facades\Route;
use Modules\DashboardPortal\Http\Controllers\Api\BannerController;
use Modules\DashboardPortal\Http\Controllers\Api\GeneralController;
use Modules\DashboardPortal\Http\Controllers\Api\NewsAndUpdateController;
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
});
