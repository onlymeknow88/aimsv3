<?php

use Illuminate\Support\Facades\Route;
use Modules\CSMS\Http\Controllers\Api\CSMSApiController;

Route::prefix('csms')->group(function () {
    // Bidding CRUD
    Route::get('/biddings', [CSMSApiController::class, 'indexBiddings'])
        ->middleware('module.permission:csms,can_view,csms.bidding');
    Route::get('/biddings/{id}', [CSMSApiController::class, 'showBidding'])
        ->middleware('module.permission:csms,can_view,csms.bidding');
    Route::post('/biddings', [CSMSApiController::class, 'storeBidding'])
        ->middleware('module.permission:csms,can_create,csms.bidding');
    Route::put('/biddings/{id}', [CSMSApiController::class, 'updateBidding'])
        ->middleware('module.permission:csms,can_edit,csms.bidding');
    Route::delete('/biddings/{id}', [CSMSApiController::class, 'destroyBidding'])
        ->middleware('module.permission:csms,can_delete,csms.bidding');

    // Post-Bidding CRUD
    Route::get('/post-biddings', [CSMSApiController::class, 'indexPostBiddings'])
        ->middleware('module.permission:csms,can_view,csms.post-bidding');
    Route::get('/post-biddings/{id}', [CSMSApiController::class, 'showPostBidding'])
        ->middleware('module.permission:csms,can_view,csms.post-bidding');

    // Renewal CRUD
    Route::get('/renewals', [CSMSApiController::class, 'indexRenewals'])
        ->middleware('module.permission:csms,can_view,csms.renewal');

    // PJO CRUD
    Route::get('/pjos', [CSMSApiController::class, 'indexPjos'])
        ->middleware('module.permission:csms,can_view,csms.pjo');
    Route::post('/pjos', [CSMSApiController::class, 'storePjo'])
        ->middleware('module.permission:csms,can_create,csms.pjo');
    Route::put('/pjos/{id}', [CSMSApiController::class, 'updatePjo'])
        ->middleware('module.permission:csms,can_edit,csms.pjo');
    Route::delete('/pjos/{id}', [CSMSApiController::class, 'destroyPjo'])
        ->middleware('module.permission:csms,can_delete,csms.pjo');

    // Memo KTT
    Route::get('/memo-ktts', [CSMSApiController::class, 'indexMemoKtts'])
        ->middleware('module.permission:csms,can_view,csms.memo');
    Route::post('/memo-ktts', [CSMSApiController::class, 'storeMemoKtt'])
        ->middleware('module.permission:csms,can_create,csms.memo');

    // Letters (Surat Edaran)
    Route::get('/letters', [CSMSApiController::class, 'indexLetters'])
        ->middleware('module.permission:csms,can_view,csms.letter');
    Route::post('/letters', [CSMSApiController::class, 'storeLetter'])
        ->middleware('module.permission:csms,can_create,csms.letter');

    // Dictionaries (Kamus CSMS)
    Route::get('/dictionaries', [CSMSApiController::class, 'indexDictionaries'])
        ->middleware('module.permission:csms,can_view,csms.dictionary');
    Route::post('/dictionaries', [CSMSApiController::class, 'storeDictionary'])
        ->middleware('module.permission:csms,can_create,csms.dictionary');

    // PICA
    Route::get('/picas', [CSMSApiController::class, 'indexPicas'])
        ->middleware('module.permission:csms,can_view,csms.pica');

    // Approval Action
    Route::post('/approval/{id}', [CSMSApiController::class, 'processApproval'])
        ->middleware('module.permission:csms,can_approval,csms.approval');

    // Master Data for Forms
    Route::get('/master-data', [CSMSApiController::class, 'masterData']);

    // Checklist Attachment Preview/Download
    Route::get('/checklist-attachments/{id}/preview', [CSMSApiController::class, 'previewChecklistFile']);
    Route::get('/checklist-attachments/{id}/download', [CSMSApiController::class, 'downloadChecklistFile']);
});
