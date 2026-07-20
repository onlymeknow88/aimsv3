<?php

use App\Http\Controllers\Admin\Api\SectionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — Admin
|--------------------------------------------------------------------------
|
| Route API untuk backoffice admin. Di-load via bootstrap/app.php
| menggunakan middleware web (session-based) dengan admin auth guard.
|
*/

Route::middleware(['admin.session', 'auth:admin', 'admin.auth'])
    ->prefix('api/admin')
    ->group(function () {

        // ── AIMS Menu API ─────────────────────────────────────────────
        Route::prefix('aims-menu')->group(function () {
            Route::get('/',        [\App\Http\Controllers\Admin\Api\AimsMenuController::class, 'apiIndex']);
            Route::get('/list',    [\App\Http\Controllers\Admin\Api\AimsMenuController::class, 'apiList']);
            Route::get('/modules', [\App\Http\Controllers\Admin\Api\AimsMenuController::class, 'getModules']);
            Route::post('/',       [\App\Http\Controllers\Admin\Api\AimsMenuController::class, 'store']);
            Route::put('/{id}',    [\App\Http\Controllers\Admin\Api\AimsMenuController::class, 'update']);
            Route::delete('/{id}', [\App\Http\Controllers\Admin\Api\AimsMenuController::class, 'destroy']);
        });

        // ── Users API ─────────────────────────────────────────────────
        Route::prefix('users')->group(function () {
            Route::get('/',            [\App\Http\Controllers\Admin\Api\UserController::class, 'index']);
            Route::get('/master-data', [\App\Http\Controllers\Admin\Api\UserController::class, 'masterData']);
            Route::post('/',           [\App\Http\Controllers\Admin\Api\UserController::class, 'store']);
            Route::put('/{id}',        [\App\Http\Controllers\Admin\Api\UserController::class, 'update']);
            Route::delete('/{id}',     [\App\Http\Controllers\Admin\Api\UserController::class, 'destroy']);
        });

        // ── Departments API ───────────────────────────────────────────
        Route::prefix('departments')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\Api\DepartmentController::class, 'index']);
            Route::post('/', [\App\Http\Controllers\Admin\Api\DepartmentController::class, 'store']);
            Route::put('/{id}', [\App\Http\Controllers\Admin\Api\DepartmentController::class, 'update']);
            Route::delete('/{id}', [\App\Http\Controllers\Admin\Api\DepartmentController::class, 'destroy']);
        });

        // ── Sections API ──────────────────────────────────────────────
        Route::prefix('sections')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\Api\SectionController::class, 'index']);
            Route::get('/master-data', [\App\Http\Controllers\Admin\Api\SectionController::class, 'masterData']);
            Route::post('/area-locations', [\App\Http\Controllers\Admin\Api\SectionController::class, 'storeAreaLocation']);
            Route::put('/area-locations/{id}', [\App\Http\Controllers\Admin\Api\SectionController::class, 'updateAreaLocation']);
            Route::post('/area-managers', [\App\Http\Controllers\Admin\Api\SectionController::class, 'storeAreaManager']);
            Route::put('/area-managers/{id}', [\App\Http\Controllers\Admin\Api\SectionController::class, 'updateAreaManager']);
            Route::post('/', [\App\Http\Controllers\Admin\Api\SectionController::class, 'store']);
            Route::put('/{id}', [\App\Http\Controllers\Admin\Api\SectionController::class, 'update']);
            Route::delete('/{id}', [\App\Http\Controllers\Admin\Api\SectionController::class, 'destroy']);
            Route::delete(
                '/area-managers/{id}',
                [SectionController::class, 'destroyAreaManager']
            );
            Route::delete(
                '/area-locations/{id}',
                [SectionController::class, 'destroyAreaLocation']
            );
        });

        // ── Business Entities API ──────────────────────────────────────────────
        Route::prefix('business-entities')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\Api\BusinessController::class, 'index']);
            Route::post('/', [\App\Http\Controllers\Admin\Api\BusinessController::class, 'store']);
            Route::put('/{id}', [\App\Http\Controllers\Admin\Api\BusinessController::class, 'update']);
            Route::delete('/{id}', [\App\Http\Controllers\Admin\Api\BusinessController::class, 'destroy']);
        });

        // ── Companies API ──────────────────────────────────────────────────────
        Route::prefix('companies')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\Api\CompanyController::class, 'index']);
            Route::post('/', [\App\Http\Controllers\Admin\Api\CompanyController::class, 'store']);
            Route::put('/{id}', [\App\Http\Controllers\Admin\Api\CompanyController::class, 'update']);
            Route::delete('/{id}', [\App\Http\Controllers\Admin\Api\CompanyController::class, 'destroy']);
        });

        // ── Role & Permissions API ─────────────────────────────────────────────
        Route::prefix('role-permissions')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\Api\RolePermissionController::class, 'index']);
            Route::post('/update', [\App\Http\Controllers\Admin\Api\RolePermissionController::class, 'update']);
            Route::post('/bulk-update', [\App\Http\Controllers\Admin\Api\RolePermissionController::class, 'bulkUpdate']);
            Route::post('/roles', [\App\Http\Controllers\Admin\Api\RolePermissionController::class, 'storeRole']);
            Route::put('/roles/{id}', [\App\Http\Controllers\Admin\Api\RolePermissionController::class, 'updateRole']);
            Route::delete('/roles/{id}', [\App\Http\Controllers\Admin\Api\RolePermissionController::class, 'destroyRole']);
        });

        // ── AIMS Modules API ──────────────────────────────────────────────────
        Route::prefix('modules')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\Api\AimsModuleController::class, 'index']);
            Route::post('/', [\App\Http\Controllers\Admin\Api\AimsModuleController::class, 'store']);
            Route::put('/{id}', [\App\Http\Controllers\Admin\Api\AimsModuleController::class, 'update']);
            Route::delete('/{id}', [\App\Http\Controllers\Admin\Api\AimsModuleController::class, 'destroy']);
        });
    });

Route::middleware(['web', 'auth'])->prefix('api')->group(function () {
    Route::get('/dashboard/data', [\App\Http\Controllers\Api\DashboardController::class, 'getData']);
});
