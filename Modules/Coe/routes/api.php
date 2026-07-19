<?php

use Illuminate\Support\Facades\Route;
use Modules\Coe\Http\Controllers\Api\CoeApiController;

// Public CoE API Routes (View events, categories, and sections)
Route::middleware(['web'])->prefix('coe')->group(function () {
    Route::get('/categories', [CoeApiController::class, 'getCategories']);
    Route::get('/events', [CoeApiController::class, 'getEvents']);
    Route::get('/sections', [CoeApiController::class, 'getSections']);
});

// Protected CoE API Routes (CRUD actions)
Route::middleware(['web', 'auth'])->prefix('coe')->group(function () {
    // Categories Modifications
    Route::post('/categories', [CoeApiController::class, 'storeCategory'])->middleware('module.permission:calender-of-event-coe,can_create');
    Route::put('/categories/{id}', [CoeApiController::class, 'updateCategory'])->middleware('module.permission:calender-of-event-coe,can_edit');
    Route::delete('/categories/{id}', [CoeApiController::class, 'deleteCategory'])->middleware('module.permission:calender-of-event-coe,can_delete');

    // Events Modifications
    Route::post('/events', [CoeApiController::class, 'storeEvent'])->middleware('module.permission:calender-of-event-coe,can_create');
    Route::put('/events/{id}', [CoeApiController::class, 'updateEvent'])->middleware('module.permission:calender-of-event-coe,can_edit');
    Route::delete('/events/{id}', [CoeApiController::class, 'deleteEvent'])->middleware('module.permission:calender-of-event-coe,can_delete');
});
