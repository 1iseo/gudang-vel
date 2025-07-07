<?php

use App\Http\Controllers\BarangController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\StokController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::controller(BarangController::class)->group(function() {
    Route::get('/barang', 'index')->name('barang.index');
    // Route::get('/barang/create', 'create')->name('barang.create');
    Route::post('/barang', 'store')->name('barang.store');
    // Route::get('/barang/{barang}', 'show')->name('barang.show');
    // Route::get('/barang/{barang}/edit', 'edit')->name('barang.edit');
    Route::put('/barang/{barang}', 'update')->name('barang.update');
    Route::delete('/barang/{barang}', 'destroy')->name('barang.destroy');
});

Route::controller(StokController::class)->group(function() {
    Route::get('/riwayat', 'index')->name('riwayat.index');
    Route::get('/riwayat/{barang}', 'history')->name('barang.history');
    Route::post('/barang/{barang}/stock-in', 'stockIn')->name('barang.stock-in');
    Route::post('/barang/{barang}/stock-out', 'stockOut')->name('barang.stock-out');
});

Route::controller(KategoriController::class)->group(function() {
    Route::get('/kategori', 'index')->name('kategori.index');
    Route::post('/kategori', 'store')->name('kategori.store');
    Route::put('/kategori/{kategori}', 'update')->name('kategori.update');
    Route::delete('/kategori/{kategori}', 'destroy')->name('kategori.destroy');
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
