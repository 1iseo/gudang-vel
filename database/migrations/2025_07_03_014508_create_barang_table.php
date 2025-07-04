<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('barang', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('kode')->unique();
            $table->string('nama');
            $table->string('lokasi')->default('');
            $table->integer('stok')->default(0);

            // TODO: Verify that storing images in fs is possible in a shared hosting environment
            $table->string('image_path')->nullable(); // Optional field for storing image path
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barang');
    }
};
