<?php

use Illuminate\Support\Facades\Route;
use Modules\Coe\Http\Controllers\CoeController;

// Public CoE Routes
Route::middleware(['web'])->prefix('coe')->group(function () {
    Route::get('/calendar', [CoeController::class, 'calendarIndex'])->name('coe.calendar');
});

// Protected CoE Routes
Route::middleware(['web', 'auth'])->prefix('coe')->group(function () {
    Route::get('/', [CoeController::class, 'dashboardIndex'])
        ->middleware('module.permission:calender-of-event-coe,can_view')
        ->name('coe.dashboard');

    Route::get('/categories', [CoeController::class, 'categoryIndex'])
        ->middleware('module.permission:calender-of-event-coe,can_view')
        ->name('coe.categories');

    Route::get('/list', [CoeController::class, 'listIndex'])
        ->middleware('module.permission:calender-of-event-coe,can_view')
        ->name('coe.list');
});
