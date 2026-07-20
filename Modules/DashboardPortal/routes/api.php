<?php

use Illuminate\Support\Facades\Route;
use Modules\DashboardPortal\Http\Controllers\Api\SlideshowController;

// Protected CoE API Routes (CRUD actions)
Route::middleware(['web', 'auth'])->prefix('dashboard-portal')->group(function () {

    // Slideshow Modifications
    Route::get('/slideshows', [SlideshowController::class, 'getSlideShow'])->middleware('module.permission:dashboard-portal,can_view');
    Route::post('/slideshows', [SlideshowController::class, 'storeSlideShow'])->middleware('module.permission:dashboard-portal,can_create');
    Route::put('/slideshows/{id}', [SlideshowController::class, 'updateSlideShow'])->middleware('module.permission:dashboard-portal,can_edit');
    Route::delete('/slideshows/{id}', [SlideshowController::class, 'deleteSlideShow'])->middleware('module.permission:dashboard-portal,can_delete');
});
