<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pica_activities', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('pica_id')->nullable();
            $table->string('description');
            $table->string('user_id')->nullable(); // stored as string per aims convention
            $table->timestamps();

            $table->foreign('pica_id')->references('id')->on('pica_documents')
                ->nullOnDelete()->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pica_activities');
    }
};