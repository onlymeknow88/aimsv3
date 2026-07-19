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
        Schema::table('jsa_documents', function (Blueprint $table) {
            if (!Schema::hasColumn('jsa_documents', 'area_manager_id')) {
                $table->uuid('area_manager_id')->nullable()->after('user_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jsa_documents', function (Blueprint $table) {
            if (Schema::hasColumn('jsa_documents', 'area_manager_id')) {
                $table->dropColumn('area_manager_id');
            }
        });
    }
};
