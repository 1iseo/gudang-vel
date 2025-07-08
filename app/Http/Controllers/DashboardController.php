<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Kategori;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalJenisBarang = Barang::count();
        $totalStok = Barang::sum('stok');
        $totalKategori = Kategori::count();
        $barangHampirHabis = Barang::with(['kategori', 'lokasi'])->orderBy('stok', 'asc')->take(10)->get();

        return Inertia::render('dashboard', [
            'totalJenisBarang' => $totalJenisBarang,
            'totalStok' => $totalStok,
            'totalKategori' => $totalKategori,
            'barangHampirHabis' => $barangHampirHabis,
        ]);
    }
}
