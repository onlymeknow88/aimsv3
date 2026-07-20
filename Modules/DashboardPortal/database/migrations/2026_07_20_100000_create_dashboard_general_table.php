<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('dashboard_general', function (Blueprint $table) {
            $table->uuid('id')->primary(); // matching aimsv2 UUID format
            $table->uuid('user_id')->nullable();

            // Project to Date (in Days / Hari)
            $table->integer('project_to_date')->nullable();
            $table->string('project_to_date_mark')->nullable(); // 'UP' or 'DOWN'

            // Manhours (in Hours / Jam)
            $table->integer('manhours')->nullable();
            $table->string('manhours_mark')->nullable(); // 'UP' or 'DOWN'

            // Day After Last LTI (in Days / Hari)
            $table->integer('day_after_last_lti')->nullable();
            $table->string('day_after_last_lti_mark')->nullable(); // 'UP' or 'DOWN'

            // Manpower (in People / Orang)
            $table->integer('manpower')->nullable();
            $table->string('manpower_mark')->nullable(); // 'UP' or 'DOWN'

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dashboard_general');
    }
};