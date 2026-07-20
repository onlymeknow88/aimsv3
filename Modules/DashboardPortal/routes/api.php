<?php

use Illuminate\Support\Facades\Route;
use Modules\DashboardPortal\Http\Controllers\Api\BannerController;
use Modules\DashboardPortal\Http\Controllers\Api\GeneralController;
use Modules\DashboardPortal\Http\Controllers\Api\NewsAndUpdateController;
use Modules\DashboardPortal\Http\Controllers\Api\SlideshowController;

// Protected Dashboard Portal API Routes (CRUD actions)
Route::middleware(['web', 'auth', 'module.permission:dashboard-portal,can_view'])->prefix('dashboard-portal')->group(function () {

    // Slideshow
    Route::get('/slideshows', [SlideshowController::class, 'getSlideShow']);
    Route::post('/slideshows', [SlideshowController::class, 'storeSlideShow'])->middleware('module.permission:dashboard-portal,can_create');
    Route::put('/slideshows/{id}', [SlideshowController::class, 'updateSlideShow'])->middleware('module.permission:dashboard-portal,can_edit');
    Route::delete('/slideshows/{id}', [SlideshowController::class, 'deleteSlideShow'])->middleware('module.permission:dashboard-portal,can_delete');

    // Banner
    Route::get('/banners', [BannerController::class, 'getBanner']);
    Route::post('/banners', [BannerController::class, 'storeBanner'])->middleware('module.permission:dashboard-portal,can_create');
    Route::put('/banners/{id}', [BannerController::class, 'updateBanner'])->middleware('module.permission:dashboard-portal,can_edit');
    Route::delete('/banners/{id}', [BannerController::class, 'deleteBanner'])->middleware('module.permission:dashboard-portal,can_delete');

    // General KPI
    Route::get('/general', [GeneralController::class, 'index']);
    Route::post('/general', [GeneralController::class, 'store'])->middleware('module.permission:dashboard-portal,can_create');
    Route::put('/general/{id}', [GeneralController::class, 'update'])->middleware('module.permission:dashboard-portal,can_edit');
    Route::delete('/general/{id}', [GeneralController::class, 'destroy'])->middleware('module.permission:dashboard-portal,can_delete');

    // News and Update
    Route::get('/news-and-update', [NewsAndUpdateController::class, 'index']);
    Route::post('/news-and-update', [NewsAndUpdateController::class, 'store'])->middleware('module.permission:dashboard-portal,can_create');
    Route::put('/news-and-update/{id}', [NewsAndUpdateController::class, 'update'])->middleware('module.permission:dashboard-portal,can_edit');
    Route::delete('/news-and-update/{id}', [NewsAndUpdateController::class, 'destroy'])->middleware('module.permission:dashboard-portal,can_delete');
});
