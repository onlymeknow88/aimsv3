<?php

use Illuminate\Support\Facades\Route;
use Modules\Ko\Http\Controllers\Api\KoCommissioningApiController;
use Modules\Ko\Http\Controllers\Api\KoDashboardApiController;
use Modules\Ko\Http\Controllers\Api\KoIssueApiController;
use Modules\Ko\Http\Controllers\Api\KoMasterApiController;
use Modules\Ko\Http\Controllers\Api\KoProposalApiController;

Route::prefix('ko')->middleware(['web', 'auth'])->group(function () {

    Route::get('/dashboard-stats', [KoDashboardApiController::class, 'stats'])
        ->middleware('module.permission:ko,can_view');

    // Master data untuk form
    Route::get('/master-data', [KoMasterApiController::class, 'masterData'])
        ->middleware('module.permission:ko,can_view');

    // Master Library
    Route::get('/categories',          [KoMasterApiController::class, 'indexCategories'])->middleware('module.permission:ko,can_view');
    Route::post('/categories',         [KoMasterApiController::class, 'storeCategory'])->middleware('module.permission:ko,can_create');
    Route::put('/categories/{id}',     [KoMasterApiController::class, 'updateCategory'])->middleware('module.permission:ko,can_edit');
    Route::delete('/categories/{id}',  [KoMasterApiController::class, 'destroyCategory'])->middleware('module.permission:ko,can_delete');

    Route::get('/types',          [KoMasterApiController::class, 'indexTypes'])->middleware('module.permission:ko,can_view');
    Route::post('/types',         [KoMasterApiController::class, 'storeType'])->middleware('module.permission:ko,can_create');
    Route::put('/types/{id}',     [KoMasterApiController::class, 'updateType'])->middleware('module.permission:ko,can_edit');
    Route::delete('/types/{id}',  [KoMasterApiController::class, 'destroyType'])->middleware('module.permission:ko,can_delete');

    Route::get('/spip-units',          [KoMasterApiController::class, 'indexSpipUnits'])->middleware('module.permission:ko,can_view');
    Route::post('/spip-units',         [KoMasterApiController::class, 'storeSpipUnit'])->middleware('module.permission:ko,can_create');
    Route::put('/spip-units/{id}',     [KoMasterApiController::class, 'updateSpipUnit'])->middleware('module.permission:ko,can_edit');
    Route::delete('/spip-units/{id}',  [KoMasterApiController::class, 'destroySpipUnit'])->middleware('module.permission:ko,can_delete');

    Route::get('/brands',          [KoMasterApiController::class, 'indexBrands'])->middleware('module.permission:ko,can_view');
    Route::post('/brands',         [KoMasterApiController::class, 'storeBrand'])->middleware('module.permission:ko,can_create');
    Route::put('/brands/{id}',     [KoMasterApiController::class, 'updateBrand'])->middleware('module.permission:ko,can_edit');
    Route::delete('/brands/{id}',  [KoMasterApiController::class, 'destroyBrand'])->middleware('module.permission:ko,can_delete');

    Route::get('/units',          [KoMasterApiController::class, 'indexUnits'])->middleware('module.permission:ko,can_view');
    Route::post('/units',         [KoMasterApiController::class, 'storeUnit'])->middleware('module.permission:ko,can_create');
    Route::get('/units/{id}',     [KoMasterApiController::class, 'showUnit'])->middleware('module.permission:ko,can_view');
    Route::put('/units/{id}',     [KoMasterApiController::class, 'updateUnit'])->middleware('module.permission:ko,can_edit');
    Route::delete('/units/{id}',  [KoMasterApiController::class, 'destroyUnit'])->middleware('module.permission:ko,can_delete');
    Route::post('/units/{id}/request-revoke', [KoMasterApiController::class, 'requestRevoke'])->middleware('module.permission:ko,can_edit');
    Route::post('/units/{id}/verify-revoke',  [KoMasterApiController::class, 'verifyRevoke'])->middleware('module.permission:ko,can_approval');

    Route::get('/commissioning-headers', [KoMasterApiController::class, 'indexHeaders'])->middleware('module.permission:ko,can_view');

    // Proposals
    Route::get('/proposals',          [KoProposalApiController::class, 'index'])->middleware('module.permission:ko,can_view');
    Route::post('/proposals',         [KoProposalApiController::class, 'store'])->middleware('module.permission:ko,can_create');
    Route::get('/proposals/{id}',     [KoProposalApiController::class, 'show'])->middleware('module.permission:ko,can_view');
    Route::put('/proposals/{id}',     [KoProposalApiController::class, 'update'])->middleware('module.permission:ko,can_edit');
    Route::delete('/proposals/{id}',  [KoProposalApiController::class, 'destroy'])->middleware('module.permission:ko,can_delete');
    Route::post('/proposals/{id}/submit',        [KoProposalApiController::class, 'submit'])->middleware('module.permission:ko,can_create');
    Route::post('/proposals/{id}/verify',        [KoProposalApiController::class, 'verify'])->middleware('module.permission:ko,can_approval');
    Route::put('/proposals/{id}/attachments',    [KoProposalApiController::class, 'updateAttachments'])->middleware('module.permission:ko,can_edit');
    Route::post('/proposals/{id}/temporary-qr',  [KoProposalApiController::class, 'temporaryQr'])->middleware('module.permission:ko,can_approval');
    Route::post('/proposals/{id}/temporary-qr-request', [KoProposalApiController::class, 'requestTemporaryQr'])->middleware('module.permission:ko,can_create');
    Route::post('/proposals/{id}/qr-files',      [KoProposalApiController::class, 'storeQrFiles'])->middleware('module.permission:ko,can_create');
    Route::get('/proposal-attachments/preview',  [KoProposalApiController::class, 'previewAttachment'])->middleware('module.permission:ko,can_view');
    Route::get('/proposal-attachments/download', [KoProposalApiController::class, 'downloadAttachment'])->middleware('module.permission:ko,can_view');

    // Commissionings
    Route::get('/commissionings',          [KoCommissioningApiController::class, 'index'])->middleware('module.permission:ko,can_view');
    Route::post('/commissionings',         [KoCommissioningApiController::class, 'store'])->middleware('module.permission:ko,can_create');
    Route::get('/commissionings/{id}',     [KoCommissioningApiController::class, 'show'])->middleware('module.permission:ko,can_view');
    Route::post('/commissionings/{id}/verify', [KoCommissioningApiController::class, 'verify'])->middleware('module.permission:ko,can_approval');

    // Issue Reports
    Route::get('/issues',          [KoIssueApiController::class, 'index'])->middleware('module.permission:ko,can_view');
    Route::post('/issues',         [KoIssueApiController::class, 'store'])->middleware('module.permission:ko,can_create');
    Route::put('/issues/{id}',     [KoIssueApiController::class, 'update'])->middleware('module.permission:ko,can_edit');
    Route::post('/issues/{id}/verify',     [KoIssueApiController::class, 'verify'])->middleware('module.permission:ko,can_approval');
    Route::post('/issues/{id}/attachments', [KoIssueApiController::class, 'storeAttachment'])->middleware('module.permission:ko,can_create');
    Route::get('/issue-attachments/{id}/preview',  [KoIssueApiController::class, 'previewAttachment'])->middleware('module.permission:ko,can_view');
    Route::get('/issue-attachments/{id}/download', [KoIssueApiController::class, 'downloadAttachment'])->middleware('module.permission:ko,can_view');
});
