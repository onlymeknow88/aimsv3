<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pica_documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('identity_id')->nullable()->unique();
            $table->string('source')->nullable();
            $table->uuid('source_id')->nullable();
            $table->string('type')->nullable();
            $table->date('date')->nullable();
            $table->uuid('ccow_id')->nullable();
            $table->uuid('company_id')->nullable();
            $table->uuid('section_id')->nullable();
            $table->uuid('location_id')->nullable();
            $table->string('location_detail')->nullable();
            $table->string('company_detail')->nullable();
            $table->uuid('pja_id')->nullable();
            $table->uuid('pjo_id')->nullable();
            $table->string('auditor')->nullable();
            $table->text('non_compliance')->nullable();
            $table->text('non_compliance_root_cause')->nullable();
            $table->text('corrective_action')->nullable();
            $table->date('target_settlement_date')->nullable();
            $table->date('settlement_date')->nullable();
            $table->string('remarks')->nullable();
            $table->string('requested')->nullable();
            $table->string('published')->nullable();
            $table->string('status')->nullable();
            $table->uuid('created_by')->nullable();
            $table->timestamps();

            $table->foreign('ccow_id')->references('id')->on('companies')
                ->nullOnDelete()->cascadeOnUpdate();
            $table->foreign('company_id')->references('id')->on('companies')
                ->nullOnDelete()->cascadeOnUpdate();
            $table->foreign('section_id')->references('id')->on('sections')
                ->nullOnDelete()->cascadeOnUpdate();
            $table->foreign('location_id')->references('id')->on('area_locations')
                ->nullOnDelete()->cascadeOnUpdate();
            $table->foreign('created_by')->references('id')->on('users')
                ->nullOnDelete()->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pica_documents');
    }
};