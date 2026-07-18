<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('jsa_documents', function (Blueprint $table) {
            if (!Schema::hasColumn('jsa_documents', 'created_by')) {
                $table->uuid('created_by')->nullable()->after('user_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('jsa_documents', function (Blueprint $table) {
            if (Schema::hasColumn('jsa_documents', 'created_by')) {
                $table->dropColumn('created_by');
            }
        });
    }
};
