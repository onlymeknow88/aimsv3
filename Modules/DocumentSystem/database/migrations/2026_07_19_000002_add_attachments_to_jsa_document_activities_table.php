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
        Schema::table('jsa_document_activities', function (Blueprint $table) {
            if (!Schema::hasColumn('jsa_document_activities', 'attachments')) {
                $table->text('attachments')->nullable()->after('description');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jsa_document_activities', function (Blueprint $table) {
            if (Schema::hasColumn('jsa_document_activities', 'attachments')) {
                $table->dropColumn('attachments');
            }
        });
    }
};
