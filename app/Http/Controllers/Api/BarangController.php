<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BarangResource;
use App\Models\Barang;
use Illuminate\Http\Request;

class BarangController extends Controller
{
    public function index(Request $request)
    {
        $query = Barang::query()->with(['kategori', 'lokasi']);

        if ($request->has('search') && !empty($request->input('search'))) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('nama', 'like', "%{$searchTerm}%")
                    ->orWhere('deskripsi', 'like', "%{$searchTerm}%");
            });
        }

        if ($request->has('kategori_id') && !empty($request->input('kategori_id'))) {
            $query->where('kategori_id', $request->input('kategori_id'));
        }

        if ($request->has('lokasi_id') && !empty($request->input('lokasi_id'))) {
            $query->where('lokasi_id', $request->input('lokasi_id'));
        }

        $barang = $query->latest()->paginate(10);

        return BarangResource::collection($barang);
    }
}
