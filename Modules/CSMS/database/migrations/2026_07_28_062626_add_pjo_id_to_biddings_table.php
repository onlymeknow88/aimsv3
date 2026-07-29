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
        Schema::table('biddings', function (Blueprint $table) {
            $table->uuid('pjo_id')->nullable()->after('company_id');
            $table->foreign('pjo_id')->references('id')->on('csms_pjos')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('biddings', function (Blueprint $table) {
            $table->dropForeign(['pjo_id']);
            $table->dropColumn('pjo_id');
        });
    }
};
