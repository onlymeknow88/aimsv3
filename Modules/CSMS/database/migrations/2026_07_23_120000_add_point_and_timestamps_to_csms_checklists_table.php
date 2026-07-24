<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('csms_checklists', function (Blueprint $table) {
            // point = kategori checklist: BIDDING PROCESS, PERPANJANGAN SERTIFIKASI CSMS, POST KUALIFIKASI
            // Diambil dari aims lama CsmsChecklist.point untuk keperluan dashboard stats
            $table->string('point')->nullable()->after('comment');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::table('csms_checklists', function (Blueprint $table) {
            $table->dropColumn(['point', 'created_at', 'updated_at']);
        });
    }
};
