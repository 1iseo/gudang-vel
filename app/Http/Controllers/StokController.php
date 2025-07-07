<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\RiwayatBarang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StokController extends Controller
{
    public function stockIn(Request $request, Barang $barang)
    {
        $request->validate([
            'jumlah' => 'required|integer|min:1',
            'keterangan' => 'nullable|string',
        ]);

        DB::transaction(function () use ($request, $barang) {
            $barang->riwayat()->create([
                'user_id' => $request->user()->id,
                'tipe' => 'in',
                'jumlah' => $request->jumlah,
                'keterangan' => $request->keterangan,
            ]);

            $barang->increment('stok', $request->jumlah);
        });

        return redirect()->back()->with('success', 'Stok berhasil ditambahkan.');
    }

    public function stockOut(Request $request, Barang $barang)
    {
        $request->validate([
            'jumlah' => 'required|integer|min:1|max:' . $barang->stok,
            'keterangan' => 'nullable|string',
        ]);

        DB::transaction(function () use ($request, $barang) {
            $barang->riwayat()->create([
                'user_id' => $request->user()->id,
                'tipe' => 'out',
                'jumlah' => $request->jumlah,
                'keterangan' => $request->keterangan,
            ]);

            $barang->decrement('stok', $request->jumlah);
        });

        return redirect()->back()->with('success', 'Stok berhasil dikurangkan.');
    }

    public function history(Barang $barang)
    {
        return Inertia::render('riwayat/riwayat_satu', [
            'barang' => $barang,
            'riwayat' => $barang->riwayat()->with('user:id,name')->latest()->paginate(10),
        ]);
    }

    public function index()
    {
        return Inertia::render('riwayat/index', [
            'riwayat' => RiwayatBarang::with(['user:id,name', 'barang:id,nama,kode'])->latest()->paginate(10),
        ]);
    }

}
