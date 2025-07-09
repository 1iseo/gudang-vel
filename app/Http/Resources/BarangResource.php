<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BarangResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'kode' => $this->kode,
            'nama' => $this->nama,
            'stok' => $this->stok,
            'image_url' => $this->image_path ? asset($this->image_path) : null,
            'kategori' => new KategoriResource($this->whenLoaded('kategori')),
            'lokasi' => new LokasiResource($this->whenLoaded('lokasi')),
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];
    }
}