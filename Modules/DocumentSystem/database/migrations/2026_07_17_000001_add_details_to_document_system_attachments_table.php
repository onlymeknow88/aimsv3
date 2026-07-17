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
        Schema::table('document_system_attachments', function (Blueprint $table) {
            if (Schema::hasColumn('document_system_attachments', 'file_path')) {
                $table->dropColumn('file_path');
            }

            if (!Schema::hasColumn('document_system_attachments', 'file_name')) {
                $table->string('file_name')->nullable()->after('document_id');
            }
            if (!Schema::hasColumn('document_system_attachments', 'file_type')) {
                $table->string('file_type', 15)->nullable()->after('file_name');
            }
            if (!Schema::hasColumn('document_system_attachments', 'file_size')) {
                $table->double('file_size')->nullable()->after('file_type');
            }
            if (!Schema::hasColumn('document_system_attachments', 'path')) {
                $table->string('path')->nullable()->after('file_size');
            }
            if (!Schema::hasColumn('document_system_attachments', 'blob_url')) {
                $table->text('blob_url')->nullable()->after('path');
            }
            if (!Schema::hasColumn('document_system_attachments', 'blob_respon')) {
                $table->longText('blob_respon')->nullable()->after('blob_url');
            }
            if (!Schema::hasColumn('document_system_attachments', 'status')) {
                $table->tinyInteger('status')->default(1)->after('updated_at');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('document_system_attachments', function (Blueprint $table) {
            $table->dropColumn([
                'file_name',
                'file_type',
                'file_size',
                'path',
                'blob_url',
                'blob_respon',
                'status',
            ]);
            
            if (!Schema::hasColumn('document_system_attachments', 'file_path')) {
                $table->string('file_path')->after('document_id');
            }
        });
    }
};
