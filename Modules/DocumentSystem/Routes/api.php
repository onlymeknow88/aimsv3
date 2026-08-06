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
    Route::get('/attachments/{id}/preview', [GeneralController::class, 'previewAttachment']);
    Route::get('/attachments/{id}/download', [GeneralController::class, 'downloadAttachment']);
    Route::get('/attachments/{id}/sas-url', [GeneralController::class, 'sasUrl']);

    Route::middleware('module.permission:document-system,can_view,doc.maker')->group(function () {
        Route::get('/documents/export', [DocumentApiController::class, 'export']);
    });

    // GET /documents dan /documents/{id} dapat diakses oleh semua role yang punya can_view
    // di module document-system (doc.maker, doc.draft, doc.approval, dll)
    Route::middleware('module.permission:document-system,can_view')->group(function () {
        Route::get('/documents', [DocumentApiController::class, 'index']);
        Route::get('/documents/{id}', [DocumentApiController::class, 'show']);
    });

    Route::middleware('module.permission:document-system,can_create,doc.maker')->group(function () {
        Route::post('/documents', [DocumentApiController::class, 'store']);
        Route::get('/generate-number', [DocumentApiController::class, 'generateNumber']);
    });

    Route::middleware('module.permission:document-system,can_approval,doc.approval')->group(function () {
        Route::post('/documents/approve/{id}', [DocumentApiController::class, 'approve']);
        Route::post('/documents/route/{id}', [DocumentApiController::class, 'routeApproval']);
        Route::post('/documents/reject/{id}', [DocumentApiController::class, 'reject']);
    });

    Route::middleware('module.permission:document-system,can_delete,doc.maker')->group(function () {
        Route::delete('/documents', [DocumentApiController::class, 'destroy']);
    });

    // POST destroy untuk _method:DELETE spoofing IIS — accessible semua role can_delete di module
    Route::middleware('module.permission:document-system,can_delete')->group(function () {
        Route::post('/documents/destroy', [DocumentApiController::class, 'destroy']);
    });

    Route::middleware('module.permission:document-system,can_edit,doc.maker')->group(function () {
        Route::post('/documents/{id}', [DocumentApiController::class, 'update']);
        Route::delete('/attachments/{id}', [DocumentApiController::class, 'deleteAttachment']);
        Route::post('/attachments/{id}/delete', [DocumentApiController::class, 'deleteAttachment']); // _method:DELETE spoofing untuk IIS
    });

    // ==========================================
    // 2. Permission & Master Data API Actions
    // ==========================================
    // Read-only reference endpoints for document operations (accessible to anyone with can_view access on the module)
    Route::middleware('module.permission:document-system,can_view')->group(function () {
        Route::get('/companies', [MasterDataApiController::class, 'getCompanies']);
        Route::get('/departments', [MasterDataApiController::class, 'getDepartments']);
        Route::get('/pjs', [MasterDataApiController::class, 'getPjs']);
        Route::get('/modules', [MasterDataApiController::class, 'getModules']);
        Route::get('/categories', [MasterDataApiController::class, 'getCategories']);
        Route::get('/mappings', [MasterDataApiController::class, 'getMappings']);
        Route::get('/dashboard/stats', [MasterDataApiController::class, 'getDashboardStats']);
        Route::get('/active-sops', [DocumentApiController::class, 'getActiveSops']);
        Route::get('/employees', [MasterDataApiController::class, 'getEmployees']);
        Route::get('/pjs-by-department', [MasterDataApiController::class, 'getPjsByDepartment']);
    });

    // Master settings modification endpoints (restricted to doc.master permission)
    Route::middleware('module.permission:document-system,can_view,doc.master')->group(function () {
        Route::post('/permissions', [PermissionApiController::class, 'updatePermissions']);
        Route::post('/modules', [MasterDataApiController::class, 'storeModule']);
        Route::put('/modules/{id}', [MasterDataApiController::class, 'updateModule']);
        Route::post('/modules/{id}/update', [MasterDataApiController::class, 'updateModule']); // _method:PUT spoofing untuk IIS
        Route::delete('/modules/{id}', [MasterDataApiController::class, 'deleteModule']);
        Route::post('/modules/{id}/delete', [MasterDataApiController::class, 'deleteModule']); // _method:DELETE spoofing untuk IIS
        Route::post('/categories', [MasterDataApiController::class, 'storeCategory']);
        Route::put('/categories/{id}', [MasterDataApiController::class, 'updateCategory']);
        Route::post('/categories/{id}/update', [MasterDataApiController::class, 'updateCategory']); // _method:PUT spoofing untuk IIS
        Route::delete('/categories/{id}', [MasterDataApiController::class, 'deleteCategory']);
        Route::post('/categories/{id}/delete', [MasterDataApiController::class, 'deleteCategory']); // _method:DELETE spoofing untuk IIS
        Route::post('/mappings', [MasterDataApiController::class, 'storeMapping']);
        Route::put('/mappings/{id}', [MasterDataApiController::class, 'updateMapping']);
        Route::post('/mappings/{id}/update', [MasterDataApiController::class, 'updateMapping']); // _method:PUT spoofing untuk IIS
        Route::delete('/mappings/{id}', [MasterDataApiController::class, 'deleteMapping']);
        Route::post('/mappings/{id}/delete', [MasterDataApiController::class, 'deleteMapping']); // _method:DELETE spoofing untuk IIS
    });

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
        Route::post('/jsa/attachments/{id}/delete', [JsaApiController::class, 'deleteAttachment']); // _method:DELETE spoofing untuk IIS
    });

    Route::middleware('module.permission:document-system,can_delete,doc.jsa')->group(function () {
        Route::delete('/jsa/{id}', [JsaApiController::class, 'destroy']);
        Route::post('/jsa/{id}/delete', [JsaApiController::class, 'destroy']); // _method:DELETE spoofing untuk IIS
    });

    Route::middleware('module.permission:document-system,can_approval,doc.approval')->group(function () {
        Route::post('/jsa/{id}/approve', [JsaApiController::class, 'approve']);
        Route::post('/jsa/{id}/reject', [JsaApiController::class, 'reject']);
    });

    // ==========================================
    // 4. PTW API Actions
    // ==========================================
    Route::middleware('module.permission:document-system,can_view,doc.ptw')->group(function () {
        Route::get('/ptw', [\Modules\DocumentSystem\Http\Controllers\Api\PtwController::class, 'index']);
        Route::get('/ptw/{id}', [\Modules\DocumentSystem\Http\Controllers\Api\PtwController::class, 'show']);
    });

    Route::middleware('module.permission:document-system,can_create,doc.ptw')->group(function () {
        Route::post('/ptw', [\Modules\DocumentSystem\Http\Controllers\Api\PtwController::class, 'store']);
        Route::post('/ptw/{id}/submit-review', [\Modules\DocumentSystem\Http\Controllers\Api\PtwController::class, 'submitForReview']);
    });

    Route::middleware('module.permission:document-system,can_edit,doc.ptw')->group(function () {
        Route::post('/ptw/{id}', [\Modules\DocumentSystem\Http\Controllers\Api\PtwController::class, 'update']);
        Route::delete('/ptw/attachments/{id}', [\Modules\DocumentSystem\Http\Controllers\Api\PtwController::class, 'deleteAttachment']);
        Route::post('/ptw/attachments/{id}', [\Modules\DocumentSystem\Http\Controllers\Api\PtwController::class, 'deleteAttachment']); // _method:DELETE spoofing untuk IIS
    });

    Route::middleware('module.permission:document-system,can_delete,doc.ptw')->group(function () {
        Route::delete('/ptw/{id}', [\Modules\DocumentSystem\Http\Controllers\Api\PtwController::class, 'destroy']);
        Route::post('/ptw/{id}/delete', [\Modules\DocumentSystem\Http\Controllers\Api\PtwController::class, 'destroy']); // _method:DELETE spoofing untuk IIS
    });

    Route::middleware('module.permission:document-system,can_approval,doc.approval')->group(function () {
        Route::post('/ptw/{id}/approve', [\Modules\DocumentSystem\Http\Controllers\Api\PtwController::class, 'approve']);
        Route::post('/ptw/{id}/reject', [\Modules\DocumentSystem\Http\Controllers\Api\PtwController::class, 'reject']);
    });
});
