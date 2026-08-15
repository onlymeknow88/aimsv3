<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dashboard_safety_performance', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->nullable();
            $table->string('visible')->default('true');
            $table->date('month');
            $table->decimal('aifr',  10, 4)->nullable()->comment('All Injury Frequency Rate');
            $table->decimal('ainfr', 10, 4)->nullable()->comment('All Injury Near-Miss Frequency Rate');
            $table->decimal('lti_fr', 10, 4)->nullable()->comment('Lost Time Injury Frequency Rate');
            $table->decimal('lti_sr', 10, 4)->nullable()->comment('Lost Time Injury Severity Rate');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dashboard_safety_performance');
    }
};
