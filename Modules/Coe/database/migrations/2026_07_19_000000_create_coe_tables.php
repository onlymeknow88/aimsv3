<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('coe_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('color')->nullable();
            $table->timestamps();
        });

        Schema::create('coe_events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')
                ->nullable()
                ->references('id')
                ->on('users')
                ->cascadeOnUpdate()
                ->nullOnDelete();
            $table->foreignUuid('category_id')
                ->nullable()
                ->references('id')
                ->on('coe_categories')
                ->cascadeOnUpdate()
                ->nullOnDelete();
            $table->foreignUuid('section_id')
                ->nullable()
                ->references('id')
                ->on('sections')
                ->cascadeOnUpdate()
                ->nullOnDelete();
            $table->string('title');
            $table->string('status');
            $table->longText('description')->nullable();
            $table->string('frequency')->nullable();
            $table->text('invited_emails')->nullable();
            $table->string('attachment')->nullable();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->boolean('notification_sent')->default(false);
            $table->boolean('repeat')->default(true);
            $table->boolean('must_send_email')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('coe_events', function (Blueprint $table) {
            $table->foreignUuid('related_event_id')
                ->nullable()
                ->references('id')
                ->on('coe_events')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('coe_events');
        Schema::dropIfExists('coe_categories');
    }
};
