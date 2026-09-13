<?php

namespace Modules\DocumentSystem\Services;

use App\Models\Company;
use App\Models\Department;
use Modules\DocumentSystem\Entities\PtwDocument;

/**
 * Business logic for PTW documents, adapted to aimsv3 structure.
 *
 * v2 concepts reused: auto numbering (PTW-{COMP}-{DEPT}-001),
 * status labels, export row mapping, inactive_at lifecycle.
 * v2 leftovers NOT carried over: DepartmentCode cascading,
 * PtwDocumentTitleRule, tmp/staging upload, ACTIVE/INACTIVE toggle
 * (v3 uses DRAFT -> PENDING_REVIEW -> ACTIVE workflow instead).
 */
class PtwService
{
    public const STATUS_DRAFT = '1';
    public const STATUS_PENDING_REVIEW = '2';
    public const STATUS_ACTIVE = '5';

    public static function statusLabels(): array
    {
        return [
            self::STATUS_DRAFT => 'DRAFT',
            self::STATUS_PENDING_REVIEW => 'PENDING REVIEW',
            '3' => 'REJECTED',
            self::STATUS_ACTIVE => 'ACTIVE',
        ];
    }

    public function statusLabel($status): string
    {
        return self::statusLabels()[(string) $status] ?? (string) $status;
    }

    /**
     * Generate the next running document number: PTW-{COMP}-{DEPT}-001.
     */
    public function buildDocumentNumber($companyId, $departmentId): string
    {
        $companyCode = 'MAC';
        if ($companyId && ($comp = Company::find($companyId))) {
            $companyCode = $comp->document_code ?: substr(strtoupper($comp->company_name), 0, 3);
        }

        $deptCode = 'MIS';
        if ($departmentId && ($dept = Department::find($departmentId))) {
            $deptCode = $dept->document_code ?: $dept->code ?: substr(strtoupper($dept->name), 0, 3);
        }

        $prefix = "PTW-{$companyCode}-{$deptCode}-";
        $count = PtwDocument::where('document_number', 'like', "{$prefix}%")->count();
        $nextNum = str_pad($count + 1, 3, '0', STR_PAD_LEFT);

        return "{$prefix}{$nextNum}";
    }

    /**
     * Map documents to flat export rows (column order matches PtwDocumentExport headings).
     */
    public function toExportRows($documents): array
    {
        $rows = [];
        foreach ($documents as $doc) {
            $rows[] = [
                $doc->id,
                $doc->document_number,
                $doc->title,
                $doc->company->company_name ?? '-',
                $doc->department->name ?? '-',
                $doc->user->name ?? '-',
                $this->statusLabel($doc->status),
                $doc->detail_location,
                $doc->doc_created ? date('d/m/Y', strtotime($doc->doc_created)) : '-',
                $doc->inactive_at ? date('d/m/Y', strtotime($doc->inactive_at)) : '-',
            ];
        }

        return $rows;
    }
}
