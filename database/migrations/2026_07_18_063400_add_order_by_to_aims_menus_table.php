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
        Schema::table('aims_menus', function (Blueprint $table) {
            if (!Schema::hasColumn('aims_menus', 'order_by')) {
                $table->integer('order_by')->default(0)->after('parent_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('aims_menus', function (Blueprint $table) {
            if (Schema::hasColumn('aims_menus', 'order_by')) {
                $table->dropColumn('order_by');
            }
        });
    }
};
