<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        Schema::table('users', function (Blueprint $table) {
            // Tambahkan kolom username untuk menggantikan email
            $table->string('username')->unique()->after('name')->nullable();
        });

        // Untuk user yang sudah ada, isi username berdasarkan nama
        DB::table('users')
            ->orderBy('id')
            ->each(function ($user) {
                $username = strtolower(str_replace(' ', '_', $user->name));

                DB::table('users')
                    ->where('id', $user->id)
                    ->update(['username' => $username]);
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('username');
        });
    }
};
