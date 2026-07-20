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
        Schema::create('dashboard_slideshow', function (Blueprint $table) {
            $table->uuid('id')->primary(); // matching aimsv2 UUID format
            $table->uuid('user_id')->nullable();
            $table->string('name')->nullable();
            $table->string('visible')->nullable();
            $table->string('description')->nullable();
            $table->string('attc')->nullable();
            $table->string('url')->nullable();
            $table->string('blob_url')->nullable();
            $table->longText('blob_response')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dashboard_slideshow');
    }
};
