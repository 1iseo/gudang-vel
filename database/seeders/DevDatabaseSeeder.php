<?php

namespace Database\Seeders;

use App\Models\Barang;
use App\Models\User;
use App\Models\Lokasi;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DevDatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = new User();
        $user->name = 'Admin';
        $user->email = 'admin@example.com';
        $user->password = Hash::make('admin');
        $user->save();

        $lokasi = Lokasi::create([
            'id' => 1,
            'nama' => 'Gudang Utama',
            'latitude' => -6.200000,
            'longitude' => 106.816666,
        ]);

        $lokasi = Lokasi::create([
            'id' => 2,
            'nama' => 'Gudang 2',
            'latitude' => -6.200000,
            'longitude' => 106.816666,
        ]);

        $this->call(KategoriSeeder::class);

        Barang::factory(10)->create([
            'lokasi_id' => 1, // Assuming lokasi with ID 1 exists
            'kategori_id' => 1, // Assuming kategori with ID 1 exists
        ]);

        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
