<?php

use Illuminate\Support\Facades\Route;
use Modules\Pica\Http\Controllers\PicaController;

Route::middleware(['web', 'auth'])->prefix('pica')->as('pica.')->group(function () {
    Route::get('/', fn() => redirect()->route('pica.dashboard'));

    Route::get('/dashboard', [PicaController::class, 'dashboard'])
        ->middleware('module.permission:pica,can_view,pica.dashboard')
        ->name('dashboard');

    Route::get('/active-document', [PicaController::class, 'activeDocument'])
        ->middleware('module.permission:pica,can_view,pica.active-document')
        ->name('active-document');

    Route::get('/create', [PicaController::class, 'create'])
        ->middleware('module.permission:pica,can_create,pica.active-document')
        ->name('create');

    Route::get('/edit/{id}', [PicaController::class, 'edit'])
        ->middleware('module.permission:pica,can_edit,pica.active-document')
        ->name('edit');

    Route::get('/detail/{id}', [PicaController::class, 'detail'])
        ->middleware('module.permission:pica,can_view,pica.active-document')
        ->name('detail');

    Route::get('/draft', [PicaController::class, 'draft'])
        ->middleware('module.permission:pica,can_view,pica.draft')
        ->name('draft');

    Route::get('/return-document', [PicaController::class, 'returnDocument'])
        ->middleware('module.permission:pica,can_view,pica.return-document')
        ->name('return-document');

    Route::get('/review-crs', [PicaController::class, 'reviewCrs'])
        ->middleware('module.permission:pica,can_view,pica.review-crs')
        ->name('review-crs');

    Route::get('/review-crs/{id}', [PicaController::class, 'reviewCrsDetail'])
        ->middleware('module.permission:pica,can_view,pica.review-crs')
        ->name('review-crs.detail');
});
