<?php

use Illuminate\Support\Facades\Route;
use Modules\FieldLeadership\Http\Controllers\FieldLeadershipWebController;

Route::middleware(['web', 'auth'])->prefix('field-leadership')->group(function () {

    // ── 1. Dashboard ─────────────────────────────────────────────────────────
    Route::get('/', [FieldLeadershipWebController::class, 'index'])
        ->middleware('module.permission:field-leadership,can_view,fls.dashboard')
        ->name('fls.dashboard');

    // ── 2. Field Leadership (Active Observations) ────────────────────────────
    Route::get('/observations', [FieldLeadershipWebController::class, 'observations'])
        ->middleware('module.permission:field-leadership,can_view,fls.observations')
        ->name('fls.observations');

    Route::get('/observations/create', [FieldLeadershipWebController::class, 'create'])
        ->middleware('module.permission:field-leadership,can_create,fls.observations')
        ->name('fls.observations.create');

    Route::get('/observations/{id}/edit', [FieldLeadershipWebController::class, 'edit'])
        ->middleware('module.permission:field-leadership,can_edit,fls.observations')
        ->name('fls.observations.edit');

    Route::get('/observations/{id}', [FieldLeadershipWebController::class, 'detail'])
        ->middleware('module.permission:field-leadership,can_view,fls.observations')
        ->name('fls.observations.detail');

    // ── 3. Penanggung Jawab Area (PJA) ───────────────────────────────────────
    Route::get('/pja/request-review', [FieldLeadershipWebController::class, 'pjaRequestReview'])
        ->middleware('module.permission:field-leadership,can_view,fls.pja.request-review')
        ->name('fls.pja.request-review');

    Route::get('/pja/draft', [FieldLeadershipWebController::class, 'pjaDraft'])
        ->middleware('module.permission:field-leadership,can_view,fls.pja.draft')
        ->name('fls.pja.draft');

    // ── 4. Approval PJA ──────────────────────────────────────────────────────
    Route::get('/approval-pja', [FieldLeadershipWebController::class, 'approvalPja'])
        ->middleware('module.permission:field-leadership,can_view,fls.approval-pja')
        ->name('fls.approval-pja');

    // ── 5. Master Library ────────────────────────────────────────────────────
    Route::get('/master', [FieldLeadershipWebController::class, 'master'])
        ->middleware('module.permission:field-leadership,can_view,fls.master')
        ->name('fls.master');

});
