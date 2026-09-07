<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Squash migrasi aims Modules/KO Master Library:
 * ko_spip_categories, ko_spip_types, ko_spip_units, ko_brands.
 * Perbaikan: tanpa kolom ter-drop, tanpa typo.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ko_spip_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->integer('internal_interval_year');
            $table->integer('contractor_interval_year');
            $table->timestamps();
        });

        Schema::create('ko_spip_types', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('ko_spip_category_id')->nullable()
                ->constrained('ko_spip_categories')->nullOnDelete()->cascadeOnUpdate();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('ko_spip_units', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('ko_spip_type_id')->nullable()
                ->constrained('ko_spip_types')->nullOnDelete()->cascadeOnUpdate();
            $table->string('name');
            $table->json('attachment_field')->nullable();
            $table->timestamps();
        });

        Schema::create('ko_brands', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('ko_spip_category_id')->nullable()
                ->constrained('ko_spip_categories')->nullOnDelete()->cascadeOnUpdate();
            $table->string('name')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ko_brands');
        Schema::dropIfExists('ko_spip_units');
        Schema::dropIfExists('ko_spip_types');
        Schema::dropIfExists('ko_spip_categories');
    }
};
