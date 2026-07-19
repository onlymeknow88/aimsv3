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
            if (Schema::hasColumn('jsa_document_activities', 'activity')) {
                $table->dropColumn('activity');
            }
            if (!Schema::hasColumn('jsa_document_activities', 'status_document')) {
                $table->string('status_document')->nullable()->after('user_id');
            }
            if (!Schema::hasColumn('jsa_document_activities', 'description')) {
                $table->text('description')->nullable()->after('status_document');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jsa_document_activities', function (Blueprint $table) {
            if (!Schema::hasColumn('jsa_document_activities', 'activity')) {
                $table->text('activity')->nullable();
            }
            if (Schema::hasColumn('jsa_document_activities', 'status_document')) {
                $table->dropColumn('status_document');
            }
            if (Schema::hasColumn('jsa_document_activities', 'description')) {
                $table->dropColumn('description');
            }
        });
    }
};
