<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pica_activity_files', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('pica_activity_id')->nullable();
            $table->string('file');
            $table->string('type_file')->nullable(); // file extension: pdf, png, etc
            $table->string('size')->nullable();
            $table->text('blob_url')->nullable();
            $table->longText('blob_response')->nullable();
            $table->timestamps();

            $table->foreign('pica_activity_id')->references('id')->on('pica_activities')
                ->nullOnDelete()->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pica_activity_files');
    }
};