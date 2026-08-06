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
        Schema::table('user_activity_logs', function (Blueprint $table) {
            // Kita drop index + kolom lama dan buat kolom baru agar aman dari batasan database
            $table->dropIndex('user_activity_logs_user_id_index');
            $table->dropColumn('user_id');
        });

        Schema::table('user_activity_logs', function (Blueprint $table) {
            $table->uuid('user_id')->nullable()->after('id');
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_activity_logs', function (Blueprint $table) {
            $table->dropIndex('user_activity_logs_user_id_index');
            $table->dropColumn('user_id');
        });

        Schema::table('user_activity_logs', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->after('id');
            $table->index('user_id');
        });
    }
};
