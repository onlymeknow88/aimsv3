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
            $table->string('approved_by_crs')->nullable()->after('uncontrolled_blob_respon');
            $table->timestamp('approved_at_crs')->nullable()->after('approved_by_crs');
            $table->string('approved_by_pja')->nullable()->after('approved_at_crs');
            $table->timestamp('approved_at_pja')->nullable()->after('approved_by_pja');
        });
    }

    public function down(): void
    {
        Schema::table('document_system_documents', function (Blueprint $table) {
            $table->dropColumn(['approved_by_crs', 'approved_at_crs', 'approved_by_pja', 'approved_at_pja']);
        });
    }
};
