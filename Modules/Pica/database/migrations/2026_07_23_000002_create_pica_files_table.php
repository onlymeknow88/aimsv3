<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pica_files', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('pica_id')->nullable();
            $table->string('file')->nullable();
            $table->string('type')->nullable();
            $table->string('size')->nullable();
            $table->text('blob_url')->nullable();
            $table->longText('blob_response')->nullable();
            $table->timestamps();

            $table->foreign('pica_id')->references('id')->on('pica_documents')
                ->nullOnDelete()->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pica_files');
    }
};