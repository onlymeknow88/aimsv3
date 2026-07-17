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
        Schema::table('document_system_documents', function (Blueprint $table) {
            $table->string('module_id')->nullable()->after('mapping_id');
            $table->string('category_id')->nullable()->after('module_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('document_system_documents', function (Blueprint $table) {
            $table->dropColumn(['module_id', 'category_id']);
        });
    }
};
