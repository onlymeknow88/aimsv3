<?php

use Illuminate\Support\Facades\Route;
use Modules\CSMS\Http\Controllers\CSMSController;

Route::middleware(['web', 'auth'])->prefix('csms')->as('csms.')->group(function () {
    Route::get('/', function () {
        return redirect()->route('csms.dashboard');
    });

    // Dashboard
    Route::get('/dashboard', [CSMSController::class, 'dashboardIndex'])
        ->middleware('module.permission:csms,can_view,csms.dashboard')
        ->name('dashboard');

    // Bidding
    Route::prefix('bidding')->as('bidding.')->group(function () {
        Route::get('/lists', [CSMSController::class, 'biddingIndex'])
            ->middleware('module.permission:csms,can_view,csms.bidding')
            ->name('index');
        Route::get('/create', [CSMSController::class, 'biddingCreate'])
            ->middleware('module.permission:csms,can_create,csms.bidding')
            ->name('create');
        Route::get('/edit/{bidding}', [CSMSController::class, 'biddingEdit'])
            ->middleware('module.permission:csms,can_edit,csms.bidding')
            ->name('edit');
        Route::get('/detail/{bidding}', [CSMSController::class, 'biddingDetail'])
            ->middleware('module.permission:csms,can_view,csms.bidding')
            ->name('detail');
    });

    // Post-Bidding
    Route::prefix('post-bidding')->as('post-bidding.')->group(function () {
        Route::get('/lists', [CSMSController::class, 'postBiddingIndex'])
            ->middleware('module.permission:csms,can_view,csms.post-bidding')
            ->name('index');
        Route::get('/active', [CSMSController::class, 'postBiddingActive'])
            ->middleware('module.permission:csms,can_view,csms.post-bidding.active')
            ->name('active');
        Route::get('/inactive', [CSMSController::class, 'postBiddingInactive'])
            ->middleware('module.permission:csms,can_view,csms.post-bidding.inactive')
            ->name('inactive');
        Route::get('/create', [CSMSController::class, 'postBiddingCreate'])
            ->middleware('module.permission:csms,can_create,csms.post-bidding')
            ->name('create');
        Route::get('/edit/{bidding}', [CSMSController::class, 'postBiddingEdit'])
            ->middleware('module.permission:csms,can_edit,csms.post-bidding')
            ->name('edit');
        Route::get('/detail/{bidding}', [CSMSController::class, 'postBiddingDetail'])
            ->middleware('module.permission:csms,can_view,csms.post-bidding')
            ->name('detail');
    });

    // Renewal
    Route::prefix('renewal')->as('renewal.')->group(function () {
        Route::get('/lists', [CSMSController::class, 'renewalIndex'])
            ->middleware('module.permission:csms,can_view,csms.renewal')
            ->name('index');
    });

    // PICA
    Route::prefix('pica')->as('pica.')->group(function () {
        Route::get('/lists', [CSMSController::class, 'picaIndex'])
            ->middleware('module.permission:csms,can_view,csms.pica')
            ->name('index');
    });

    // PJO
    Route::prefix('pjo')->as('pjo.')->group(function () {
        Route::get('/lists', [CSMSController::class, 'pjoIndex'])
            ->middleware('module.permission:csms,can_view,csms.pjo')
            ->name('index');
        Route::get('/create', [CSMSController::class, 'pjoCreate'])
            ->middleware('module.permission:csms,can_create,csms.pjo')
            ->name('create');
        Route::get('/edit/{pjo}', [CSMSController::class, 'pjoEdit'])
            ->middleware('module.permission:csms,can_edit,csms.pjo')
            ->name('edit');
        Route::get('/detail/{pjo}', [CSMSController::class, 'pjoDetail'])
            ->middleware('module.permission:csms,can_view,csms.pjo')
            ->name('detail');
    });

    // Memo KTT
    Route::prefix('memo-ktt')->as('memo-ktt.')->group(function () {
        Route::get('/lists', [CSMSController::class, 'memoKttIndex'])
            ->middleware('module.permission:csms,can_view,csms.memo')
            ->name('index');
    });

    // Letter (Surat Edaran)
    Route::prefix('letter')->as('letter.')->group(function () {
        Route::get('/lists', [CSMSController::class, 'letterIndex'])
            ->middleware('module.permission:csms,can_view,csms.letter')
            ->name('index');
    });

    // Dictionary
    Route::prefix('dictionary')->as('dictionary.')->group(function () {
        Route::get('/lists', [CSMSController::class, 'dictionaryIndex'])
            ->middleware('module.permission:csms,can_view,csms.dictionary')
            ->name('index');
    });

    // Approval Panel (OHS/DHOHS/KTT)
    Route::prefix('approval')->as('approval.')->group(function () {
        Route::get('/bidding', [CSMSController::class, 'approvalBiddingIndex'])
            ->middleware('module.permission:csms,can_approval,csms.approval')
            ->name('bidding');
        Route::get('/post-bidding', [CSMSController::class, 'approvalPostBiddingIndex'])
            ->middleware('module.permission:csms,can_approval,csms.approval')
            ->name('post-bidding');
    });
});
