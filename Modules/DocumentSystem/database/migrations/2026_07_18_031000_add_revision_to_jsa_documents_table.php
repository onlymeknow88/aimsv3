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
            $table->string('revision')->default('0')->after('detail_location');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jsa_documents', function (Blueprint $table) {
            $table->dropColumn('revision');
        });
    }
};
