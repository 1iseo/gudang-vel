<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use App\Models\Barang;

use function Pest\Laravel\post;
use function Pest\Laravel\assertDatabaseHas;

uses(RefreshDatabase::class);

it('can store barang with image upload', function () {
    // Buat file gambar mock / palsu
    $fakeImage = UploadedFile::fake()->image('Test-Barang.png');

    // Kirim request POST ke route 'barang.store'
    $response = post(route('barang.store'), [
        'kode' => 'ABC123',
        'nama' => 'Barang Test',
        'stok' => 10,
        'image' => $fakeImage,
    ]);

    // Harus redirect (berhasil)
    $response->assertRedirect();

    // Cek apakah data tersimpan di database
    assertDatabaseHas('barang', [
        'kode' => 'ABC123',
        'nama' => 'Barang Test',
        'stok' => 10,
    ]);

    $barang = Barang::where('kode', 'ABC123')->first();

    // Cek apakah file disimpan di public/barang-images
    // Note: Jika habis run test ini, jangan lupa hapus file gambar yang diupload
    expect($barang)->not->toBeNull();
    expect(file_exists(public_path($barang->image_path)))->toBeTrue();
});
