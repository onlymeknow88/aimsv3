<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * microsoft_token menampung JWT access token Azure (~2,5 KB) sehingga
     * varchar(255) tidak cukup. azure_tenant_id menampung UUID tenant
     * (string) sehingga bigint tidak cocok.
     * ALTER mentah agar tidak butuh doctrine/dbal.
     */
    public function up(): void
    {
        DB::statement('ALTER TABLE `users` MODIFY `microsoft_token` TEXT NULL');
        DB::statement('ALTER TABLE `users` MODIFY `azure_tenant_id` VARCHAR(255) NULL');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE `users` MODIFY `microsoft_token` VARCHAR(255) NULL');
        DB::statement('ALTER TABLE `users` MODIFY `azure_tenant_id` BIGINT UNSIGNED NULL');
    }
};
