<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KategoriSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Tambahkan kategori default dgn id 1
        DB::table('kategori')->insert([
            ['id' => 1, 'nama' => 'Uncategorized']
        ]);
    }
}
