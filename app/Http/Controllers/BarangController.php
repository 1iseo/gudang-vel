<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Kategori;
use App\Models\Lokasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

        $query->when($request->lokasi, function ($query, $namaLokasi) {
            $query->whereHas('lokasi', function ($q) use ($namaLokasi) {
                $q->where('nama', $namaLokasi);
            });
        });

        // Ambil hasil setelah filter dengan paginasi
        $list_barang = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();
        $kategoriOptions = Kategori::all(['id', 'nama']);
        $lokasiOptions = Lokasi::all(['id', 'nama']);

        return Inertia::render('barang/index', [
            'list_barang' => $list_barang,
            'filters' => $request->only(['search', 'kategori', 'lokasi']),
            'kategoriOptions' => $kategoriOptions,
            'lokasiOptions' => $lokasiOptions,
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
            'nama' => 'required|string|max:255',
            'kategori_id' => 'required|exists:kategori,id',
            'lokasi_id' => 'nullable|exists:lokasi,id',
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

        DB::transaction(function () use ($validated, $imagePath, $request) {
            $barang = Barang::create([
                'nama' => $validated['nama'],
                'stok' => $validated['stok'] ?? 0,
                'lokasi_id' => $validated['lokasi_id'],
                'kategori_id' => $validated['kategori_id'],
                'image_path' => $imagePath,
            ]);

            if ($barang->stok > 0) {
                $barang->riwayat()->create([
                    'user_id' => $request->user()->id,
                    'tipe' => 'in',
                    'jumlah' => $barang->stok,
                    'keterangan' => 'Stok awal',
                ]);
            }
        });

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

    public function update(Request $request, Barang $barang)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'kode' => 'required|string|max:255|unique:barang,kode,' . $barang->id,
            'kategori_id' => 'required|exists:kategori,id',
            'lokasi_id' => 'nullable|exists:lokasi,id',
            'stok' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $barang->fill($request->except('image'));

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('barang-images'), $filename);
            $barang->image_path = 'barang-images/' . $filename;
        }

        $barang->save();

        return redirect()->route('barang.index')->with('message', 'Barang berhasil diperbarui.');
    }

    public function destroy(Barang $barang)
    {
        // Hapus gambar dari folder public jika ada
        if ($barang->image_path && file_exists(public_path($barang->image_path))) {
            unlink(public_path($barang->image_path));
        }

        $barang->delete();

        return redirect()->route('barang.index')->with('message', 'Barang berhasil dihapus.');
    }
}
