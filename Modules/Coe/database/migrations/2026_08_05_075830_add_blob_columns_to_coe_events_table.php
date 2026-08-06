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
        Schema::table('coe_events', function (Blueprint $table) {
            $table->text('blob_url')->nullable()->after('attachment');
            $table->longText('blob_respon')->nullable()->after('blob_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('coe_events', function (Blueprint $table) {
            $table->dropColumn(['blob_url', 'blob_respon']);
        });
    }
};
