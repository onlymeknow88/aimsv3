<?php

use Illuminate\Support\Facades\Route;
use Modules\DocumentSystem\Http\Controllers\Api\DocumentApiController;
use Modules\DocumentSystem\Http\Controllers\Api\PermissionApiController;
use Modules\DocumentSystem\Http\Controllers\Api\MasterDataApiController;

Route::prefix('document-system')->group(function () {
    // Document API Actions
    Route::get('/documents', [DocumentApiController::class, 'index']);
    Route::post('/documents', [DocumentApiController::class, 'store']);
    Route::post('/documents/approve/{id}', [DocumentApiController::class, 'approve']);
    Route::post('/documents/reject/{id}', [DocumentApiController::class, 'reject']);
    Route::post('/documents/{id}', [DocumentApiController::class, 'update']);
    Route::get('/documents/{id}', [DocumentApiController::class, 'show']);

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

    // JSA API Actions
    Route::get('/jsa', [\Modules\DocumentSystem\Http\Controllers\JsaController::class, 'index']);
    Route::post('/jsa', [\Modules\DocumentSystem\Http\Controllers\JsaController::class, 'store']);
    Route::post('/jsa/{id}', [\Modules\DocumentSystem\Http\Controllers\JsaController::class, 'update']);
    Route::delete('/jsa/{id}', [\Modules\DocumentSystem\Http\Controllers\JsaController::class, 'destroy']);

    // PTW API Actions
    Route::get('/ptw', [\Modules\DocumentSystem\Http\Controllers\PtwController::class, 'index']);
    Route::post('/ptw', [\Modules\DocumentSystem\Http\Controllers\PtwController::class, 'store']);
    Route::post('/ptw/{id}', [\Modules\DocumentSystem\Http\Controllers\PtwController::class, 'update']);
    Route::delete('/ptw/{id}', [\Modules\DocumentSystem\Http\Controllers\PtwController::class, 'destroy']);
});
