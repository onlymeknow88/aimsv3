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
        Schema::table('ptw_documents', function (Blueprint $table) {
            if (!Schema::hasColumn('ptw_documents', 'company_id')) {
                $table->uuid('company_id')->nullable()->after('department_id');
            }
            if (!Schema::hasColumn('ptw_documents', 'area_manager_id')) {
                $table->uuid('area_manager_id')->nullable()->after('user_id');
            }
            if (!Schema::hasColumn('ptw_documents', 'inactive_at')) {
                $table->timestamp('inactive_at')->nullable()->after('doc_created');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ptw_documents', function (Blueprint $table) {
            if (Schema::hasColumn('ptw_documents', 'company_id')) {
                $table->dropColumn('company_id');
            }
            if (Schema::hasColumn('ptw_documents', 'area_manager_id')) {
                $table->dropColumn('area_manager_id');
            }
            if (Schema::hasColumn('ptw_documents', 'inactive_at')) {
                $table->dropColumn('inactive_at');
            }
        });
    }
};
