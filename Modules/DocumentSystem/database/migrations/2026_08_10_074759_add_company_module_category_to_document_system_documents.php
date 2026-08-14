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
            // Kolom ini ada di database tapi belum didefinisikan di migration sebelumnya
            if (!Schema::hasColumn('document_system_documents', 'company_id')) {
                $table->uuid('company_id')->nullable()->after('id');
            }
            if (!Schema::hasColumn('document_system_documents', 'module_id')) {
                $table->uuid('module_id')->nullable()->after('mapping_id');
            }
            if (!Schema::hasColumn('document_system_documents', 'category_id')) {
                $table->uuid('category_id')->nullable()->after('module_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('document_system_documents', function (Blueprint $table) {
            $table->dropColumn(['company_id', 'module_id', 'category_id']);
        });
    }
};
