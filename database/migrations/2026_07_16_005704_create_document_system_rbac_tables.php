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
        Schema::create('aims_modules', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('aims_menus', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('module_id');
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();

            $table->foreign('module_id')->references('id')->on('aims_modules')->onDelete('cascade');
        });

        Schema::create('aims_roles', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('module_id');
            $table->string('name');
            $table->string('slug');
            $table->boolean('is_system')->default(false);
            $table->timestamps();

            $table->foreign('module_id')->references('id')->on('aims_modules')->onDelete('cascade');
        });

        Schema::create('aims_permissions', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('role_id');
            $table->unsignedInteger('menu_id');
            $table->boolean('can_view')->default(false);
            $table->boolean('can_create')->default(false);
            $table->boolean('can_edit')->default(false);
            $table->boolean('can_delete')->default(false);
            $table->boolean('can_approval')->default(false);
            $table->timestamps();

            $table->foreign('role_id')->references('id')->on('aims_roles')->onDelete('cascade');
            $table->foreign('menu_id')->references('id')->on('aims_menus')->onDelete('cascade');
        });

        Schema::create('aims_user_roles', function (Blueprint $table) {
            $table->uuid('user_id');
            $table->unsignedInteger('role_id');
            $table->primary(['user_id', 'role_id']);

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('role_id')->references('id')->on('aims_roles')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('aims_user_roles');
        Schema::dropIfExists('aims_permissions');
        Schema::dropIfExists('aims_roles');
        Schema::dropIfExists('aims_menus');
        Schema::dropIfExists('aims_modules');
    }
};
