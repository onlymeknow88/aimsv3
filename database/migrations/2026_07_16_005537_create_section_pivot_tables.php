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
        Schema::create('section_area_locations', function (Blueprint $table) {
            $table->uuid('section_id');
            $table->uuid('area_location_id');
            $table->primary(['section_id', 'area_location_id']);
            $table->foreign('section_id')->references('id')->on('sections')->onDelete('cascade');
            $table->foreign('area_location_id')->references('id')->on('area_locations')->onDelete('cascade');
        });

        Schema::create('section_area_managers', function (Blueprint $table) {
            $table->uuid('section_id');
            $table->uuid('area_manager_id');
            $table->primary(['section_id', 'area_manager_id']);
            $table->foreign('section_id')->references('id')->on('sections')->onDelete('cascade');
            $table->foreign('area_manager_id')->references('id')->on('area_managers')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('section_area_managers');
        Schema::dropIfExists('section_area_locations');
    }
};
