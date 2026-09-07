<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Rename tabel legacy aims (singular) ke plural bila ada
        if (Schema::hasTable('pica_auditor') && !Schema::hasTable('pica_auditors')) {
            Schema::rename('pica_auditor', 'pica_auditors');
        }
        if (!Schema::hasTable('pica_auditors')) {
            Schema::create('pica_auditors', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('pica_id');
                $table->uuid('user_id')->nullable();
                $table->string('name')->nullable();
                $table->timestamps();

                $table->foreign('pica_id')->references('id')->on('pica_documents')->cascadeOnDelete()->cascadeOnUpdate();
                $table->foreign('user_id')->references('id')->on('users')->nullOnDelete()->cascadeOnUpdate();
                $table->index(['pica_id']);
            });
        } else {
            // Lengkapi kolom user_id bila hasil rename dari tabel lama
            if (!Schema::hasColumn('pica_auditors', 'user_id')) {
                Schema::table('pica_auditors', function (Blueprint $table) {
                    $table->uuid('user_id')->nullable()->after('pica_id');
                });
            }
        }

        // Migrasi data lama: pica_documents.auditor (string) → pica_auditors (multi)
        if (Schema::hasColumn('pica_documents', 'auditor')) {
            $docs = \Illuminate\Support\Facades\DB::table('pica_documents')->whereNotNull('auditor')->where('auditor', '!=', '')->get(['id', 'auditor']);
            foreach ($docs as $doc) {
                $exists = \Illuminate\Support\Facades\DB::table('pica_auditors')->where('pica_id', $doc->id)->exists();
                if (!$exists) {
                    $user = \Illuminate\Support\Facades\DB::table('users')->where('name', $doc->auditor)->orWhere('email', $doc->auditor)->first();
                    \Illuminate\Support\Facades\DB::table('pica_auditors')->insert([
                        'id' => (string) \Illuminate\Support\Str::uuid(),
                        'pica_id' => $doc->id,
                        'user_id' => $user->id ?? null,
                        'name' => $user->name ?? $doc->auditor,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }

        // Best-effort: lengkapi user_id yang masih null berdasarkan nama
        foreach (\Illuminate\Support\Facades\DB::table('pica_auditors')->whereNull('user_id')->whereNotNull('name')->get(['id', 'name']) as $row) {
            $user = \Illuminate\Support\Facades\DB::table('users')->where('name', $row->name)->orWhere('email', $row->name)->first();
            if ($user) {
                \Illuminate\Support\Facades\DB::table('pica_auditors')->where('id', $row->id)->update(['user_id' => $user->id, 'name' => $user->name]);
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('pica_auditors');
    }
};
