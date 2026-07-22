<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('biddings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('maker_id')->nullable();
            $table->string('criteria');
            $table->string('classification')->nullable();
            $table->uuid('ccow_id')->nullable();
            $table->uuid('company_id')->nullable();
            $table->uuid('parent_id')->nullable();
            $table->uuid('grand_parent_id')->nullable();
            $table->integer('business_entity_id')->default(1);
            $table->string('company_name');
            $table->string('address');
            $table->string('company_site');
            $table->string('license_number');
            $table->string('service_criteria');
            $table->string('person_in_charge')->nullable();
            $table->string('status');
            $table->string('requested')->nullable();
            $table->string('published')->nullable();
            $table->uuid('approved_by')->nullable();
            $table->string('ktt_name')->nullable();
            $table->json('questionnaire')->nullable();
            $table->string('risk_category')->nullable();
            $table->boolean('is_obsolate')->default(false);
            $table->string('csms_doc_number')->nullable();
            $table->date('date')->nullable();
            $table->timestamps();

            $table->foreign('maker_id')->references('id')->on('users')
                ->nullOnDelete()->cascadeOnUpdate();
            $table->foreign('ccow_id')->references('id')->on('companies')
                ->nullOnDelete()->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('biddings');
    }
};
