<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\BarangController;
use App\Http\Controllers\Api\V1\StokController;

Route::post('/login', [AuthController::class, 'login'])->name('api.login');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user'])->name('api.user');
    Route::post('/logout', [AuthController::class, 'logout'])->name('api.logout');

    Route::apiResource('v1/barang', BarangController::class);

    Route::post('v1/barang/{barang}/stock-in', [StokController::class, 'stockIn'])->name('api.barang.stock-in');
    Route::post('v1/barang/{barang}/stock-out', [StokController::class, 'stockOut'])->name('api.barang.stock-out');
});

