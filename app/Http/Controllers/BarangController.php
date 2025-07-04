<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Kategori;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BarangController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Barang::query(); // Kita tidak perlu 'with' di sini karena sudah ada di properti model '$with'

        // Terapkan filter pencarian (ini tetap sama)
        $query->when($request->input('search'), function ($q, $search) {
            $q->where(function ($subQuery) use ($search) {
                $subQuery->where('nama', 'like', "%{$search}%")
                    ->orWhere('kode', 'like', "%{$search}%");
            });
        });

        $query->when($request->kategori, function ($query, $namaKategori) {
            $query->whereHas('kategori', function ($q) use ($namaKategori) {
                $q->where('nama', $namaKategori);
            });
        });

        // Ambil hasil setelah filter dengan paginasi
        $list_barang = $query->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        $kategoriOptions = Kategori::all(['id', 'nama']);

        return Inertia::render('barang/index', [
            'list_barang' => $list_barang,
            'filters' => $request->only(['search', 'kategori']),
            'kategoriOptions' => $kategoriOptions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
        // Jika kategori_id tidak diisi, set ke 1 (Uncategorized)
        // NOTE: Pastikan sudah seeding
        if ($request->input('kategori_id') === null) {
            $request->merge(['kategori_id' => 1]);
        }

        $validated = $request->validate([
            'kode' => 'required|string|unique:barang,kode',
            'nama' => 'required|string|max:255',
            'kategori_id' => 'required|exists:kategori,id',
            'lokasi' => 'nullable|string',
            'stok' => 'nullable|integer|min:0',
            'image' => 'nullable|image|max:2048',
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
            'kategori_id' => $validated['kategori_id'],
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
