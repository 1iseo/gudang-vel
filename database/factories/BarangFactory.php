<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Barang>
 */
class BarangFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'kode' => $this->faker->unique()->bothify('BRG-###'),
            'nama' => $this->faker->words(3, true),
            'lokasi' => $this->faker->city,
            'kategori_id' => 1,
            'stok' => $this->faker->numberBetween(0, 100),
        ];
    }
}
