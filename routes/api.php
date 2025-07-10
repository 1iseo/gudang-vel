<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BarangController;
use App\Http\Controllers\Api\KategoriController;
use App\Http\Controllers\Api\LokasiController;
use App\Http\Controllers\Api\StokController;

Route::post('/login', [AuthController::class, 'login'])->name('api.login');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user'])->name('api.user');
    Route::post('/logout', [AuthController::class, 'logout'])->name('api.logout');

    Route::get('/barang', [BarangController::class, 'index'])->name('api.barang.index');
    Route::get('/kategori', [KategoriController::class, 'index'])->name('api.kategori.index');
    Route::get('/lokasi', [LokasiController::class, 'index'])->name('api.lokasi.index');

    Route::post('/barang/{barang}/stock-in', [StokController::class, 'stockIn'])->name('api.barang.stock-in');
    Route::post('/barang/{barang}/stock-out', [StokController::class, 'stockOut'])->name('api.barang.stock-out');
});

