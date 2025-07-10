<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BarangResource;
use App\Models\Barang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StokController extends Controller
{
    /**
     * Handle incoming stock for a specific item.
     *
     * @param Request $request
     * @param Barang $barang
     * @return BarangResource
     */
    public function stockIn(Request $request, Barang $barang)
    {
        $validated = $request->validate([
            'jumlah' => 'required|integer|min:1',
            'keterangan' => 'nullable|string|max:255',
        ]);

        DB::transaction(function () use ($barang, $validated, $request) {
            $barang->stok += $validated['jumlah'];
            $barang->save();

            $barang->riwayat()->create([
                'user_id' => $request->user()->id,
                'tipe' => 'in',
                'jumlah' => $validated['jumlah'],
                'keterangan' => $validated['keterangan'] ?? 'Stok masuk via API',
            ]);
        });

        return new BarangResource($barang->fresh(['kategori', 'lokasi']));
    }

    /**
     * Handle outgoing stock for a specific item.
     *
     * @param Request $request
     * @param Barang $barang
     * @return BarangResource
     */
    public function stockOut(Request $request, Barang $barang)
    {
        $validated = $request->validate([
            'jumlah' => 'required|integer|min:1',
            'keterangan' => 'nullable|string|max:255',
        ]);

        if ($barang->stok < $validated['jumlah']) {
            throw ValidationException::withMessages([
                'jumlah' => 'Stok tidak mencukupi. Stok saat ini: ' . $barang->stok,
            ]);
        }

        DB::transaction(function () use ($barang, $validated, $request) {
            $barang->stok -= $validated['jumlah'];
            $barang->save();

            $barang->riwayat()->create([
                'user_id' => $request->user()->id,
                'tipe' => 'out',
                'jumlah' => $validated['jumlah'],
                'keterangan' => $validated['keterangan'] ?? 'Stok keluar via API',
            ]);
        });

        return new BarangResource($barang->fresh(['kategori', 'lokasi']));
    }
}