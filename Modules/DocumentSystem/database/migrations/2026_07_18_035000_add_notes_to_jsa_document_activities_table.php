<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('jsa_document_activities', function (Blueprint $table) {
            if (!Schema::hasColumn('jsa_document_activities', 'notes')) {
                $table->text('notes')->nullable()->after('activity');
            }
        });
    }

    public function down(): void
    {
        Schema::table('jsa_document_activities', function (Blueprint $table) {
            if (Schema::hasColumn('jsa_document_activities', 'notes')) {
                $table->dropColumn('notes');
            }
        });
    }
};
