<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Kategori;

class KategoriController extends Controller
{
    public function index()
    {
        // Semua kategori
        $kategori = Kategori::all();

        return inertia('kategori/index', [
            'kategori' => $kategori,
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
}
