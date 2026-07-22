<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('field_leaderships', function (Blueprint $table) {
            // Apakah tindak lanjut dilakukan saat itu (node 2 di workflow)
            $table->boolean('is_immediate_action')->default(false)->after('is_area_suitable');

            // Alasan / catatan jika area tidak sesuai PJA dan dikirim ke CRS
            $table->text('pja_change_reason')->nullable()->after('is_immediate_action');

            // PJA baru setelah CRS ganti PJA
            $table->uuid('pja_id_new')->nullable()->after('pja_change_reason');

            // Timestamp untuk setiap transisi status
            $table->timestamp('submitted_at')->nullable()->after('requested');
            $table->timestamp('pja_reviewed_at')->nullable()->after('submitted_at');
            $table->timestamp('crs_approved_at')->nullable()->after('pja_reviewed_at');
            $table->timestamp('closed_at')->nullable()->after('crs_approved_at');
        });
    }

    public function down(): void
    {
        Schema::table('field_leaderships', function (Blueprint $table) {
            $table->dropColumn([
                'is_immediate_action',
                'pja_change_reason',
                'pja_id_new',
                'submitted_at',
                'pja_reviewed_at',
                'crs_approved_at',
                'closed_at',
            ]);
        });
    }
};