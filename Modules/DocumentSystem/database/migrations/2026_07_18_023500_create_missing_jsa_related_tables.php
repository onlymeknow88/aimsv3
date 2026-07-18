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
        if (!Schema::hasTable('jsa_document_people')) {
            Schema::create('jsa_document_people', function (Blueprint $table) {
                $table->uuid('id')->primary()->unique();
                $table->foreignUuid('document_id')
                    ->references('id')
                    ->on('jsa_documents')
                    ->cascadeOnDelete();
                $table->string('email');
                $table->uuid('user_id')->nullable();
                $table->smallInteger('type')
                    ->comment('1 for internal, 2 for external')->default(1);
                $table->boolean('is_notify_email')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('jsa_document_activities')) {
            Schema::create('jsa_document_activities', function (Blueprint $table) {
                $table->uuid('id')->primary()->unique();
                $table->foreignUuid('document_id')
                    ->references('id')
                    ->on('jsa_documents')
                    ->cascadeOnDelete();
                $table->uuid('user_id')->nullable();
                $table->text('activity');
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jsa_document_people');
        Schema::dropIfExists('jsa_document_activities');
    }
};
