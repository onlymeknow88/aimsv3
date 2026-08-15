<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dashboard_production', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->nullable();
            $table->string('visible')->default('true');
            $table->date('month')->nullable();
            $table->decimal('coal_shiping',  15, 2)->nullable();
            $table->decimal('waste_removal', 15, 2)->nullable();
            $table->decimal('coal_mining',   15, 2)->nullable();
            $table->decimal('coal_hauling',  15, 2)->nullable();
            $table->decimal('coal_barged',   15, 2)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dashboard_production');
    }
};
