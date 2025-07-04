<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Kategori;
use Inertia\Inertia;


class KategoriController extends Controller
{
    public function index()
    {
        return Inertia::render('kategori/index', [
            'kategoriList' => Kategori::withCount('barang')->latest()->paginate(10)
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
        ]);

        $kategori = Kategori::create([
            'nama' => $request->input('nama'),
        ]);

        return redirect()->route('kategori.index')->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function update(Request $request, Kategori $kategori)
    {
        $request->validate(['nama' => 'required|string|max:255|unique:kategori,nama,' . $kategori->id]);
        $kategori->update($request->only('nama'));
        return redirect()->route('kategori.index')->with('message', 'Kategori berhasil diperbarui.');
    }

    public function destroy(Kategori $kategori)
    {
        // Jangan hapus kategori default (id 1)
        if ($kategori->id === 1) {
            return back()->withErrors(['error' => 'Kategori default tidak dapat dihapus.']);
        }

        $kategori->delete();
        return redirect()->route('kategori.index')->with('message', 'Kategori berhasil dihapus.');
    }
}
