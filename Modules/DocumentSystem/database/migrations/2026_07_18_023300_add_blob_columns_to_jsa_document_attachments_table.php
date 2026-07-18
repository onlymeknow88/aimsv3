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
        Schema::table('jsa_document_attachments', function (Blueprint $table) {
            if (!Schema::hasColumn('jsa_document_attachments', 'blob_url')) {
                $table->text('blob_url')->nullable()->after('file_path');
            }
            if (!Schema::hasColumn('jsa_document_attachments', 'blob_respon')) {
                $table->longText('blob_respon')->nullable()->after('blob_url');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jsa_document_attachments', function (Blueprint $table) {
            $table->dropColumn(['blob_url', 'blob_respon']);
        });
    }
};
