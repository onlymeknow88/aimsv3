<?php

namespace Modules\Ko\Entities;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KoIssueReportAttachment extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'ko_issue_report_attachments';

    protected $fillable = [
        'ko_issue_report_id', 'attachment', 'blob_url', 'blob_response',
        'size', 'name', 'type',
    ];

    public function koIssueReport(): BelongsTo
    {
        return $this->belongsTo(KoIssueReport::class, 'ko_issue_report_id');
    }
}
