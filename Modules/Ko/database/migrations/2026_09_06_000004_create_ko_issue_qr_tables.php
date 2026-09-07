<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Squash migrasi aims: ko_issue_reports, ko_issue_report_attachments,
 * ko_qr_request_files (final, termasuk kolom blob).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ko_issue_reports', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('ko_proposal_id')->nullable()
                ->constrained('ko_proposals')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignUuid('ko_unit_id')->nullable()
                ->constrained('ko_units')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignId('ko_commissioning_field_id')->nullable()
                ->constrained('ko_commissioning_fields')->nullOnDelete()->cascadeOnUpdate();
            $table->string('note')->nullable();
            $table->string('attachment')->nullable();
            $table->string('hazard_code')->nullable();
            $table->string('status')->nullable();
            $table->string('returned_message')->nullable();
            $table->timestamps();
        });

        Schema::create('ko_issue_report_attachments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('ko_issue_report_id')->nullable()
                ->constrained('ko_issue_reports')->nullOnDelete()->cascadeOnUpdate();
            $table->string('attachment')->nullable();
            $table->text('blob_url')->nullable();
            $table->longText('blob_response')->nullable();
            $table->string('size')->nullable();
            $table->string('name')->nullable();
            $table->string('type')->nullable();
            $table->timestamps();
        });

        Schema::create('ko_qr_request_files', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('ko_proposal_id')->nullable()
                ->constrained('ko_proposals')->nullOnDelete()->cascadeOnUpdate();
            $table->string('attachment')->nullable();
            $table->text('blob_url')->nullable();
            $table->longText('blob_response')->nullable();
            $table->string('type')->nullable();
            $table->string('name')->nullable();
            $table->string('size')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ko_qr_request_files');
        Schema::dropIfExists('ko_issue_report_attachments');
        Schema::dropIfExists('ko_issue_reports');
    }
};
