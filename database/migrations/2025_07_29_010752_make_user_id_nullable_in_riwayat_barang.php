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
        // Schema::table('riwayat_barang', function (Blueprint $table) {
        //     // Drop the existing foreign key constraint
        //     $table->dropConstrainedForeignId('user_id');
            
        //     // Add the user_id column back as nullable with nullOnDelete
        //     $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Schema::table('riwayat_barang', function (Blueprint $table) {
        //     // Drop the nullable foreign key
        //     $table->dropConstrainedForeignId('user_id');
            
        //     // Restore the original non-nullable foreign key with cascadeOnDelete
        //     $table->foreignId('user_id')->constrained()->cascadeOnDelete();
        // });
    }
};