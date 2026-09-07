<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('pica_documents')) {
            // Hapus duplikat sebelum tambah unique (keep earliest)
            $dups = DB::select("SELECT source, source_id, COUNT(*) c FROM pica_documents WHERE source='Field Leadership' GROUP BY source, source_id HAVING c > 1");
            foreach ($dups as $d) {
                $ids = DB::table('pica_documents')->where('source', $d->source)->where('source_id', $d->source_id)->orderBy('created_at')->pluck('id')->toArray();
                array_shift($ids); // keep first
                if (!empty($ids)) DB::table('pica_documents')->whereIn('id', $ids)->delete();
            }

            if (!Schema::hasIndex('pica_documents', 'pica_source_source_id_unique')) {
                Schema::table('pica_documents', function (Blueprint $table) {
                    $table->unique(['source', 'source_id'], 'pica_source_source_id_unique');
                });
            }
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('pica_documents') && Schema::hasIndex('pica_documents', 'pica_source_source_id_unique')) {
            Schema::table('pica_documents', function (Blueprint $table) {
                $table->dropUnique('pica_source_source_id_unique');
            });
        }
    }
};
