<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dashboard_incident_notification', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->nullable();
            $table->string('slug')->nullable();
            $table->date('date')->nullable();
            $table->string('case', 500)->nullable();
            $table->string('category')->nullable();
            $table->text('description')->nullable();
            $table->string('visible')->default('true');
            $table->string('attc')->nullable();
            $table->string('url')->nullable();
            $table->string('blob_url')->nullable();
            $table->text('blob_response')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dashboard_incident_notification');
    }
};
