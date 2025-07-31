<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lokasi;
use Inertia\Inertia;


class LokasiController extends Controller
{
    public function index()
    {
        return Inertia::render('lokasi/index', [
            'lokasiList' => Lokasi::withCount('barang')->latest()->paginate(10)
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255|unique:lokasi,nama',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);


        $lokasi = Lokasi::create([
            'nama' => $request->input('nama'),
            'latitude' => $request->input('latitude'),
            'longitude' => $request->input('longitude'),
        ]);

        return redirect()->route('lokasi.index')->with('success', 'Lokasi berhasil ditambahkan.');
    }

    public function update(Request $request, Lokasi $lokasi)
    {
        $request->validate([
            'nama' => 'required|string|max:255|unique:lokasi,nama,' . $lokasi->id,
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);
        $lokasi->update($request->only('nama', 'latitude', 'longitude'));
        return redirect()->route('lokasi.index')->with('message', 'Lokasi berhasil diperbarui.');
    }

    public function destroy(Lokasi $lokasi)
    {
        // Jangan hapus lokasi default (id 1)
        if ($lokasi->id === 1) {
            return back()->withErrors(['error' => 'Lokasi default tidak dapat dihapus.']);
        }

        $lokasi->delete();
        return redirect()->route('lokasi.index')->with('message', 'Lokasi berhasil dihapus.');
    }
}
