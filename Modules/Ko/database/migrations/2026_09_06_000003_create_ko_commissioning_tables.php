<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Squash migrasi aims commissioning (perbaikan typo nama tabel headers
 * ko_commisioning_headers -> ko_commissioning_headers).
 * PK headers & fields: bigint increment (seperti aims).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ko_commissioning_headers', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('ko_spip_unit_id')->nullable()
                ->constrained('ko_spip_units')->nullOnDelete()->cascadeOnUpdate();
            $table->string('number')->nullable();
            $table->string('header')->nullable();
            $table->timestamps();
        });

        Schema::create('ko_commissioning_fields', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ko_commissioning_header_id')->nullable()
                ->constrained('ko_commissioning_headers')->nullOnDelete()->cascadeOnUpdate();
            $table->string('number')->nullable();
            $table->text('question')->nullable();
            $table->string('hazard_code')->nullable();
            $table->timestamps();
        });

        Schema::create('ko_commissionings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('ko_proposal_id')->nullable()
                ->constrained('ko_proposals')->nullOnDelete()->cascadeOnUpdate();
            $table->date('date')->nullable();
            $table->date('commissioning_completion_date')->nullable();
            $table->string('smu_odo_meter')->nullable();
            $table->string('engine_status')->nullable();
            $table->date('expired_date')->nullable();
            $table->string('status')->nullable();
            $table->string('created_by')->nullable();
            $table->timestamps();
        });

        Schema::create('ko_commissioning_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('ko_commissioning_id')->nullable()
                ->constrained('ko_commissionings')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignId('ko_commissioning_field_id')->nullable()
                ->constrained('ko_commissioning_fields')->nullOnDelete()->cascadeOnUpdate();
            $table->string('condition')->nullable();
            $table->string('note')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ko_commissioning_items');
        Schema::dropIfExists('ko_commissionings');
        Schema::dropIfExists('ko_commissioning_fields');
        Schema::dropIfExists('ko_commissioning_headers');
    }
};
