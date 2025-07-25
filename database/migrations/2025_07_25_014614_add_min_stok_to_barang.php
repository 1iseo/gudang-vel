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
        Schema::table('barang', function (Blueprint $table) {
            // min_stok merupakan batas bawah stok barang sebelum dianggap hampir habis
            // dan perlu ditampilkan di dashboard
            // 0 berarti tidak ada batasan minimum
            $table->integer('min_stok')->default(0)->after('stok');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('barang', function (Blueprint $table) {
            $table->dropColumn('min_stok');
        });
    }
};
