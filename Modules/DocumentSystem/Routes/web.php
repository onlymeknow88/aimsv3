<?php

use Illuminate\Support\Facades\Route;
use Modules\DocumentSystem\Http\Controllers\DocumentSystemController;

Route::middleware('web')->prefix('document-system')->group(function () {
    Route::get('/', [DocumentSystemController::class, 'index'])->name('doc.dashboard');
    Route::get('/active', [DocumentSystemController::class, 'activeDocument'])->name('doc.active');
    Route::get('/maker', [DocumentSystemController::class, 'maker'])->name('doc.maker');
    Route::get('/maker/create', [DocumentSystemController::class, 'create'])->name('doc.maker.create');
    Route::get('/ongoing', [DocumentSystemController::class, 'ongoing'])->name('doc.ongoing');
    Route::get('/draft', [DocumentSystemController::class, 'draft'])->name('doc.draft');
    Route::get('/obsolete', [DocumentSystemController::class, 'obsolete'])->name('doc.obsolete');
    Route::get('/approval', [DocumentSystemController::class, 'approval'])->name('doc.approval');
    Route::get('/jsa', [DocumentSystemController::class, 'jsa'])->name('doc.jsa');
    Route::get('/ptw', [DocumentSystemController::class, 'ptw'])->name('doc.ptw');
    Route::get('/master', [DocumentSystemController::class, 'master'])->name('doc.master');
});

