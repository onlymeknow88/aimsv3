<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Squash migrasi aims: ko_units (final, tanpa kolom brand ter-drop)
 * + ko_proposals (final) + ko_attachments.
 * Prasyarat: companies, departments, users sudah ada.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ko_units', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('ko_spip_unit_id')->nullable()
                ->constrained('ko_spip_units')->nullOnDelete()->cascadeOnUpdate();
            $table->string('call_sign');
            $table->string('identity_number')->nullable();
            $table->string('serial_number');
            $table->foreignUuid('ko_brand_id')->nullable()
                ->constrained('ko_brands')->nullOnDelete()->cascadeOnUpdate();
            $table->string('model_unit')->nullable();
            $table->year('production_year');
            $table->integer('commissioning_count')->default(0);
            $table->tinyInteger('is_revoked')->default(0);
            $table->date('revoked_date')->nullable();
            $table->date('revoke_requested_date')->nullable();
            $table->string('revoke_request_note')->nullable();
            $table->string('revoke_status')->nullable();
            $table->timestamps();
        });

        Schema::create('ko_proposals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('number');
            $table->foreignUuid('ccow_id')->nullable()
                ->constrained('companies')->nullOnDelete()->cascadeOnUpdate();
            $table->string('area');
            $table->foreignUuid('ko_unit_id')->nullable()
                ->constrained('ko_units')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignUuid('company_id')->nullable()
                ->constrained('companies')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignUuid('department_id')->nullable()
                ->constrained('departments')->nullOnDelete()->cascadeOnUpdate();
            $table->string('other_department')->nullable();
            $table->string('applicant_email');
            $table->foreignUuid('pjo_id')->nullable()
                ->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->date('internal_komisioning_schedule')->nullable();
            $table->date('next_commissioning')->nullable();
            $table->date('temporary_validity_period')->nullable();
            $table->integer('commissioning_period')->nullable();
            $table->string('status');
            $table->text('temporary_qr_reject_note')->nullable();
            $table->string('temporary_qr_status')->nullable();
            $table->text('commissioning_reject_note')->nullable();
            $table->text('proposal_reject_note')->nullable();
            $table->boolean('admin_proposal_verified')->default(false);
            $table->timestamps();
        });

        Schema::create('ko_attachments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('ko_proposal_id')->nullable()
                ->constrained('ko_proposals')->nullOnDelete()->cascadeOnUpdate();
            foreach (['stnk','nota_pajak','surat_pengantar','re_manufacture','oem','dokumen_sertifikat','inspeksi_p3k','kir','uji_pjit','pra_komisioning','setting_radio','slo','komisioning_internal','com'] as $col) {
                $table->string($col)->nullable();
            }
            $table->longText('blob_response')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ko_attachments');
        Schema::dropIfExists('ko_proposals');
        Schema::dropIfExists('ko_units');
    }
};
