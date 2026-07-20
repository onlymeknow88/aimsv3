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
        Schema::create('dashboard_news_and_update', function (Blueprint $table) {
            $table->uuid('id')->primary(); // matching aimsv2 UUID format
            $table->uuid('user_id')->nullable();
            $table->string('visible')->nullable();
            $table->string('title')->nullable();
            $table->string('slug')->nullable()->unique();
            $table->text('description')->nullable();
            $table->string('attc')->nullable();   // local attachment filename
            $table->string('url')->nullable();    // Azure blob path
            $table->string('blob_url')->nullable();      // Azure blob public URL
            $table->longText('blob_response')->nullable(); // Azure upload response
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dashboard_news_and_update');
    }
};