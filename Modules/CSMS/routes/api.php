<?php

use Illuminate\Support\Facades\Route;
use Modules\CSMS\Http\Controllers\Api\CSMSBiddingApiController;
use Modules\CSMS\Http\Controllers\Api\CSMSPjoApiController;
use Modules\CSMS\Http\Controllers\Api\CSMSSupportApiController;
use Modules\CSMS\Http\Controllers\Api\CSMSDashboardApiController;

Route::prefix('csms')->group(function () {

    // Dashboard Stats
    Route::get('/dashboard-stats', [CSMSDashboardApiController::class, 'stats']);

    // Bidding CRUD
    Route::get('/biddings', [CSMSBiddingApiController::class, 'index'])
        ->middleware('module.permission:csms,can_view,csms.bidding');
    Route::get('/biddings/{id}', [CSMSBiddingApiController::class, 'show'])
        ->middleware('module.permission:csms,can_view,csms.bidding');
    Route::post('/biddings', [CSMSBiddingApiController::class, 'store'])
        ->middleware('module.permission:csms,can_create,csms.bidding');
    Route::put('/biddings/{id}', [CSMSBiddingApiController::class, 'update'])
        ->middleware('module.permission:csms,can_edit,csms.bidding');
    Route::delete('/biddings/{id}', [CSMSBiddingApiController::class, 'destroy'])
        ->middleware('module.permission:csms,can_delete,csms.bidding');
    Route::post('/biddings/bulk-delete', [CSMSBiddingApiController::class, 'bulkDestroy'])
        ->middleware('module.permission:csms,can_delete,csms.bidding');
    Route::get('/approved-biddings', [CSMSBiddingApiController::class, 'approved'])
        ->middleware('module.permission:csms,can_create,csms.post-bidding');

    // Post-Bidding (reuses Bidding index/show with criteria=PostBidding)
    Route::get('/post-biddings', function (\Illuminate\Http\Request $request) {
        $request->merge(['criteria' => 'PostBidding']);
        return app(CSMSBiddingApiController::class)->index($request);
    })->middleware('module.permission:csms,can_view,csms.post-bidding');

    Route::get('/post-biddings/{id}', [CSMSBiddingApiController::class, 'show'])
        ->middleware('module.permission:csms,can_view,csms.post-bidding');

    // Renewal (reuses Bidding index with criteria=Renewal)
    Route::get('/renewals', function (\Illuminate\Http\Request $request) {
        $request->merge(['criteria' => 'Renewal']);
        return app(CSMSBiddingApiController::class)->index($request);
    })->middleware('module.permission:csms,can_view,csms.renewal');

    // Approval
    Route::post('/approval/{id}', [CSMSBiddingApiController::class, 'processApproval'])
        ->middleware('module.permission:csms,can_approval,csms.approval');

    Route::post('/biddings/{id}/renew', [CSMSBiddingApiController::class, 'renew'])
        ->middleware('module.permission:csms,can_create,csms.renewal');

    Route::post('/biddings/{id}/deactivate', [CSMSBiddingApiController::class, 'deactivate'])
        ->middleware('module.permission:csms,can_edit,csms.post-bidding');

    // Checklist Attachments
    Route::get('/checklist-attachments/{id}/preview', [CSMSBiddingApiController::class, 'previewChecklistFile']);
    Route::get('/checklist-attachments/{id}/download', [CSMSBiddingApiController::class, 'downloadChecklistFile']);

    // PJO CRUD
    Route::get('/pjos', [CSMSPjoApiController::class, 'index'])
        ->middleware('module.permission:csms,can_view,csms.pjo');
    Route::get('/pjos/{id}', [CSMSPjoApiController::class, 'show'])
        ->middleware('module.permission:csms,can_view,csms.pjo');
    Route::post('/pjos', [CSMSPjoApiController::class, 'store'])
        ->middleware('module.permission:csms,can_create,csms.pjo');
    Route::put('/pjos/{id}', [CSMSPjoApiController::class, 'update'])
        ->middleware('module.permission:csms,can_edit,csms.pjo');
    Route::delete('/pjos/{id}', [CSMSPjoApiController::class, 'destroy'])
        ->middleware('module.permission:csms,can_delete,csms.pjo');

    // Memo KTT
    Route::get('/memo-ktts', [CSMSSupportApiController::class, 'indexMemoKtts'])
        ->middleware('module.permission:csms,can_view,csms.memo');
    Route::post('/memo-ktts', [CSMSSupportApiController::class, 'storeMemoKtt'])
        ->middleware('module.permission:csms,can_create,csms.memo');

    // Letters (Surat Edaran)
    Route::get('/letters', [CSMSSupportApiController::class, 'indexLetters'])
        ->middleware('module.permission:csms,can_view,csms.letter');
    Route::post('/letters', [CSMSSupportApiController::class, 'storeLetter'])
        ->middleware('module.permission:csms,can_create,csms.letter');

    // Dictionaries (Kamus CSMS)
    Route::get('/dictionaries', [CSMSSupportApiController::class, 'indexDictionaries'])
        ->middleware('module.permission:csms,can_view,csms.dictionary');
    Route::post('/dictionaries', [CSMSSupportApiController::class, 'storeDictionary'])
        ->middleware('module.permission:csms,can_create,csms.dictionary');

    // PICA
    Route::get('/picas', [CSMSSupportApiController::class, 'indexPicas'])
        ->middleware('module.permission:csms,can_view,csms.pica');

    // PJO File Preview & Download
    Route::get('/pjo-files/{id}/preview', [CSMSPjoApiController::class, 'previewFile']);
    Route::get('/pjo-files/{id}/download', [CSMSPjoApiController::class, 'downloadFile']);

    // Memo KTT File Preview & Download
    Route::get('/memo-ktt-files/{id}/preview', [CSMSSupportApiController::class, 'previewMemoKttFile']);
    Route::get('/memo-ktt-files/{id}/download', [CSMSSupportApiController::class, 'downloadMemoKttFile']);

    // Master Data
    Route::get('/master-data', [CSMSSupportApiController::class, 'masterData']);

});
