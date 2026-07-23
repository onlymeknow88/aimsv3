<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('csms_picas', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('bidding_id');
            $table->text('description')->nullable();
            $table->string('status')->nullable();
            $table->timestamps();

            $table->foreign('bidding_id')->references('id')->on('biddings')
                ->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('csms_picas');
    }
};
