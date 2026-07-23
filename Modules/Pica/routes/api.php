<?php

use Illuminate\Support\Facades\Route;
use Modules\Pica\Http\Controllers\Api\PicaApiController;

Route::prefix('pica')->middleware(['web', 'auth'])->group(function () {

    // Dashboard stats
    Route::get('/dashboard-stats', [PicaApiController::class, 'dashboardStats']);

    // Master data
    Route::get('/master-data', [PicaApiController::class, 'masterData']);

    // Documents CRUD
    Route::get('/documents',         [PicaApiController::class, 'index'])
        ->middleware('module.permission:pica,can_view');
    Route::get('/documents/{id}',    [PicaApiController::class, 'show'])
        ->middleware('module.permission:pica,can_view');
    Route::post('/documents',        [PicaApiController::class, 'store'])
        ->middleware('module.permission:pica,can_create');
    Route::put('/documents/{id}',    [PicaApiController::class, 'update'])
        ->middleware('module.permission:pica,can_edit');
    Route::delete('/documents/{id}', [PicaApiController::class, 'destroy'])
        ->middleware('module.permission:pica,can_delete');

    // Approval workflow
    Route::post('/documents/{id}/approval',   [PicaApiController::class, 'approval'])
        ->middleware('module.permission:pica,can_approval');

    // Activities
    Route::post('/documents/{id}/activities', [PicaApiController::class, 'storeActivity'])
        ->middleware('module.permission:pica,can_create');
    Route::delete('/activities/{activityId}', [PicaApiController::class, 'destroyActivity'])
        ->middleware('module.permission:pica,can_delete');

    // Files — SAS on-demand (view permission)
    Route::get('/files/{fileId}/preview',           [PicaApiController::class, 'previewFile'])
        ->middleware('module.permission:pica,can_view');
    Route::get('/files/{fileId}/download',          [PicaApiController::class, 'downloadFile'])
        ->middleware('module.permission:pica,can_view');
    Route::get('/activity-files/{fileId}/preview',  [PicaApiController::class, 'previewActivityFile'])
        ->middleware('module.permission:pica,can_view');
    Route::get('/activity-files/{fileId}/download', [PicaApiController::class, 'downloadActivityFile'])
        ->middleware('module.permission:pica,can_view');
});
