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
        // 1. Classification/Taxonomy Tables
        Schema::create('document_system_modules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('index')->nullable();
            $table->string('name');
            $table->boolean('has_document_number')->default(true);
            $table->timestamps();
        });

        Schema::create('document_system_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('module_id');
            $table->string('index')->nullable();
            $table->string('name');
            $table->timestamps();

            $table->foreign('module_id')->references('id')->on('document_system_modules')->onDelete('cascade');
        });

        Schema::create('document_system_mappings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('category_id');
            $table->string('index')->nullable();
            $table->string('name');
            $table->timestamps();

            $table->foreign('category_id')->references('id')->on('document_system_categories')->onDelete('cascade');
        });

        // 2. Main Documents Table
        Schema::create('document_system_documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('department_id')->nullable();
            $table->uuid('department_code_id')->nullable();
            $table->uuid('mapping_id')->nullable();
            $table->uuid('area_manager_id')->nullable();
            $table->uuid('user_id')->nullable(); // Owner/PIC
            $table->uuid('created_by')->nullable();
            $table->uuid('related_document_id')->nullable(); // Self-relation for revisions

            $table->string('upload_type')->nullable(); // e.g. Link / File
            $table->string('document_level')->nullable(); // e.g. SOP, TS, MN, WIN, FORM
            $table->string('status')->default('2'); // default: DRAFT (2)
            $table->string('revision')->default('0');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('sop_number')->nullable();
            $table->string('sop_add_win')->nullable();
            $table->string('sop_add_form')->nullable();
            $table->string('document_number')->nullable();
            $table->string('prefix_code')->nullable();
            $table->string('file_path')->nullable();
            $table->string('uncontrolled_file_path')->nullable();
            $table->date('doc_created')->nullable();
            $table->boolean('is_obsolate')->default(false);
            $table->timestamps();

            $table->foreign('mapping_id')->references('id')->on('document_system_mappings')->onDelete('set null');
            $table->foreign('related_document_id')->references('id')->on('document_system_documents')->onDelete('set null');
        });

        // 3. Attachments
        Schema::create('document_system_attachments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('document_id');
            $table->string('file_path');
            $table->timestamps();

            $table->foreign('document_id')->references('id')->on('document_system_documents')->onDelete('cascade');
        });

        // 4. Invited Reviewers/Approvers
        Schema::create('document_system_invited_people', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('document_id');
            $table->uuid('user_id')->nullable();
            $table->string('email')->nullable();
            $table->smallInteger('status')->default(0); // 0: Pending, 1: Approved, 2: Rejected
            $table->text('note')->nullable();
            $table->timestamps();

            $table->foreign('document_id')->references('id')->on('document_system_documents')->onDelete('cascade');
        });

        // 5. Activity Log
        Schema::create('document_system_activities', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('document_id');
            $table->uuid('user_id')->nullable();
            $table->string('activity');
            $table->timestamps();

            $table->foreign('document_id')->references('id')->on('document_system_documents')->onDelete('cascade');
        });

        // 6. JSA Documents
        Schema::create('jsa_documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('department_id')->nullable();
            $table->uuid('department_code_id')->nullable();
            $table->uuid('user_id')->nullable();
            $table->smallInteger('status')->default(2); // 2: DRAFT
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('document_number')->nullable();
            $table->timestamp('doc_created')->nullable();
            $table->string('detail_location')->nullable();
            $table->uuid('parent_document')->nullable();
            $table->boolean('is_obsolate')->default(false);
            $table->timestamps();

            $table->foreign('parent_document')->references('id')->on('jsa_documents')->onDelete('set null');
        });

        // 7. JSA Attachments
        Schema::create('jsa_document_attachments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('jsa_document_id');
            $table->string('file_path');
            $table->timestamps();

            $table->foreign('jsa_document_id')->references('id')->on('jsa_documents')->onDelete('cascade');
        });

        // 8. PTW Documents
        Schema::create('ptw_documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('department_id')->nullable();
            $table->uuid('user_id')->nullable();
            $table->smallInteger('status')->default(2); // 2: INACTIVE
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('document_number')->nullable();
            $table->timestamp('doc_created')->nullable();
            $table->string('detail_location')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ptw_documents');
        Schema::dropIfExists('jsa_document_attachments');
        Schema::dropIfExists('jsa_documents');
        Schema::dropIfExists('document_system_activities');
        Schema::dropIfExists('document_system_invited_people');
        Schema::dropIfExists('document_system_attachments');
        Schema::dropIfExists('document_system_documents');
        Schema::dropIfExists('document_system_mappings');
        Schema::dropIfExists('document_system_categories');
        Schema::dropIfExists('document_system_modules');
    }
};
