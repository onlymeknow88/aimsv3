<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('csms_picas', function (Blueprint $table) {
            $table->uuid('checklist_id')->nullable()->after('bidding_id');
            $table->string('pic')->nullable()->after('status');
            $table->date('due_date')->nullable()->after('pic');
        });
    }

    public function down(): void
    {
        Schema::table('csms_picas', function (Blueprint $table) {
            $table->dropColumn(['checklist_id', 'pic', 'due_date']);
        });
    }
};
