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
    Route::get('/jsa', [DocumentSystemController::class, 'jsa'])->name('doc.jsa');
    Route::get('/jsa/create', [DocumentSystemController::class, 'jsaCreate'])->name('doc.jsa.create');
    Route::get('/jsa/edit/{id}', [DocumentSystemController::class, 'jsaEdit'])->name('doc.jsa.edit');
    Route::get('/ptw', [DocumentSystemController::class, 'ptw'])->name('doc.ptw');
    Route::get('/master', [DocumentSystemController::class, 'master'])->name('doc.master');
});

