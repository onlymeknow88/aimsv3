<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Index performa untuk filter rutin modul Field Leadership
     * + unique constraint pica_documents.identity_id (anti race condition
     * generatePicaIdentityId).
     */
    public function up(): void
    {
        Schema::table('field_leaderships', function (Blueprint $table) {
            $table->index('date', 'fl_date_idx');
            $table->index('status', 'fl_status_idx');
            $table->index('type', 'fl_type_idx');
            $table->index('company_id', 'fl_company_id_idx');
        });

        Schema::table('field_leadership_risks', function (Blueprint $table) {
            $table->index('due_date', 'fl_risks_due_date_idx');
            $table->index('status', 'fl_risks_status_idx');
        });

        if (Schema::hasTable('pica_documents') && !Schema::hasIndex('pica_documents', 'pica_identity_id_unique')) {
            Schema::table('pica_documents', function (Blueprint $table) {
                $table->unique('identity_id', 'pica_identity_id_unique');
            });
        }
    }

    public function down(): void
    {
        Schema::table('field_leaderships', function (Blueprint $table) {
            $table->dropIndex('fl_date_idx');
            $table->dropIndex('fl_status_idx');
            $table->dropIndex('fl_type_idx');
            $table->dropIndex('fl_company_id_idx');
        });

        Schema::table('field_leadership_risks', function (Blueprint $table) {
            $table->dropIndex('fl_risks_due_date_idx');
            $table->dropIndex('fl_risks_status_idx');
        });

        if (Schema::hasTable('pica_documents') && Schema::hasIndex('pica_documents', 'pica_identity_id_unique')) {
            Schema::table('pica_documents', function (Blueprint $table) {
                $table->dropUnique('pica_identity_id_unique');
            });
        }
    }
};
