<?php

use Illuminate\Support\Facades\Route;
use Modules\DocumentSystem\Http\Controllers\Api\DocumentApiController;
use Modules\DocumentSystem\Http\Controllers\Api\PermissionApiController;
use Modules\DocumentSystem\Http\Controllers\Api\MasterDataApiController;

Route::prefix('document-system')->group(function () {
    // Document API Actions
    Route::post('/documents', [DocumentApiController::class, 'store']);
    Route::get('/active-sops', [DocumentApiController::class, 'getActiveSops']);
    Route::get('/generate-number', [DocumentApiController::class, 'generateNumber']);

    // Permission API Actions
    Route::post('/permissions', [PermissionApiController::class, 'updatePermissions']);

    // Master Data API Actions
    Route::get('/companies', [MasterDataApiController::class, 'getCompanies']);
    Route::get('/departments', [MasterDataApiController::class, 'getDepartments']);
    Route::get('/pjs', [MasterDataApiController::class, 'getPjs']);
    Route::get('/modules', [MasterDataApiController::class, 'getModules']);
    Route::get('/categories', [MasterDataApiController::class, 'getCategories']);
    Route::get('/mappings', [MasterDataApiController::class, 'getMappings']);
});
