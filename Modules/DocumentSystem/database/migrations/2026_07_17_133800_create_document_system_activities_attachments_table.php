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
        Schema::create('document_system_activities_attachments', function (Blueprint $table) {
            $table->uuid('id')->primary()->unique();
            $table->foreignUuid('activity_id')
                ->references('id')
                ->on('document_system_activities')
                ->cascadeOnDelete();
            $table->string('path');
            $table->float('file_size');
            $table->string('file_type', 30);
            $table->string('name');
            $table->text('blob_url')->nullable();
            $table->longText('blob_response')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_system_activities_attachments');
    }
};
