<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // csms_master_data_checklists
        Schema::create('csms_master_data_checklists', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('point');
            $table->string('sub_point');
            $table->string('criteria');
            $table->string('legal_base');
            $table->integer('ordinal_number')->nullable();
            $table->timestamps();
        });

        // csms_checklists
        Schema::create('csms_checklists', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('bidding_id');
            $table->uuid('question_id');
            $table->string('value')->nullable();
            $table->text('comment')->nullable();
            $table->integer('ordinal_number')->nullable();
            $table->foreign('bidding_id')->references('id')->on('biddings')
                ->cascadeOnDelete()->cascadeOnUpdate();
        });

        // csms_checklist_attachments
        Schema::create('csms_checklist_attachments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('checklist_id');
            $table->string('file');
            $table->text('blob_url')->nullable();
            $table->longText('blob_response')->nullable();
            $table->string('name');
            $table->string('type');
            $table->string('size')->nullable();
            $table->timestamps();
            $table->foreign('checklist_id')->references('id')->on('csms_checklists')
                ->cascadeOnDelete()->cascadeOnUpdate();
        });

        // csms_pjos
        Schema::create('csms_pjos', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id')->nullable();
            $table->string('criteria')->nullable();
            $table->uuid('ccow_id')->nullable();
            $table->string('submission')->nullable();
            $table->string('number_pjo')->nullable();
            $table->string('name')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->date('date_submission')->nullable();
            $table->date('date_approved')->nullable();
            $table->string('comment')->nullable();
            $table->string('status')->nullable();
            $table->string('published')->nullable();
            $table->string('requested')->nullable();
            $table->uuid('created_by')->nullable();
            $table->timestamps();
            $table->foreign('company_id')->references('id')->on('companies')
                ->nullOnDelete()->cascadeOnUpdate();
        });

        // csms_pjo_files
        Schema::create('csms_pjo_files', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('pjo_id');
            $table->string('file');
            $table->text('blob_url')->nullable();
            $table->longText('blob_response')->nullable();
            $table->string('name');
            $table->string('size')->nullable();
            $table->timestamps();
            $table->foreign('pjo_id')->references('id')->on('csms_pjos')
                ->cascadeOnDelete()->cascadeOnUpdate();
        });

        // csms_memo_ktts
        Schema::create('csms_memo_ktts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('ccow_id')->nullable();
            $table->uuid('ktt_id')->nullable();
            $table->string('memo_number');
            $table->string('status');
            $table->timestamps();
            $table->foreign('ccow_id')->references('id')->on('companies')
                ->nullOnDelete()->cascadeOnUpdate();
        });

        // csms_memo_ktt_files
        Schema::create('csms_memo_ktt_files', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('memo_id');
            $table->string('file');
            $table->text('blob_url')->nullable();
            $table->longText('blob_response')->nullable();
            $table->string('name');
            $table->string('size')->nullable();
            $table->timestamps();
            $table->foreign('memo_id')->references('id')->on('csms_memo_ktts')
                ->cascadeOnDelete()->cascadeOnUpdate();
        });

        // csms_letters
        Schema::create('csms_letters', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->string('status');
            $table->timestamps();
        });

        // csms_letter_files
        Schema::create('csms_letter_files', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('letter_id');
            $table->string('file');
            $table->text('blob_url')->nullable();
            $table->longText('blob_response')->nullable();
            $table->string('name');
            $table->string('size')->nullable();
            $table->timestamps();
            $table->foreign('letter_id')->references('id')->on('csms_letters')
                ->cascadeOnDelete()->cascadeOnUpdate();
        });

        // csms_dictionaries
        Schema::create('csms_dictionaries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('term');
            $table->text('definition');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('csms_dictionaries');
        Schema::dropIfExists('csms_letter_files');
        Schema::dropIfExists('csms_letters');
        Schema::dropIfExists('csms_memo_ktt_files');
        Schema::dropIfExists('csms_memo_ktts');
        Schema::dropIfExists('csms_pjo_files');
        Schema::dropIfExists('csms_pjos');
        Schema::dropIfExists('csms_checklist_attachments');
        Schema::dropIfExists('csms_checklists');
        Schema::dropIfExists('csms_master_data_checklists');
    }
};
