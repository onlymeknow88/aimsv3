<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 1. csms_memo_ktts.status tanpa default -> direct-create gagal 1366.
     *    Controller selalu mengisi, tapi default DB wajib ada.
     * 2. Rename slug typo warisan aims: csms.post-bidding.obsolate -> obsolete
     *    (kolom is_obsolate TIDAK diubah: internal & dipakai banyak modul).
     */
    public function up(): void
    {
        if (Schema::hasTable('csms_memo_ktts') && Schema::hasColumn('csms_memo_ktts', 'status')) {
            DB::statement("ALTER TABLE `csms_memo_ktts` MODIFY `status` VARCHAR(255) NOT NULL DEFAULT 'Active'");
        }

        if (Schema::hasTable('aims_menus')) {
            DB::table('aims_menus')
                ->where('slug', 'csms.post-bidding.obsolate')
                ->update(['slug' => 'csms.post-bidding.obsolete', 'name' => 'Obsolete']);
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('aims_menus')) {
            DB::table('aims_menus')
                ->where('slug', 'csms.post-bidding.obsolete')
                ->update(['slug' => 'csms.post-bidding.obsolate', 'name' => 'Obsolate']);
        }
    }
};
