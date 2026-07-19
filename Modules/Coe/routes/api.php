<?php

use Illuminate\Support\Facades\Route;
use Modules\Coe\Http\Controllers\Api\CoeApiController;

Route::middleware(['web', 'auth', 'module.permission:calender-of-event-coe,can_view'])->prefix('coe')->group(function () {
    Route::get('/categories', [CoeApiController::class, 'getCategories']);
    Route::post('/categories', [CoeApiController::class, 'storeCategory'])->middleware('module.permission:calender-of-event-coe,can_create');
    Route::put('/categories/{id}', [CoeApiController::class, 'updateCategory'])->middleware('module.permission:calender-of-event-coe,can_edit');
    Route::delete('/categories/{id}', [CoeApiController::class, 'deleteCategory'])->middleware('module.permission:calender-of-event-coe,can_delete');

    Route::get('/events', [CoeApiController::class, 'getEvents']);
    Route::post('/events', [CoeApiController::class, 'storeEvent'])->middleware('module.permission:calender-of-event-coe,can_create');
    Route::put('/events/{id}', [CoeApiController::class, 'updateEvent'])->middleware('module.permission:calender-of-event-coe,can_edit');
    Route::delete('/events/{id}', [CoeApiController::class, 'deleteEvent'])->middleware('module.permission:calender-of-event-coe,can_delete');

    Route::get('/sections', [CoeApiController::class, 'getSections']);
});
