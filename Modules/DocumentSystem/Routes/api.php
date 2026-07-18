<?php

use Illuminate\Support\Facades\Route;
use Modules\DocumentSystem\Http\Controllers\Api\DocumentApiController;
use Modules\DocumentSystem\Http\Controllers\Api\PermissionApiController;
use Modules\DocumentSystem\Http\Controllers\Api\MasterDataApiController;
use Modules\DocumentSystem\Http\Controllers\Api\JsaApiController;
use Modules\DocumentSystem\Http\Controllers\GeneralController;

Route::middleware(['web'])->prefix('document-system')->group(function () {
    // Document API Actions
    Route::get('/documents', [DocumentApiController::class, 'index']);
    Route::post('/documents', [DocumentApiController::class, 'store']);
    Route::post('/documents/approve/{id}', [DocumentApiController::class, 'approve']);
    Route::post('/documents/reject/{id}', [DocumentApiController::class, 'reject']);
    Route::post('/documents/{id}', [DocumentApiController::class, 'update']);
    Route::get('/documents/{id}', [DocumentApiController::class, 'show']);
    Route::delete('/documents', [DocumentApiController::class, 'destroy']);
    Route::delete('/attachments/{id}', [DocumentApiController::class, 'deleteAttachment']);
    Route::get('/attachments/{id}/preview', [GeneralController::class, 'previewAttachment']);
    Route::get('/attachments/{id}/download', [GeneralController::class, 'downloadAttachment']);
    Route::get('/attachments/{id}/sas-url', [GeneralController::class, 'sasUrl']);

    // Permission API Actions
    Route::get('/active-sops', [DocumentApiController::class, 'getActiveSops']);
    Route::get('/generate-number', [DocumentApiController::class, 'generateNumber']);
    Route::post('/permissions', [PermissionApiController::class, 'updatePermissions']);

    // Master Data API Actions
    Route::get('/companies', [MasterDataApiController::class, 'getCompanies']);
    Route::get('/departments', [MasterDataApiController::class, 'getDepartments']);
    Route::get('/pjs', [MasterDataApiController::class, 'getPjs']);
    Route::get('/modules', [MasterDataApiController::class, 'getModules']);
    Route::get('/categories', [MasterDataApiController::class, 'getCategories']);
    Route::get('/mappings', [MasterDataApiController::class, 'getMappings']);
    Route::get('/employees', [MasterDataApiController::class, 'getEmployees']);

    // JSA API Actions
    Route::get('/jsa', [JsaApiController::class, 'index']);
    Route::get('/jsa/{id}', [JsaApiController::class, 'show']);
    Route::post('/jsa', [JsaApiController::class, 'store']);
    Route::post('/jsa/{id}', [JsaApiController::class, 'update']);
    Route::delete('/jsa/{id}', [JsaApiController::class, 'destroy']);
    Route::delete('/jsa/attachments/{id}', [JsaApiController::class, 'deleteAttachment']);

    // PTW API Actions
    Route::get('/ptw', [\Modules\DocumentSystem\Http\Controllers\PtwController::class, 'index']);
    Route::post('/ptw', [\Modules\DocumentSystem\Http\Controllers\PtwController::class, 'store']);
    Route::post('/ptw/{id}', [\Modules\DocumentSystem\Http\Controllers\PtwController::class, 'update']);
    Route::delete('/ptw/{id}', [\Modules\DocumentSystem\Http\Controllers\PtwController::class, 'destroy']);
});
