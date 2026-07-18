<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('employees')) {
            DB::statement("ALTER TABLE `employees` MODIFY COLUMN `id_number` VARCHAR(191) NULL;");
            DB::statement("ALTER TABLE `employees` MODIFY COLUMN `address` TEXT NULL;");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('employees')) {
            DB::statement("ALTER TABLE `employees` MODIFY COLUMN `id_number` VARCHAR(191) NOT NULL;");
            DB::statement("ALTER TABLE `employees` MODIFY COLUMN `address` TEXT NOT NULL;");
        }
    }
};
