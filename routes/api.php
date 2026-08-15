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
            Route::post('/{id}/update', [\App\Http\Controllers\Admin\Api\AimsMenuController::class, 'update']); // IIS Spoofing
            Route::delete('/{id}', [\App\Http\Controllers\Admin\Api\AimsMenuController::class, 'destroy']);
            Route::post('/{id}/delete', [\App\Http\Controllers\Admin\Api\AimsMenuController::class, 'destroy']); // IIS Spoofing
        });

        // ── Users API ─────────────────────────────────────────────────
        Route::prefix('users')->group(function () {
            Route::get('/',            [\App\Http\Controllers\Admin\Api\UserController::class, 'index']);
            Route::get('/master-data', [\App\Http\Controllers\Admin\Api\UserController::class, 'masterData']);
            Route::post('/',           [\App\Http\Controllers\Admin\Api\UserController::class, 'store']);
            Route::put('/{id}',        [\App\Http\Controllers\Admin\Api\UserController::class, 'update']);
            Route::post('/{id}/update', [\App\Http\Controllers\Admin\Api\UserController::class, 'update']); // IIS Spoofing
            Route::delete('/{id}',     [\App\Http\Controllers\Admin\Api\UserController::class, 'destroy']);
            Route::post('/{id}/delete', [\App\Http\Controllers\Admin\Api\UserController::class, 'destroy']); // IIS Spoofing
        });

        // ── Departments API ───────────────────────────────────────────
        Route::prefix('departments')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\Api\DepartmentController::class, 'index']);
            Route::get('/master-data', [\App\Http\Controllers\Admin\Api\DepartmentController::class, 'masterData']);
            Route::post('/', [\App\Http\Controllers\Admin\Api\DepartmentController::class, 'store']);
            Route::put('/{id}', [\App\Http\Controllers\Admin\Api\DepartmentController::class, 'update']);
            Route::post('/{id}/update', [\App\Http\Controllers\Admin\Api\DepartmentController::class, 'update']); // IIS Spoofing
            Route::delete('/{id}', [\App\Http\Controllers\Admin\Api\DepartmentController::class, 'destroy']);
            Route::post('/{id}/delete', [\App\Http\Controllers\Admin\Api\DepartmentController::class, 'destroy']); // IIS Spoofing
        });

        // ── Sections API ──────────────────────────────────────────────
        Route::prefix('sections')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\Api\SectionController::class, 'index']);
            Route::get('/master-data', [\App\Http\Controllers\Admin\Api\SectionController::class, 'masterData']);
            Route::post('/area-locations', [\App\Http\Controllers\Admin\Api\SectionController::class, 'storeAreaLocation']);
            Route::put('/area-locations/{id}', [\App\Http\Controllers\Admin\Api\SectionController::class, 'updateAreaLocation']);
            Route::post('/area-locations/{id}/update', [\App\Http\Controllers\Admin\Api\SectionController::class, 'updateAreaLocation']); // IIS Spoofing
            Route::post('/area-managers', [\App\Http\Controllers\Admin\Api\SectionController::class, 'storeAreaManager']);
            Route::put('/area-managers/{id}', [\App\Http\Controllers\Admin\Api\SectionController::class, 'updateAreaManager']);
            Route::post('/area-managers/{id}/update', [\App\Http\Controllers\Admin\Api\SectionController::class, 'updateAreaManager']); // IIS Spoofing
            Route::post('/', [\App\Http\Controllers\Admin\Api\SectionController::class, 'store']);
            Route::put('/{id}', [\App\Http\Controllers\Admin\Api\SectionController::class, 'update']);
            Route::post('/{id}/update', [\App\Http\Controllers\Admin\Api\SectionController::class, 'update']); // IIS Spoofing
            Route::delete('/{id}', [\App\Http\Controllers\Admin\Api\SectionController::class, 'destroy']);
            Route::post('/{id}/delete', [\App\Http\Controllers\Admin\Api\SectionController::class, 'destroy']); // IIS Spoofing
            Route::delete(
                '/area-managers/{id}',
                [SectionController::class, 'destroyAreaManager']
            );
            Route::post('/area-managers/{id}/delete', [SectionController::class, 'destroyAreaManager']); // IIS Spoofing
            Route::delete(
                '/area-locations/{id}',
                [SectionController::class, 'destroyAreaLocation']
            );
            Route::post('/area-locations/{id}/delete', [SectionController::class, 'destroyAreaLocation']); // IIS Spoofing
        });

        // ── Business Entities API ──────────────────────────────────────────────
        Route::prefix('business-entities')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\Api\BusinessController::class, 'index']);
            Route::post('/', [\App\Http\Controllers\Admin\Api\BusinessController::class, 'store']);
            Route::put('/{id}', [\App\Http\Controllers\Admin\Api\BusinessController::class, 'update']);
            Route::post('/{id}/update', [\App\Http\Controllers\Admin\Api\BusinessController::class, 'update']); // IIS Spoofing
            Route::delete('/{id}', [\App\Http\Controllers\Admin\Api\BusinessController::class, 'destroy']);
            Route::post('/{id}/delete', [\App\Http\Controllers\Admin\Api\BusinessController::class, 'destroy']); // IIS Spoofing
        });

        // ── Companies API ──────────────────────────────────────────────────────
        Route::prefix('companies')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\Api\CompanyController::class, 'index']);
            Route::post('/', [\App\Http\Controllers\Admin\Api\CompanyController::class, 'store']);
            Route::put('/{id}', [\App\Http\Controllers\Admin\Api\CompanyController::class, 'update']);
            Route::post('/{id}/update', [\App\Http\Controllers\Admin\Api\CompanyController::class, 'update']); // IIS Spoofing
            Route::delete('/{id}', [\App\Http\Controllers\Admin\Api\CompanyController::class, 'destroy']);
            Route::post('/{id}/delete', [\App\Http\Controllers\Admin\Api\CompanyController::class, 'destroy']); // IIS Spoofing
        });

        // ── Role & Permissions API ─────────────────────────────────────────────
        Route::prefix('role-permissions')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\Api\RolePermissionController::class, 'index']);
            Route::post('/update', [\App\Http\Controllers\Admin\Api\RolePermissionController::class, 'update']);
            Route::post('/bulk-update', [\App\Http\Controllers\Admin\Api\RolePermissionController::class, 'bulkUpdate']);
            Route::post('/roles', [\App\Http\Controllers\Admin\Api\RolePermissionController::class, 'storeRole']);
            Route::put('/roles/{id}', [\App\Http\Controllers\Admin\Api\RolePermissionController::class, 'updateRole']);
            Route::post('/roles/{id}/update', [\App\Http\Controllers\Admin\Api\RolePermissionController::class, 'updateRole']); // IIS Spoofing
            Route::delete('/roles/{id}', [\App\Http\Controllers\Admin\Api\RolePermissionController::class, 'destroyRole']);
            Route::post('/roles/{id}/delete', [\App\Http\Controllers\Admin\Api\RolePermissionController::class, 'destroyRole']); // IIS Spoofing
        });

        // ── AIMS Modules API ──────────────────────────────────────────────────
        Route::prefix('modules')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\Api\AimsModuleController::class, 'index']);
            Route::post('/', [\App\Http\Controllers\Admin\Api\AimsModuleController::class, 'store']);
            Route::put('/{id}', [\App\Http\Controllers\Admin\Api\AimsModuleController::class, 'update']);
            Route::post('/{id}/update', [\App\Http\Controllers\Admin\Api\AimsModuleController::class, 'update']); // IIS Spoofing
            Route::delete('/{id}', [\App\Http\Controllers\Admin\Api\AimsModuleController::class, 'destroy']);
            Route::post('/{id}/delete', [\App\Http\Controllers\Admin\Api\AimsModuleController::class, 'destroy']); // IIS Spoofing
        });

        // ── Login Logs API ────────────────────────────────────────────────────
        Route::prefix('login-logs')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\Api\LoginLogController::class, 'index']);
            Route::get('/stats', [\App\Http\Controllers\Admin\Api\LoginLogController::class, 'stats']);
        });

        // ── Activity Logs API ─────────────────────────────────────────────────
        Route::prefix('activity-logs')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\Api\ActivityLogController::class, 'index']);
            Route::get('/stats', [\App\Http\Controllers\Admin\Api\ActivityLogController::class, 'stats']);
        });

        // ── User Activity Logs API ────────────────────────────────────────────
        Route::prefix('user-activity-logs')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\Api\UserActivityLogController::class, 'index']);
            Route::get('/stats', [\App\Http\Controllers\Admin\Api\UserActivityLogController::class, 'stats']);
        });
    });

Route::middleware(['web', 'auth'])->prefix('api')->group(function () {
    // ── Dashboard aggregator ──────────────────────────────────────────────────
    Route::get('/dashboard/data', [\App\Http\Controllers\Api\DashboardController::class, 'getData']);

    // ── COE calendar, event detail & stats endpoints ────────────────────────────
    Route::get('/dashboard/coe/calendar',        [\App\Http\Controllers\Api\DashboardController::class, 'coeCalendar']);
    Route::get('/dashboard/coe/events/{id}',     [\App\Http\Controllers\Api\DashboardController::class, 'coeEventDetail']);
    Route::get('/dashboard/coe/stats',           [\App\Http\Controllers\Api\DashboardController::class, 'coeStats']);

    // ── Portal public news endpoints (used by dashboard widget) ──────────────
    Route::get('/portal/news',       [\Modules\DashboardPortal\Http\Controllers\Api\DashboardPortalController::class, 'newsIndex']);
    Route::get('/portal/news/{id}',  [\Modules\DashboardPortal\Http\Controllers\Api\DashboardPortalController::class, 'newsShow']);

    // ── Document System widget stats for the dashboard ────────────────────────
    Route::get('/portal/document-system/stats', [\Modules\DocumentSystem\Http\Controllers\Api\DocumentSystemWidgetController::class, 'stats']);

    // ── Field Leadership widget stats for the dashboard ───────────────────────
    Route::get('/dashboard/field-leadership/stats', [\App\Http\Controllers\Api\FieldLeadershipStatsController::class, 'index']);

    // ── Incident Notification widget stats for the dashboard ─────────────────
    Route::get('/dashboard/incident-stats', [\Modules\DashboardPortal\Http\Controllers\Api\IncidentNotificationController::class, 'stats']);

    // ── Production widget stats for the dashboard ─────────────────────────
    Route::get('/dashboard/production/stats', [\Modules\DashboardPortal\Http\Controllers\Api\ProductionController::class, 'stats']);

    // ── Safety Performance widget stats for the dashboard ─────────────────
    Route::get('/dashboard/safety-performance/stats', [\Modules\DashboardPortal\Http\Controllers\Api\SafetyPerformanceController::class, 'stats']);

    // ── Health Performance widget stats for the dashboard ──────────────────
    Route::get('/dashboard/health-performance/stats', [\Modules\DashboardPortal\Http\Controllers\Api\HealthPerformanceController::class, 'stats']);
});
