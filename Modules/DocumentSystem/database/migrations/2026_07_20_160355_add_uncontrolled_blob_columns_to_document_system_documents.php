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
            $table->string('uncontrolled_blob_url', 1000)->nullable()->after('uncontrolled_file_path');
            $table->longText('uncontrolled_blob_respon')->nullable()->after('uncontrolled_blob_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('document_system_documents', function (Blueprint $table) {
            $table->dropColumn(['uncontrolled_blob_url', 'uncontrolled_blob_respon']);
        });
    }
};
