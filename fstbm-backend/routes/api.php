<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DoctorantController;
use App\Http\Controllers\Api\JuryController;

// =================== DOCTORANTS ===================
Route::get('/doctorants',          [DoctorantController::class, 'index']);
Route::post('/doctorants',         [DoctorantController::class, 'store']);
Route::get('/doctorants/{id}',     [DoctorantController::class, 'show']);
Route::put('/doctorants/{id}',     [DoctorantController::class, 'update']);
Route::delete('/doctorants/{id}',  [DoctorantController::class, 'destroy']);

// =================== JURIES ===================
Route::get('/juries',                        [JuryController::class, 'index']);
Route::post('/juries',                       [JuryController::class, 'store']);
Route::get('/juries/{id}',                   [JuryController::class, 'show']);
Route::put('/juries/{id}',                   [JuryController::class, 'update']);
Route::delete('/juries/{id}',                [JuryController::class, 'destroy']);
Route::post('/juries/{id}/attach',           [JuryController::class, 'attachDoctorant']);
