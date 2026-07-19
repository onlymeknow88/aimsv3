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
        if (!Schema::hasTable('ptw_document_attachments')) {
            Schema::create('ptw_document_attachments', function (Blueprint $table) {
                $table->uuid('id')->primary()->unique();
                $table->foreignUuid('ptw_document_id')
                    ->references('id')
                    ->on('ptw_documents')
                    ->cascadeOnDelete();
                $table->string('file_name');
                $table->string('file_path');
                $table->bigInteger('file_size');
                $table->string('mime_type');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('ptw_document_people')) {
            Schema::create('ptw_document_people', function (Blueprint $table) {
                $table->uuid('id')->primary()->unique();
                $table->foreignUuid('ptw_document_id')
                    ->references('id')
                    ->on('ptw_documents')
                    ->cascadeOnDelete();
                $table->uuid('user_id')->nullable();
                $table->string('email');
                $table->string('role')->nullable();
                $table->string('status')->default('active');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('ptw_document_activities')) {
            Schema::create('ptw_document_activities', function (Blueprint $table) {
                $table->uuid('id')->primary()->unique();
                $table->foreignUuid('ptw_document_id')
                    ->references('id')
                    ->on('ptw_documents')
                    ->cascadeOnDelete();
                $table->uuid('user_id')->nullable();
                $table->string('activity');
                $table->text('notes')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ptw_document_activities');
        Schema::dropIfExists('ptw_document_people');
        Schema::dropIfExists('ptw_document_attachments');
    }
};
