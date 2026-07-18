<?php

use Illuminate\Support\Facades\Route;
use Modules\DocumentSystem\Http\Controllers\Api\DocumentApiController;
use Modules\DocumentSystem\Http\Controllers\Api\PermissionApiController;
use Modules\DocumentSystem\Http\Controllers\Api\MasterDataApiController;
use Modules\DocumentSystem\Http\Controllers\Api\JsaApiController;
use Modules\DocumentSystem\Http\Controllers\GeneralController;

Route::middleware(['web', 'auth'])->prefix('document-system')->group(function () {
    
    // ==========================================
    // 1. Document API Actions
    // ==========================================
    Route::middleware('module.permission:document-system,can_view,doc.maker')->group(function () {
        Route::get('/documents', [DocumentApiController::class, 'index']);
        Route::get('/documents/{id}', [DocumentApiController::class, 'show']);
        Route::get('/attachments/{id}/preview', [GeneralController::class, 'previewAttachment']);
        Route::get('/attachments/{id}/download', [GeneralController::class, 'downloadAttachment']);
        Route::get('/attachments/{id}/sas-url', [GeneralController::class, 'sasUrl']);
    });

    Route::middleware('module.permission:document-system,can_create,doc.maker')->group(function () {
        Route::post('/documents', [DocumentApiController::class, 'store']);
        Route::get('/generate-number', [DocumentApiController::class, 'generateNumber']);
    });

    Route::middleware('module.permission:document-system,can_edit,doc.maker')->group(function () {
        Route::post('/documents/{id}', [DocumentApiController::class, 'update']);
        Route::delete('/attachments/{id}', [DocumentApiController::class, 'deleteAttachment']);
    });

    Route::middleware('module.permission:document-system,can_delete,doc.maker')->group(function () {
        Route::delete('/documents', [DocumentApiController::class, 'destroy']);
    });

    Route::middleware('module.permission:document-system,can_approval,doc.approval')->group(function () {
        Route::post('/documents/approve/{id}', [DocumentApiController::class, 'approve']);
        Route::post('/documents/reject/{id}', [DocumentApiController::class, 'reject']);
    });

    // ==========================================
    // 2. Permission & Master Data API Actions
    // ==========================================
    // Master data is read-only for document operations, mapped to master permission
    Route::middleware('module.permission:document-system,can_view,doc.master')->group(function () {
        Route::post('/permissions', [PermissionApiController::class, 'updatePermissions']);
        Route::get('/companies', [MasterDataApiController::class, 'getCompanies']);
        Route::get('/departments', [MasterDataApiController::class, 'getDepartments']);
        Route::get('/pjs', [MasterDataApiController::class, 'getPjs']);
        Route::get('/modules', [MasterDataApiController::class, 'getModules']);
        Route::get('/categories', [MasterDataApiController::class, 'getCategories']);
        Route::get('/mappings', [MasterDataApiController::class, 'getMappings']);
    });

    // Standard read endpoints allowed for active SOP reference creation
    Route::get('/active-sops', [DocumentApiController::class, 'getActiveSops']);
    Route::get('/employees', [MasterDataApiController::class, 'getEmployees']);

    // ==========================================
    // 3. JSA API Actions
    // ==========================================
    Route::middleware('module.permission:document-system,can_view,doc.jsa')->group(function () {
        Route::get('/jsa', [JsaApiController::class, 'index']);
        Route::get('/jsa/{id}', [JsaApiController::class, 'show']);
    });

    Route::middleware('module.permission:document-system,can_create,doc.jsa')->group(function () {
        Route::post('/jsa', [JsaApiController::class, 'store']);
        Route::post('/jsa/{id}/submit-review', [JsaApiController::class, 'submitForReview']);
    });

    Route::middleware('module.permission:document-system,can_edit,doc.jsa')->group(function () {
        Route::post('/jsa/{id}', [JsaApiController::class, 'update']);
        Route::delete('/jsa/attachments/{id}', [JsaApiController::class, 'deleteAttachment']);
    });

    Route::middleware('module.permission:document-system,can_delete,doc.jsa')->group(function () {
        Route::delete('/jsa/{id}', [JsaApiController::class, 'destroy']);
    });

    Route::middleware('module.permission:document-system,can_approval,doc.approval')->group(function () {
        Route::post('/jsa/{id}/approve', [JsaApiController::class, 'approve']);
        Route::post('/jsa/{id}/reject', [JsaApiController::class, 'reject']);
    });

    // ==========================================
    // 4. PTW API Actions
    // ==========================================
    Route::middleware('module.permission:document-system,can_view,doc.ptw')->group(function () {
        Route::get('/ptw', [\Modules\DocumentSystem\Http\Controllers\PtwController::class, 'index']);
    });

    Route::middleware('module.permission:document-system,can_create,doc.ptw')->group(function () {
        Route::post('/ptw', [\Modules\DocumentSystem\Http\Controllers\PtwController::class, 'store']);
    });

    Route::middleware('module.permission:document-system,can_edit,doc.ptw')->group(function () {
        Route::post('/ptw/{id}', [\Modules\DocumentSystem\Http\Controllers\PtwController::class, 'update']);
    });

    Route::middleware('module.permission:document-system,can_delete,doc.ptw')->group(function () {
        Route::delete('/ptw/{id}', [\Modules\DocumentSystem\Http\Controllers\PtwController::class, 'destroy']);
    });
});
