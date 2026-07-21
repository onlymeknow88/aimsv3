<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'google2fa_secret')) {
                $table->text('google2fa_secret')->nullable()->after('password');
            }
            if (!Schema::hasColumn('users', 'google2fa_enabled')) {
                $table->boolean('google2fa_enabled')->default(false)->after('google2fa_secret');
            }
            if (!Schema::hasColumn('users', 'email_otp')) {
                $table->string('email_otp', 6)->nullable()->after('google2fa_enabled');
            }
            if (!Schema::hasColumn('users', 'email_otp_expires_at')) {
                $table->timestamp('email_otp_expires_at')->nullable()->after('email_otp');
            }
            if (!Schema::hasColumn('users', 'two_factor_recovery_codes')) {
                $table->text('two_factor_recovery_codes')->nullable()->after('email_otp_expires_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumnIfExists('google2fa_secret');
            $table->dropColumnIfExists('google2fa_enabled');
            $table->dropColumnIfExists('email_otp');
            $table->dropColumnIfExists('email_otp_expires_at');
            $table->dropColumnIfExists('two_factor_recovery_codes');
        });
    }
};
