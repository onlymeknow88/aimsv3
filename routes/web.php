<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $events = [];
    if (class_exists('Modules\Coe\Entities\Event')) {
        $query = \Modules\Coe\Entities\Event::with(['category', 'section'])->orderBy('start_date', 'asc');
        $rawEvents = (clone $query)->where('start_date', '>=', now()->toDateString())->limit(5)->get();
        if ($rawEvents->isEmpty()) {
            $rawEvents = $query->limit(5)->get();
        }
        $events = $rawEvents->map(function ($event) {
            $startDate = \Carbon\Carbon::parse($event->start_date);
            
            $statusColor = '#FF8C24';
            if ($event->status === 'Completed') {
                $statusColor = '#2FBF71';
            } elseif ($event->status === 'Cancelled') {
                $statusColor = '#F44336';
            }
            
            return [
                'date'   => strtoupper($startDate->translatedFormat('d M')), // e.g. "23 JUN"
                'title'  => $event->title,
                'dept'   => $event->section->name ?? ($event->category->name ?? 'General'),
                'status' => strtoupper($event->status),
                'color'  => $statusColor,
            ];
        })->toArray();
    }

    return Inertia::render('Dashboard', [
        'coeEvents' => $events
    ]);
})->name('dashboard');

Route::middleware('admin.session')->group(function () {
    Route::get('/admin/login', [\App\Http\Controllers\Admin\AdminLoginController::class, 'showLoginForm'])->name('admin.login');
    Route::post('/admin/login', [\App\Http\Controllers\Admin\AdminLoginController::class, 'login']);
    Route::post('/admin/logout', [\App\Http\Controllers\Admin\AdminLoginController::class, 'logout'])->name('admin.logout');
});

Route::middleware(['admin.session', 'auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['admin.session', 'auth:admin', 'admin.auth'])->prefix('admin')->group(function () {
    Route::get('/', function() {
        return redirect()->route('admin.dashboard');
    });

    Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('admin.dashboard');

    // Business Entities CRUD
    Route::get('/business-entities', [\App\Http\Controllers\Admin\BusinessEntityController::class, 'index'])->name('admin.business-entities');
    // Route::post('/business-entities', [\App\Http\Controllers\Admin\BusinessEntityController::class, 'store']);
    // Route::put('/business-entities/{id}', [\App\Http\Controllers\Admin\BusinessEntityController::class, 'update']);
    // Route::delete('/business-entities/{id}', [\App\Http\Controllers\Admin\BusinessEntityController::class, 'destroy']);

    // Roles & Permission Matrix Matrix CRUD
    Route::get('/role-permissions', [\App\Http\Controllers\RolePermissionController::class, 'index'])->name('admin.role-permissions');
    // Route::post('/role-permissions/update', [\App\Http\Controllers\RolePermissionController::class, 'update']);
    // Route::post('/role-permissions/bulk-update', [\App\Http\Controllers\RolePermissionController::class, 'bulkUpdate']);
    // Route::post('/role-permissions/roles', [\App\Http\Controllers\RolePermissionController::class, 'storeRole']);
    // Route::put('/role-permissions/roles/{id}', [\App\Http\Controllers\RolePermissionController::class, 'updateRole']);
    // Route::delete('/role-permissions/roles/{id}', [\App\Http\Controllers\RolePermissionController::class, 'destroyRole']);

    // Users & Employee CRUD
    Route::get('/users', [\App\Http\Controllers\Admin\UserController::class, 'index'])->name('admin.users');
    // Route::post('/users', [\App\Http\Controllers\Admin\UserController::class, 'store']);
    // Route::put('/users/{id}', [\App\Http\Controllers\Admin\UserController::class, 'update']);
    // Route::delete('/users/{id}', [\App\Http\Controllers\Admin\UserController::class, 'destroy']);

    // Companies CRUD
    Route::get('/companies', [\App\Http\Controllers\Admin\CompanyController::class, 'index'])->name('admin.companies');
    // Route::post('/companies', [\App\Http\Controllers\Admin\CompanyController::class, 'store']);
    // Route::put('/companies/{id}', [\App\Http\Controllers\Admin\CompanyController::class, 'update']);
    // Route::delete('/companies/{id}', [\App\Http\Controllers\Admin\CompanyController::class, 'destroy']);

    // Departments CRUD
    Route::get('/departments', [\App\Http\Controllers\Admin\DepartmentController::class, 'index'])->name('admin.departments');
    // Route::post('/departments', [\App\Http\Controllers\Admin\DepartmentController::class, 'store']);
    // Route::put('/departments/{id}', [\App\Http\Controllers\Admin\DepartmentController::class, 'update']);
    // Route::delete('/departments/{id}', [\App\Http\Controllers\Admin\DepartmentController::class, 'destroy']);

    // Sections CRUD
    Route::get('/sections', [\App\Http\Controllers\Admin\SectionController::class, 'index'])->name('admin.sections');
    // Route::post('/sections', [\App\Http\Controllers\Admin\SectionController::class, 'store']);
    // Route::put('/sections/{id}', [\App\Http\Controllers\Admin\SectionController::class, 'update']);
    // Route::delete('/sections/{id}', [\App\Http\Controllers\Admin\SectionController::class, 'destroy']);

    // AIMS Menu — Inertia Page
    Route::get('/aims-menu', [\App\Http\Controllers\Admin\AimsMenuController::class, 'index'])->name('admin.aims-menu');

    // AIMS Modules — Inertia Page
    Route::get('/modules', [\App\Http\Controllers\Admin\AimsModuleController::class, 'index'])->name('admin.modules');
});

require __DIR__.'/auth.php';
