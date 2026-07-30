<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('csms_pjos', function (Blueprint $table) {
            $table->string('competence')->nullable()->after('number_pjo');
            $table->string('cert_number')->nullable()->after('competence');
            $table->date('cert_expiry')->nullable()->after('cert_number');
        });
    }

    public function down(): void
    {
        Schema::table('csms_pjos', function (Blueprint $table) {
            $table->dropColumn(['competence', 'cert_number', 'cert_expiry']);
        });
    }
};
