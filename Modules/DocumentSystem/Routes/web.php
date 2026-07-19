<?php

use Illuminate\Support\Facades\Route;
use Modules\DocumentSystem\Http\Controllers\DocumentSystemController;

Route::middleware(['web', 'auth'])->prefix('document-system')->group(function () {
    // Dashboard
    Route::get('/', [DocumentSystemController::class, 'index'])
        ->middleware('module.permission:document-system,can_view,doc.dashboard')
        ->name('doc.dashboard');

    // Standard Documents / Kebijakan
    Route::get('/active', [DocumentSystemController::class, 'activeDocument'])
        ->middleware('module.permission:document-system,can_view,doc.maker')
        ->name('doc.active');
    Route::get('/active/create', [DocumentSystemController::class, 'create'])
        ->middleware('module.permission:document-system,can_create,doc.maker')
        ->name('doc.active.create');
    Route::get('/active/edit/{id}', [DocumentSystemController::class, 'edit'])
        ->middleware('module.permission:document-system,can_edit,doc.maker')
        ->name('doc.active.edit');
    Route::get('/active/detail/{id}', [DocumentSystemController::class, 'detail'])
        ->middleware('module.permission:document-system,can_view,doc.maker')
        ->name('doc.active.detail');

    Route::get('/maker', function () {
        return redirect()->route('doc.active');
    })->name('doc.maker');
    Route::get('/maker/create', function () {
        return redirect()->route('doc.active.create');
    })->name('doc.maker.create');

    Route::get('/ongoing', [DocumentSystemController::class, 'ongoing'])
        ->middleware('module.permission:document-system,can_view,doc.ongoing')
        ->name('doc.ongoing');
    Route::get('/draft', [DocumentSystemController::class, 'draft'])
        ->middleware('module.permission:document-system,can_view,doc.draft')
        ->name('doc.draft');
    Route::get('/obsolete', [DocumentSystemController::class, 'obsolete'])
        ->middleware('module.permission:document-system,can_view,doc.obsolete')
        ->name('doc.obsolete');
    Route::get('/approval', [DocumentSystemController::class, 'approval'])
        ->middleware('module.permission:document-system,can_approval,doc.approval')
        ->name('doc.approval');

    // Job Safety Analysis (JSA)
    Route::get('/jsa', [\Modules\DocumentSystem\Http\Controllers\JsaController::class, 'index'])
        ->middleware('module.permission:document-system,can_view,doc.jsa')
        ->name('doc.jsa');
    Route::get('/jsa/create', [\Modules\DocumentSystem\Http\Controllers\JsaController::class, 'create'])
        ->middleware('module.permission:document-system,can_create,doc.jsa')
        ->name('doc.jsa.create');
    Route::get('/jsa/draft', [\Modules\DocumentSystem\Http\Controllers\JsaController::class, 'draft'])
        ->middleware('module.permission:document-system,can_view,doc.jsa.draft')
        ->name('doc.jsa.draft');
    Route::get('/jsa/obsolete', [\Modules\DocumentSystem\Http\Controllers\JsaController::class, 'obsolete'])
        ->middleware('module.permission:document-system,can_view,doc.jsa.obsolete')
        ->name('doc.jsa.obsolete');
    Route::get('/jsa/edit/{id}', [\Modules\DocumentSystem\Http\Controllers\JsaController::class, 'edit'])
        ->middleware('module.permission:document-system,can_edit,doc.jsa')
        ->name('doc.jsa.edit');
    Route::get('/jsa/detail/{id}', [\Modules\DocumentSystem\Http\Controllers\JsaController::class, 'detail'])
        ->middleware('module.permission:document-system,can_view,doc.jsa')
        ->name('doc.jsa.detail');

    // Permit To Work (PTW)
    Route::get('/ptw', [\Modules\DocumentSystem\Http\Controllers\PtwController::class, 'index'])
        ->middleware('module.permission:document-system,can_view,doc.ptw')
        ->name('doc.ptw');
    Route::get('/ptw/create', [\Modules\DocumentSystem\Http\Controllers\PtwController::class, 'create'])
        ->middleware('module.permission:document-system,can_create,doc.ptw')
        ->name('doc.ptw.create');
    Route::get('/ptw/edit/{id}', [\Modules\DocumentSystem\Http\Controllers\PtwController::class, 'edit'])
        ->middleware('module.permission:document-system,can_edit,doc.ptw')
        ->name('doc.ptw.edit');
    Route::get('/ptw/detail/{id}', [\Modules\DocumentSystem\Http\Controllers\PtwController::class, 'detail'])
        ->middleware('module.permission:document-system,can_view,doc.ptw')
        ->name('doc.ptw.detail');

    // Master Data
    Route::get('/master', [DocumentSystemController::class, 'master'])
        ->middleware('module.permission:document-system,can_view,doc.master')
        ->name('doc.master');
});

