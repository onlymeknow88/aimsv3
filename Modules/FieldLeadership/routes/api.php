<?php

use Illuminate\Support\Facades\Route;
use Modules\FieldLeadership\Http\Controllers\Api\FieldLeadershipApiController;
use Modules\FieldLeadership\Http\Controllers\Api\FieldLeadershipApprovalApiController;
use Modules\FieldLeadership\Http\Controllers\Api\FieldLeadershipMasterApiController;
use Modules\FieldLeadership\Http\Controllers\Api\FieldLeadershipRisksApiController;

/*
|--------------------------------------------------------------------------
| FieldLeadership API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('field-leadership')->group(function () {

    // ── Master data for create/edit form (single endpoint) ───────────────────
    Route::get('/master-data',               [FieldLeadershipApiController::class, 'masterData'])
        ->middleware('module.permission:field-leadership,can_view');

    // ── Risks ─────────────────────────────────────────────────────────────────
    Route::get('/risks',         [FieldLeadershipRisksApiController::class, 'index'])
        ->middleware('module.permission:field-leadership,can_view');
    Route::get('/risks/{id}',    [FieldLeadershipRisksApiController::class, 'show'])
        ->whereUuid('id')
        ->middleware('module.permission:field-leadership,can_view');
    Route::put('/risks/{id}',    [FieldLeadershipRisksApiController::class, 'update'])
        ->whereUuid('id')
        ->middleware('module.permission:field-leadership,can_edit');

    // ── Master data dropdowns for forms ───────────────────────────────────────
    Route::get('/masters/departments',   [FieldLeadershipMasterApiController::class, 'getDepartments'])
        ->middleware('module.permission:field-leadership,can_view');
    Route::get('/masters/sections',      [FieldLeadershipMasterApiController::class, 'getSections'])
        ->middleware('module.permission:field-leadership,can_view');
    Route::get('/masters/locations',     [FieldLeadershipMasterApiController::class, 'getLocations'])
        ->middleware('module.permission:field-leadership,can_view');
    Route::get('/masters/pja',           [FieldLeadershipMasterApiController::class, 'getPja'])
        ->middleware('module.permission:field-leadership,can_view');

    // ── Risk Files (preview/download) ─────────────────────────────────────────
    Route::get('/risk-files/{id}/preview',      [FieldLeadershipApiController::class, 'previewRiskFile'])
        ->whereUuid('id')
        ->middleware('module.permission:field-leadership,can_view');
    Route::get('/risk-files/{id}/download',     [FieldLeadershipApiController::class, 'downloadRiskFile'])
        ->whereUuid('id')
        ->middleware('module.permission:field-leadership,can_view');

    // ── Activity Files (preview/download) ────────────────────────────────────
    Route::get('/activity-files/{id}/preview',  [FieldLeadershipApiController::class, 'previewActivityFile'])
        ->whereUuid('id')
        ->middleware('module.permission:field-leadership,can_view');
    Route::get('/activity-files/{id}/download', [FieldLeadershipApiController::class, 'downloadActivityFile'])
        ->whereUuid('id')
        ->middleware('module.permission:field-leadership,can_view');

    // ── Master Library CRUD ───────────────────────────────────────────────────
    // Limit Parameters (single-row upsert — no {id} needed on PUT)
    Route::get('/masters/limit-parameters',      [FieldLeadershipMasterApiController::class, 'getParameters']);
    Route::put('/masters/limit-parameters',      [FieldLeadershipMasterApiController::class, 'updateParameters']);

    // Jenis KTA & TTA
    Route::get('/masters/kta-tta',               [FieldLeadershipMasterApiController::class, 'getKtaTta']);
    Route::post('/masters/kta-tta',              [FieldLeadershipMasterApiController::class, 'storeKtaTta']);
    Route::put('/masters/kta-tta/{id}',          [FieldLeadershipMasterApiController::class, 'updateKtaTta'])->whereUuid('id');
    Route::delete('/masters/kta-tta/{id}',       [FieldLeadershipMasterApiController::class, 'destroyKtaTta'])->whereUuid('id');

    // Potensi Konsekuensi
    Route::get('/masters/potencies',             [FieldLeadershipMasterApiController::class, 'getPotency']);
    Route::post('/masters/potencies',            [FieldLeadershipMasterApiController::class, 'storePotency']);
    Route::put('/masters/potencies/{id}',        [FieldLeadershipMasterApiController::class, 'updatePotency'])->whereUuid('id');
    Route::delete('/masters/potencies/{id}',     [FieldLeadershipMasterApiController::class, 'destroyPotency'])->whereUuid('id');

    // Categories
    Route::get('/masters/categories',            [FieldLeadershipMasterApiController::class, 'getCategories']);
    Route::post('/masters/categories',           [FieldLeadershipMasterApiController::class, 'storeCategory']);
    Route::put('/masters/categories/{id}',       [FieldLeadershipMasterApiController::class, 'updateCategory'])->whereUuid('id');
    Route::delete('/masters/categories/{id}',    [FieldLeadershipMasterApiController::class, 'destroyCategory'])->whereUuid('id');

    // ── FieldLeadership (CRUD) ───────────────────────────────────────────────────
    Route::get('/',              [FieldLeadershipApiController::class, 'index'])
        ->middleware('module.permission:field-leadership,can_view');
    Route::post('',             [FieldLeadershipApiController::class, 'store'])
        ->middleware('module.permission:field-leadership,can_create');
    Route::get('/{id}',         [FieldLeadershipApiController::class, 'show'])
        ->whereUuid('id')
        ->middleware('module.permission:field-leadership,can_view');
    Route::put('/{id}',         [FieldLeadershipApiController::class, 'update'])
        ->whereUuid('id')
        ->middleware('module.permission:field-leadership,can_edit');
    Route::delete('',           [FieldLeadershipApiController::class, 'destroy'])
        ->middleware('module.permission:field-leadership,can_delete');
    // IIS bulk-delete alias
    Route::post('/bulk-delete', [FieldLeadershipApiController::class, 'destroy'])
        ->middleware('module.permission:field-leadership,can_delete');

    // ── Approval routing (workflow baru) ────────────────────────────────────
    // Otorisasi peran (maker/PJA/CRS) divalidasi di dalam controller
    Route::post('/{id}/submit',     [FieldLeadershipApprovalApiController::class, 'submit'])->whereUuid('id');
    Route::post('/{id}/pja-review', [FieldLeadershipApprovalApiController::class, 'pjaReview'])->whereUuid('id');
    Route::post('/{id}/crs-action', [FieldLeadershipApprovalApiController::class, 'crsAction'])->whereUuid('id');
    Route::post('/{id}/crs-verify', [FieldLeadershipApprovalApiController::class, 'crsVerify'])->whereUuid('id');
    Route::post('/{id}/return',     [FieldLeadershipApprovalApiController::class, 'returnWithComment'])->whereUuid('id');
});
