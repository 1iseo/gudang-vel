<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Sqids\Sqids;

class Barang extends Model
{
    /** @use HasFactory<\Database\Factories\BarangFactory> */
    use HasFactory;

    protected $table = 'barang';
    protected $fillable = ['kode', 'nama', 'stok', 'lokasi_id', 'kategori_id', 'image_path'];
    protected $with = ['kategori', 'lokasi'];

    protected static function boot()
    {
        parent::boot();

        static::created(function ($barang) {
            // Generate kode hanya jika belum ada.
            // Ini mencegah penimpaan kode jika diatur secara manual (misalnya dari seeder).
            if (empty($barang->kode)) {
                $sqids = new Sqids(minLength: 8);
                // Menggunakan updateQuietly untuk menghindari memicu event update lainnya.
                $barang->kode = $sqids->encode([$barang->id]);
                $barang->saveQuietly();
            }
        });
    }


    public function kategori(): BelongsTo
    {
        return $this->belongsTo(Kategori::class, 'kategori_id');
    }

    public function riwayat(): HasMany
    {
        return $this->hasMany(RiwayatBarang::class);
    }

    public function lokasi(): BelongsTo
    {
        return $this->belongsTo(Lokasi::class);
    }
}


