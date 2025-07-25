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
    protected $fillable = ['kode', 'nama', 'stok', 'min_stok', 'lokasi_id', 'kategori_id', 'image_path'];
    protected $with = ['kategori', 'lokasi'];

    protected static function boot()
    {
        parent::boot();

        static::created(function (Barang $barang) {
            // Generate kode hanya jika belum ada.
            // Ini mencegah penimpaan kode jika diatur secara manual (misalnya dari seeder).
            if (empty($barang->kode)) {
                // $sqids = new Sqids(minLength: 8);
                // $barang->kode = $sqids->encode([$barang->id]);

                $barang->kode = 'BRG-' . str_pad($barang->id, 5, '0', STR_PAD_LEFT);
                // Menggunakan saveQueitly untuk menghindari memicu event update lainnya.
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


