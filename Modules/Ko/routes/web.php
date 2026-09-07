<?php

use Illuminate\Support\Facades\Route;
use Modules\Ko\Http\Controllers\KoController;

Route::middleware(['web', 'auth'])->prefix('ko')->as('ko.')->group(function () {
    Route::get('/', fn() => redirect()->route('ko.dashboard'));

    Route::get('/dashboard', [KoController::class, 'dashboard'])
        ->middleware('module.permission:ko,can_view,ko.dashboard')
        ->name('dashboard');

    Route::get('/proposals', [KoController::class, 'proposals'])
        ->middleware('module.permission:ko,can_view,ko.proposals')
        ->name('proposals');

    Route::get('/proposals/create', [KoController::class, 'proposalCreate'])
        ->middleware('module.permission:ko,can_create,ko.proposals')
        ->name('proposals.create');

    Route::get('/proposals/{id}/edit', [KoController::class, 'proposalEdit'])
        ->middleware('module.permission:ko,can_edit,ko.proposals')
        ->name('proposals.edit');

    Route::get('/proposals/{id}', [KoController::class, 'proposalDetail'])
        ->middleware('module.permission:ko,can_view,ko.proposals')
        ->name('proposals.detail');

    Route::get('/commissionings', [KoController::class, 'commissionings'])
        ->middleware('module.permission:ko,can_view,ko.commissionings')
        ->name('commissionings');

    Route::get('/commissionings/create', [KoController::class, 'commissioningCreate'])
        ->middleware('module.permission:ko,can_create,ko.commissionings')
        ->name('commissionings.create');

    Route::get('/commissionings/{id}', [KoController::class, 'commissioningDetail'])
        ->middleware('module.permission:ko,can_view,ko.commissionings')
        ->name('commissionings.detail');

    Route::get('/issues', [KoController::class, 'issues'])
        ->middleware('module.permission:ko,can_view,ko.issues')
        ->name('issues');

    Route::get('/units', [KoController::class, 'units'])
        ->middleware('module.permission:ko,can_view,ko.units')
        ->name('units');

    Route::get('/master', [KoController::class, 'master'])
        ->middleware('module.permission:ko,can_view,ko.master')
        ->name('master');

    Route::get('/qr-requests', [KoController::class, 'qrRequests'])
        ->middleware('module.permission:ko,can_view,ko.qr-requests')
        ->name('qr-requests');
});
