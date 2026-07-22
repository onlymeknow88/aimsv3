<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('csms_master_data_checklists', function (Blueprint $table) {
            if (!Schema::hasColumn('csms_master_data_checklists', 'crtiteria')) {
                $table->text('crtiteria')->nullable();
            }
            if (!Schema::hasColumn('csms_master_data_checklists', 'note')) {
                $table->text('note')->nullable();
            }
            $table->string('sub_point')->nullable()->change();
            $table->string('legal_base')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('csms_master_data_checklists', function (Blueprint $table) {
            $table->dropColumn(['crtiteria', 'note']);
        });
    }
};
