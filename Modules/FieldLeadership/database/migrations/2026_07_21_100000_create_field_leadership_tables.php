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
        // 1. Master Tables — Library/Reference Data
        
        Schema::create('field_leadership_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('field_leadership_types', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('field_leadership_kta_and_ttas', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code');
            $table->string('name');
            $table->string('type'); // 'Kondisi Tidak Aman' or 'Tindakan Tidak Aman'
            $table->timestamps();
        });

        Schema::create('field_leadership_potency_and_consequnces', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code');
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('field_leadership_parameters', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->integer('max_item_member')->default(0);
            $table->integer('max_item_positive_condition')->default(0);
            $table->integer('max_item_risk_condition')->default(0);
            $table->integer('max_item_corrective_action')->default(0);
            $table->timestamps();
        });

        // 2. Main Table — field_leaderships
        
        Schema::create('field_leaderships', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->date('date');
            $table->uuid('ccow_id')->nullable();
            $table->uuid('company_id')->nullable();
            $table->string('detail_company');
            $table->uuid('department_id')->nullable();
            $table->uuid('section_id')->nullable();
            $table->uuid('area_location_id')->nullable();
            $table->text('detail_location')->nullable();
            $table->uuid('pja_id'); // Penanggung Jawab Area
            $table->boolean('is_area_suitable')->default(true);
            $table->uuid('pjo_id'); // Penanggung Jawab Operasional
            $table->string('type')->nullable(); // Planned Task Observation / Take Time Talk / Hazard Report
            $table->string('personil_on_review')->nullable();
            $table->string('personil_on_review_name')->nullable();
            $table->string('non_compliance_root')->nullable();
            $table->string('job')->nullable();
            $table->bigInteger('visit_time')->nullable();
            $table->string('status'); // Open / On Review PICA / On Review PJA / On Review Approval / Overdue / Closed
            $table->string('published')->nullable();
            $table->string('requested')->nullable();
            $table->uuid('created_by');
            $table->timestamps();

            // Foreign keys dengan cascade rules
            $table->foreign('ccow_id')->references('id')->on('companies')
                ->cascadeOnUpdate()->nullOnDelete();
            $table->foreign('company_id')->references('id')->on('companies')
                ->cascadeOnUpdate()->nullOnDelete();
            $table->foreign('department_id')->references('id')->on('departments')
                ->cascadeOnUpdate()->nullOnDelete();
            $table->foreign('section_id')->references('id')->on('sections')
                ->cascadeOnUpdate()->nullOnDelete();
            $table->foreign('area_location_id')->references('id')->on('area_locations')
                ->cascadeOnUpdate()->nullOnDelete();
        });

        // 3. Child Tables — Relasi ke field_leaderships
        
        Schema::create('field_leadership_members', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('fl_id')->nullable();
            $table->string('type'); // Internal / Eksternal
            $table->uuid('employee_id');
            $table->timestamps();

            $table->foreign('fl_id')->references('id')->on('field_leaderships')
                ->cascadeOnUpdate()->cascadeOnDelete();
        });

        Schema::create('field_leadership_positives', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('fl_id')->nullable();
            $table->text('description');
            $table->timestamps();

            $table->foreign('fl_id')->references('id')->on('field_leaderships')
                ->cascadeOnUpdate()->cascadeOnDelete();
        });

        Schema::create('field_leadership_question_ptos', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('fl_id')->nullable();
            $table->string('question');
            $table->string('answer'); // Ya / Tidak / Tak Dapat Diterapkan
            $table->string('description')->nullable();
            $table->timestamps();

            $table->foreign('fl_id')->references('id')->on('field_leaderships')
                ->cascadeOnUpdate()->cascadeOnDelete();
        });

        Schema::create('field_leadership_risks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('fl_id')->nullable();
            $table->string('risk_condition');
            $table->uuid('category_id')->nullable();
            $table->uuid('type_id')->nullable();
            $table->uuid('potency_id')->nullable();
            $table->string('repair_action');
            $table->date('due_date');
            $table->string('type_action')->nullable();
            $table->string('supervisor')->nullable();
            $table->string('status')->nullable();
            $table->timestamps();

            $table->foreign('fl_id')->references('id')->on('field_leaderships')
                ->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreign('category_id')->references('id')->on('field_leadership_categories')
                ->cascadeOnUpdate()->nullOnDelete();
            $table->foreign('type_id')->references('id')->on('field_leadership_kta_and_ttas')
                ->cascadeOnUpdate()->nullOnDelete();
            $table->foreign('potency_id')->references('id')->on('field_leadership_potency_and_consequnces')
                ->cascadeOnUpdate()->nullOnDelete();
        });

        Schema::create('field_leadership_risk_files', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('fl_risk_id')->nullable();
            $table->string('file');
            $table->string('type')->nullable();
            $table->string('size')->nullable();
            $table->text('blob_url')->nullable();
            $table->longText('blob_response')->nullable();
            $table->timestamps();

            $table->foreign('fl_risk_id')->references('id')->on('field_leadership_risks')
                ->cascadeOnUpdate()->cascadeOnDelete();
        });

        Schema::create('field_leadership_activities', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('fl_id')->nullable();
            $table->string('description');
            $table->string('user_id')->nullable();
            $table->timestamps();

            $table->foreign('fl_id')->references('id')->on('field_leaderships')
                ->cascadeOnUpdate()->cascadeOnDelete();
        });

        Schema::create('field_leadership_activity_files', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('fl_activity_id')->nullable();
            $table->string('file');
            $table->text('blob_url')->nullable();
            $table->longText('blob_response')->nullable();
            $table->string('type_file');
            $table->string('size')->nullable();
            $table->timestamps();

            $table->foreign('fl_activity_id')->references('id')->on('field_leadership_activities')
                ->cascadeOnUpdate()->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('field_leadership_activity_files');
        Schema::dropIfExists('field_leadership_activities');
        Schema::dropIfExists('field_leadership_risk_files');
        Schema::dropIfExists('field_leadership_risks');
        Schema::dropIfExists('field_leadership_question_ptos');
        Schema::dropIfExists('field_leadership_positives');
        Schema::dropIfExists('field_leadership_members');
        Schema::dropIfExists('field_leaderships');
        Schema::dropIfExists('field_leadership_parameters');
        Schema::dropIfExists('field_leadership_potency_and_consequnces');
        Schema::dropIfExists('field_leadership_kta_and_ttas');
        Schema::dropIfExists('field_leadership_types');
        Schema::dropIfExists('field_leadership_categories');
    }
};