<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BarangController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $list_barang = Barang::all();
        return Inertia::render('barang/index', [
            'list_barang' => $list_barang,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode' => 'required|string|unique:barang,kode',
            'nama' => 'required|string',
            'stok' => 'required|integer|min:0',
            'lokasi' => 'required|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048', // Max 2MB
        ]);

        // Handle upload jika ada gambarnya
        $imagePath = null;
        if ($request->hasFile('image')) {
            $image = $request->file('image');

            // Buat nama file unik agar tidak tabrakan
            $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();

            // Simpan file ke folder public/barang-images
            $destinationPath = public_path('barang-images');
            $image->move($destinationPath, $filename);

            // Simpan path relatif agar bisa digunakan di frontend
            $imagePath = 'barang-images/' . $filename;
        }

        Barang::create([
            'kode' => $validated['kode'],
            'nama' => $validated['nama'],
            'stok' => $validated['stok'],
            'lokasi' => $validated['lokasi'],
            'kategori' => 'Aksesoris',
            'image_path' => $imagePath,
        ]);

        return redirect()->back()->with('success', 'Barang berhasil disimpan.');
    }


    /**
     * Display the specified resource.
     */
    public function show(Barang $barang)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Barang $barang)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Barang $barang)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Barang $barang)
    {
        //
    }
}
