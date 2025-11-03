<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\KategoriObatController;
use App\Http\Controllers\Api\KategoriSuplemenController;
use App\Http\Controllers\Api\ObatController;
use App\Http\Controllers\Api\PenyakitController;
use App\Http\Controllers\Api\RekomendasiController;
use App\Http\Controllers\Api\SuplemenController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function() {
    Route::post('/logout', [AuthController::class, 'logout']);

    // CRUD Obat
    Route::get('/obat', [ObatController::class, 'index']);
    Route::post('/obat', [ObatController::class, 'store']);
    Route::get('/obat/{id}', [ObatController::class, 'show']);
    Route::put('/obat/{id}', [ObatController::class, 'update']);
    Route::delete('/obat/{id}', [ObatController::class, 'destroy']);

    // CRUD Suplemen
    Route::get('/suplemen', [SuplemenController::class, 'index']);
    Route::post('/suplemen', [SuplemenController::class, 'store']);
    Route::get('/suplemen/{id}', [SuplemenController::class, 'show']);
    Route::put('/suplemen/{id}', [SuplemenController::class, 'update']);
    Route::delete('/suplemen/{id}', [SuplemenController::class, 'destroy']);

    // CRUD Kategori Obat
    Route::get('/kategori-obat', [KategoriObatController::class, 'index']);
    Route::post('/kategori-obat', [KategoriObatController::class, 'store']);
    Route::get('/kategori-obat/{id}', [KategoriObatController::class, 'show']);
    Route::put('/kategori-obat/{id}', [KategoriObatController::class, 'update']);
    Route::delete('/kategori-obat/{id}', [KategoriObatController::class, 'destroy']);

    // CRUD Kategori Suplemen
    Route::get('/kategori-suplemen', [KategoriSuplemenController::class, 'index']);
    Route::post('/kategori-suplemen', [KategoriSuplemenController::class, 'store']);
    Route::get('/kategori-suplemen/{id}', [KategoriSuplemenController::class, 'show']);
    Route::put('/kategori-suplemen/{id}', [KategoriSuplemenController::class, 'update']);
    Route::delete('/kategori-suplemen/{id}', [KategoriSuplemenController::class, 'destroy']);

    // CRUD Penyakit
    Route::get('/penyakit', [PenyakitController::class, 'index']);
    Route::post('/penyakit', [PenyakitController::class, 'store']);
    Route::get('/penyakit/{id}', [PenyakitController::class, 'show']);
    Route::put('/penyakit/{id}', [PenyakitController::class, 'update']);
    Route::delete('/penyakit/{id}', [PenyakitController::class, 'destroy']);

    // READ Rekomendasi
    Route::get('/rekomendasi', [RekomendasiController::class, 'index']);
});
