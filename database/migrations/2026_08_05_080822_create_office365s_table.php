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
        Schema::create('office365s', function (Blueprint $table) {
            $table->id();
             $table->string('client_id');
            $table->string('tenant_id');
            $table->string('scope');
            $table->string('redirect_uri');
            $table->string('client_secret')->nullable();
            $table->longText('code')->nullable();
            $table->string('session_state')->nullable();
            $table->longText('access_token')->nullable();
            $table->longText('refresh_token')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('office365s');
    }
};
