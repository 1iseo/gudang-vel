<?php

use App\Http\Controllers\BarangController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\LokasiController;
use App\Http\Controllers\StokController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->middleware('guest')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('users', \App\Http\Controllers\UserController::class);
    

    Route::controller(BarangController::class)->group(function () {
        Route::get('/barang', 'index')->name('barang.index');
        // Route::get('/barang/create', 'create')->name('barang.create');
        Route::post('/barang', 'store')->name('barang.store');
        // Route::get('/barang/{barang}', 'show')->name('barang.show');
        // Route::get('/barang/{barang}/edit', 'edit')->name('barang.edit');
        Route::put('/barang/{barang}', 'update')->name('barang.update');
        Route::delete('/barang/{barang}', 'destroy')->name('barang.destroy');
    });

    Route::controller(StokController::class)->group(function () {
        Route::get('/riwayat', 'index')->name('riwayat.index');
        Route::get('/riwayat/{barang}', 'history')->name('barang.history');
        Route::post('/barang/{barang}/stock-in', 'stockIn')->name('barang.stock-in');
        Route::post('/barang/{barang}/stock-out', 'stockOut')->name('barang.stock-out');
    });

    Route::controller(KategoriController::class)->group(function () {
        Route::get('/kategori', 'index')->name('kategori.index');
        Route::post('/kategori', 'store')->name('kategori.store');
        Route::put('/kategori/{kategori}', 'update')->name('kategori.update');
        Route::delete('/kategori/{kategori}', 'destroy')->name('kategori.destroy');
    });

    Route::controller(LokasiController::class)->group(function () {
        Route::get('/lokasi', 'index')->name('lokasi.index');
        Route::post('/lokasi', 'store')->name('lokasi.store');
        Route::put('/lokasi/{lokasi}', 'update')->name('lokasi.update');
        Route::delete('/lokasi/{lokasi}', 'destroy')->name('lokasi.destroy');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
