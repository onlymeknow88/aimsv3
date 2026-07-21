<?php

use Illuminate\Support\Facades\Route;
use Modules\FieldLeadership\Http\Controllers\Api\FieldLeadershipApiController;
use Modules\FieldLeadership\Http\Controllers\Api\FieldLeadershipRisksApiController;
use Modules\FieldLeadership\Http\Controllers\Api\FieldLeadershipMasterApiController;

/*
|--------------------------------------------------------------------------
| FieldLeadership API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('field-leadership')->group(function () {

    // ── Observations (CRUD) ───────────────────────────────────────────────────
    Route::get('/observations',          [FieldLeadershipApiController::class, 'index']);
    Route::post('/observations',         [FieldLeadershipApiController::class, 'store']);
    Route::get('/observations/{id}',     [FieldLeadershipApiController::class, 'show']);
    Route::put('/observations/{id}',     [FieldLeadershipApiController::class, 'update']);
    Route::delete('/observations',       [FieldLeadershipApiController::class, 'destroy']);

    // ── Master data for forms ────────────────────────────────────────────────
    Route::get('/master-data',           [FieldLeadershipApiController::class, 'masterData']);


    // ── Risk Finding ─────────────────────────────────────────────────────────
    Route::get('/risks',                 [FieldLeadershipRisksApiController::class, 'index']);
    Route::get('/risks/{id}',            [FieldLeadershipRisksApiController::class, 'show']);
    Route::put('/risks/{id}',            [FieldLeadershipRisksApiController::class, 'update']);

    // ── Master Data CRUD ──────────────────────────────────────────────────────
    // Categories
    Route::get('/master/categories',        [FieldLeadershipMasterApiController::class, 'getCategories']);
    Route::post('/master/categories',       [FieldLeadershipMasterApiController::class, 'storeCategory']);
    Route::put('/master/categories/{id}',   [FieldLeadershipMasterApiController::class, 'updateCategory']);
    Route::delete('/master/categories/{id}',[FieldLeadershipMasterApiController::class, 'destroyCategory']);

    // KTA & TTA
    Route::get('/master/kta-tta',           [FieldLeadershipMasterApiController::class, 'getKtaTta']);
    Route::post('/master/kta-tta',          [FieldLeadershipMasterApiController::class, 'storeKtaTta']);
    Route::put('/master/kta-tta/{id}',      [FieldLeadershipMasterApiController::class, 'updateKtaTta']);
    Route::delete('/master/kta-tta/{id}',   [FieldLeadershipMasterApiController::class, 'destroyKtaTta']);

    // Potency & Consequences
    Route::get('/master/potency',           [FieldLeadershipMasterApiController::class, 'getPotency']);
    Route::post('/master/potency',          [FieldLeadershipMasterApiController::class, 'storePotency']);
    Route::put('/master/potency/{id}',      [FieldLeadershipMasterApiController::class, 'updatePotency']);
    Route::delete('/master/potency/{id}',   [FieldLeadershipMasterApiController::class, 'destroyPotency']);

    // Parameters / Settings
    Route::get('/master/parameters',        [FieldLeadershipMasterApiController::class, 'getParameters']);
    Route::put('/master/parameters',        [FieldLeadershipMasterApiController::class, 'updateParameters']);
});

