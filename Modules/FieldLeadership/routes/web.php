<?php

use Illuminate\Support\Facades\Route;
use Modules\FieldLeadership\Http\Controllers\FieldLeadershipWebController;

Route::middleware(['web', 'auth'])->prefix('field-leadership')->group(function () {

    // ── Dashboard ─────────────────────────────────────────────────────────────
    Route::get('/', [FieldLeadershipWebController::class, 'index'])
        ->middleware('module.permission:field-leadership,can_view,fls.dashboard')
        ->name('fls.dashboard');

    // ── Observations ─────────────────────────────────────────────────────────
    Route::get('/observations', [FieldLeadershipWebController::class, 'observations'])
        ->middleware('module.permission:field-leadership,can_view,fls.observations')
        ->name('fls.observations');

    Route::get('/pto', [FieldLeadershipWebController::class, 'pto'])
        ->middleware('module.permission:field-leadership,can_view,fls.observations')
        ->name('fls.pto');

    Route::get('/ttt', [FieldLeadershipWebController::class, 'ttt'])
        ->middleware('module.permission:field-leadership,can_view,fls.observations')
        ->name('fls.ttt');

    Route::get('/hr', [FieldLeadershipWebController::class, 'hr'])
        ->middleware('module.permission:field-leadership,can_view,fls.observations')
        ->name('fls.hr');

    Route::get('/observations/create', [FieldLeadershipWebController::class, 'create'])
        ->middleware('module.permission:field-leadership,can_create,fls.observations')
        ->name('fls.observations.create');

    Route::get('/observations/{id}', [FieldLeadershipWebController::class, 'detail'])
        ->middleware('module.permission:field-leadership,can_view,fls.observations')
        ->name('fls.observations.detail');

    // ── Risk & Corrective Action ──────────────────────────────────────────────
    Route::get('/risks', [FieldLeadershipWebController::class, 'risks'])
        ->middleware('module.permission:field-leadership,can_view,fls.risks')
        ->name('fls.risks');

    Route::get('/corrective-actions', [FieldLeadershipWebController::class, 'correctiveActions'])
        ->middleware('module.permission:field-leadership,can_view,fls.risks')
        ->name('fls.corrective-actions');

    // ── Master Data ───────────────────────────────────────────────────────────
    Route::get('/master', [FieldLeadershipWebController::class, 'master'])
        ->middleware('module.permission:field-leadership,can_view,fls.master')
        ->name('fls.master');

    // ── Settings ──────────────────────────────────────────────────────────────
    Route::get('/settings', [FieldLeadershipWebController::class, 'settings'])
        ->middleware('module.permission:field-leadership,can_view,fls.master')
        ->name('fls.settings');

});
