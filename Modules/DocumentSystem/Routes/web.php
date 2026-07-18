<?php

use Illuminate\Support\Facades\Route;
use Modules\DocumentSystem\Http\Controllers\DocumentSystemController;

Route::middleware(['web', 'auth'])->prefix('document-system')->group(function () {
    Route::get('/', [DocumentSystemController::class, 'index'])->name('doc.dashboard');
    Route::get('/active', [DocumentSystemController::class, 'activeDocument'])->name('doc.active');
    Route::get('/active/create', [DocumentSystemController::class, 'create'])->name('doc.active.create');
    Route::get('/active/edit/{id}', [DocumentSystemController::class, 'edit'])->name('doc.active.edit');
    Route::get('/active/detail/{id}', [DocumentSystemController::class, 'detail'])->name('doc.active.detail');
    Route::get('/maker', function () {
        return redirect()->route('doc.active');
    })->name('doc.maker');
    Route::get('/maker/create', function () {
        return redirect()->route('doc.active.create');
    })->name('doc.maker.create');
    Route::get('/ongoing', [DocumentSystemController::class, 'ongoing'])->name('doc.ongoing');
    Route::get('/draft', [DocumentSystemController::class, 'draft'])->name('doc.draft');
    Route::get('/obsolete', [DocumentSystemController::class, 'obsolete'])->name('doc.obsolete');
    Route::get('/approval', [DocumentSystemController::class, 'approval'])->name('doc.approval');
    Route::get('/jsa', [\Modules\DocumentSystem\Http\Controllers\JsaController::class, 'index'])->name('doc.jsa');
    Route::get('/jsa/create', [\Modules\DocumentSystem\Http\Controllers\JsaController::class, 'create'])->name('doc.jsa.create');
    Route::get('/jsa/draft', [\Modules\DocumentSystem\Http\Controllers\JsaController::class, 'draft'])->name('doc.jsa.draft');
    Route::get('/jsa/obsolete', [\Modules\DocumentSystem\Http\Controllers\JsaController::class, 'obsolete'])->name('doc.jsa.obsolete');
    Route::get('/jsa/edit/{id}', [\Modules\DocumentSystem\Http\Controllers\JsaController::class, 'edit'])->name('doc.jsa.edit');
    Route::get('/jsa/detail/{id}', [\Modules\DocumentSystem\Http\Controllers\JsaController::class, 'detail'])->name('doc.jsa.detail');
    Route::get('/ptw', [DocumentSystemController::class, 'ptw'])->name('doc.ptw');
    Route::get('/master', [DocumentSystemController::class, 'master'])->name('doc.master');
});

