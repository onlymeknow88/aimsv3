<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dashboard_health_performance', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->nullable();
            $table->string('visible')->default('true');
            $table->date('month');
            $table->decimal('rkk',  10, 4)->nullable()->comment('Rencana Kerja K3');
            $table->decimal('cmr',  10, 4)->nullable()->comment('Case Medical Rate');
            $table->decimal('mmr',  10, 4)->nullable()->comment('Man-hours Medical Rate');
            $table->decimal('ssr',  10, 4)->nullable()->comment('Severity Rate');
            $table->decimal('asr',  10, 4)->nullable()->comment('Average Severity Rate');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dashboard_health_performance');
    }
};
