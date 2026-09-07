<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Parity kolom aims (create_csms_letters_table 2023_10_18):
     * letter_number, ccow_id, ktt_id, date, date_inactive, description.
     */
    public function up(): void
    {
        Schema::table('csms_letters', function (Blueprint $table) {
            $table->string('letter_number')->nullable()->after('id');
            $table->uuid('ccow_id')->nullable()->after('title');
            $table->uuid('ktt_id')->nullable()->after('ccow_id');
            $table->date('date')->nullable()->after('ktt_id');
            $table->date('date_inactive')->nullable()->after('date');
            $table->text('description')->nullable()->after('date_inactive');

            $table->foreign('ccow_id')->references('id')->on('companies')
                ->nullOnDelete()->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::table('csms_letters', function (Blueprint $table) {
            $table->dropForeign(['ccow_id']);
            $table->dropColumn(['letter_number', 'ccow_id', 'ktt_id', 'date', 'date_inactive', 'description']);
        });
    }
};
