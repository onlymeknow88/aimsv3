<?php

use Illuminate\Support\Facades\Route;
use Modules\DashboardPortal\Http\Controllers\Api\BannerController;
use Modules\DashboardPortal\Http\Controllers\Api\SlideshowController;

// Protected CoE API Routes (CRUD actions)
Route::middleware(['web', 'auth'])->prefix('dashboard-portal')->group(function () {

    // Slideshow Modifications
    Route::get('/slideshows', [SlideshowController::class, 'getSlideShow'])->middleware('module.permission:dashboard-portal,can_view');
    Route::post('/slideshows', [SlideshowController::class, 'storeSlideShow'])->middleware('module.permission:dashboard-portal,can_create');
    Route::put('/slideshows/{id}', [SlideshowController::class, 'updateSlideShow'])->middleware('module.permission:dashboard-portal,can_edit');
    Route::delete('/slideshows/{id}', [SlideshowController::class, 'deleteSlideShow'])->middleware('module.permission:dashboard-portal,can_delete');

    // Banner Modifications
    Route::get('/banners', [BannerController::class, 'getBanner'])->middleware('module.permission:dashboard-portal,can_view');
    Route::post('/banners', [BannerController::class, 'storeBanner'])->middleware('module.permission:dashboard-portal,can_create');
    Route::put('/banners/{id}', [BannerController::class, 'updateBanner'])->middleware('module.permission:dashboard-portal,can_edit');
    Route::delete('/banners/{id}', [BannerController::class, 'deleteBanner'])->middleware('module.permission:dashboard-portal,can_delete');
});
