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
    Route::get('/master-data',               [FieldLeadershipApiController::class, 'masterData']);

    // ── Observations (CRUD) ───────────────────────────────────────────────────
    Route::get('/observations',              [FieldLeadershipApiController::class, 'index']);
    Route::post('/observations',             [FieldLeadershipApiController::class, 'store']);
    Route::get('/observations/{id}',         [FieldLeadershipApiController::class, 'show']);
    Route::put('/observations/{id}',         [FieldLeadershipApiController::class, 'update']);
    Route::delete('/observations',           [FieldLeadershipApiController::class, 'destroy']);

    // ── Approval routing ─────────────────────────────────────────────────────
    Route::post('/observations/{id}/submit',  [FieldLeadershipApprovalApiController::class, 'submit']);
    Route::post('/observations/{id}/approve', [FieldLeadershipApprovalApiController::class, 'approve']);
    Route::post('/observations/{id}/return',  [FieldLeadershipApprovalApiController::class, 'returnWithComment']);

    // ── Risks ─────────────────────────────────────────────────────────────────
    Route::get('/risks',         [FieldLeadershipRisksApiController::class, 'index']);
    Route::get('/risks/{id}',    [FieldLeadershipRisksApiController::class, 'show']);
    Route::put('/risks/{id}',    [FieldLeadershipRisksApiController::class, 'update']);

    // ── Master data dropdowns for forms ───────────────────────────────────────
    Route::get('/masters/departments',   [FieldLeadershipMasterApiController::class, 'getDepartments']);
    Route::get('/masters/sections',      [FieldLeadershipMasterApiController::class, 'getSections']);
    Route::get('/masters/locations',     [FieldLeadershipMasterApiController::class, 'getLocations']);
    Route::get('/masters/pja',           [FieldLeadershipMasterApiController::class, 'getPja']);

    // ── Risk Files (preview/download) ─────────────────────────────────────────
    Route::get('/risk-files/{id}/preview',   [FieldLeadershipApiController::class, 'previewRiskFile']);
    Route::get('/risk-files/{id}/download',  [FieldLeadershipApiController::class, 'downloadRiskFile']);

    // ── Master Library CRUD ───────────────────────────────────────────────────
    // Limit Parameters (single-row upsert — no {id} needed on PUT)
    Route::get('/masters/limit-parameters',      [FieldLeadershipMasterApiController::class, 'getParameters']);
    Route::put('/masters/limit-parameters',      [FieldLeadershipMasterApiController::class, 'updateParameters']);

    // Jenis KTA & TTA
    Route::get('/masters/kta-tta',               [FieldLeadershipMasterApiController::class, 'getKtaTta']);
    Route::post('/masters/kta-tta',              [FieldLeadershipMasterApiController::class, 'storeKtaTta']);
    Route::put('/masters/kta-tta/{id}',          [FieldLeadershipMasterApiController::class, 'updateKtaTta']);
    Route::delete('/masters/kta-tta/{id}',       [FieldLeadershipMasterApiController::class, 'destroyKtaTta']);

    // Potensi Konsekuensi
    Route::get('/masters/potencies',             [FieldLeadershipMasterApiController::class, 'getPotency']);
    Route::post('/masters/potencies',            [FieldLeadershipMasterApiController::class, 'storePotency']);
    Route::put('/masters/potencies/{id}',        [FieldLeadershipMasterApiController::class, 'updatePotency']);
    Route::delete('/masters/potencies/{id}',     [FieldLeadershipMasterApiController::class, 'destroyPotency']);

    // Categories
    Route::get('/masters/categories',            [FieldLeadershipMasterApiController::class, 'getCategories']);
    Route::post('/masters/categories',           [FieldLeadershipMasterApiController::class, 'storeCategory']);
    Route::put('/masters/categories/{id}',       [FieldLeadershipMasterApiController::class, 'updateCategory']);
    Route::delete('/masters/categories/{id}',    [FieldLeadershipMasterApiController::class, 'destroyCategory']);
});
