<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('area_manager_locations', function (Blueprint $table) {
            $table->uuid('area_manager_id');
            $table->uuid('area_location_id');
            $table->primary(['area_manager_id', 'area_location_id']);
            $table->foreign('area_manager_id')->references('id')->on('area_managers')->onDelete('cascade');
            $table->foreign('area_location_id')->references('id')->on('area_locations')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('area_manager_locations');
    }
};
