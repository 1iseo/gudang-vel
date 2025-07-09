<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\BarangResource;
use App\Models\Barang;
use Illuminate\Http\Request;

class BarangController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $barang = Barang::with(['kategori', 'lokasi'])->paginate(15);
        return BarangResource::collection($barang);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
    }

    /**
     * Display the specified resource.
     */
    public function show(Barang $barang)
    {
        $barang->load(['kategori', 'lokasi']);
        return new BarangResource($barang);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Barang $barang)
    {
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Barang $barang)
    {
    }
}