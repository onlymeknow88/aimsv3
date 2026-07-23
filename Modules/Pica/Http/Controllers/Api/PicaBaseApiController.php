<?php

namespace Modules\Pica\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Modules\Pica\Entities\PicaDocument;

class PicaBaseApiController extends Controller
{
    // -------------------------------------------------------------------------
    // PicaStatus constants
    // -------------------------------------------------------------------------
    const STATUS_DRAFT         = 'Draft';
    const STATUS_OPEN          = 'Open';
    const STATUS_ON_REVIEW_PJA = 'On Review PJA';
    const STATUS_ON_REVIEW_CRS = 'On Review CRS';
    const STATUS_OVERDUE       = 'Overdue';
    const STATUS_CLOSED        = 'Closed';
    const STATUS_NEW_REQUEST   = 'New Request';

    const REQUESTED_PJA      = 'Requested PJA';
    const REQUESTED_CRS      = 'Requested CRS';
    const REQUESTED_RETURN   = 'Return Document';
    const REQUESTED_APPROVED = 'Approved';

    const PUBLISHED_DRAFT   = 'Draft';
    const PUBLISHED_PUBLISH = 'Publish';

    // Active document statuses
    const ACTIVE_STATUSES = [
        self::STATUS_OPEN,
        self::STATUS_ON_REVIEW_PJA,
        self::STATUS_ON_REVIEW_CRS,
        self::STATUS_OVERDUE,
        self::STATUS_CLOSED,
    ];

    // -------------------------------------------------------------------------
    // PicaSource constants
    // -------------------------------------------------------------------------
    const SOURCE_FIELD_LEADERSHIP = 'Field Leadership';
    const SOURCE_INSPEKSI_KPLH    = 'Inspeksi KPLH';
    const SOURCE_AUDIT            = 'Audit';
    const SOURCE_CSMS             = 'CSMS';    // tambahan aimsv3
    const SOURCE_MANUAL           = 'Manual';  // tambahan aimsv3

    const ALL_SOURCES = [
        self::SOURCE_FIELD_LEADERSHIP,
        self::SOURCE_INSPEKSI_KPLH,
        self::SOURCE_AUDIT,
        self::SOURCE_CSMS,
        self::SOURCE_MANUAL,
    ];

    // -------------------------------------------------------------------------
    // PicaInspectionType constants
    // -------------------------------------------------------------------------
    const INSPECTION_TYPES = [
        'Inspeksi',
        'Audit Internal',
        'Audit External',
        'Investigasi',
        'Monitoring',
        'Evaluasi Peraturan & Perijinan',
        'IBPR & Bowtie',
        'Field Leadership',
        'Evaluasi Target, Sasaran, Program (TSP)',
    ];

    // -------------------------------------------------------------------------
    // Identity ID generator
    // -------------------------------------------------------------------------
    protected function generateIdentityId(string $source): string
    {
        $prefixMap = [
            self::SOURCE_FIELD_LEADERSHIP => 'FL',
            self::SOURCE_INSPEKSI_KPLH    => 'KP',
            self::SOURCE_AUDIT            => 'AU',
            self::SOURCE_CSMS             => 'CS',
            self::SOURCE_MANUAL           => 'MA',
        ];

        $code  = $prefixMap[$source] ?? 'PC';
        $date  = now()->format('mY');
        $count = PicaDocument::where('source', $source)->count();

        do {
            $count++;
            $identityId = $code . $date . '-' . $code . str_pad($count, 6, '0', STR_PAD_LEFT);
        } while (PicaDocument::where('identity_id', $identityId)->exists());

        return $identityId;
    }

    // -------------------------------------------------------------------------
    // Standardised JSON responses
    // -------------------------------------------------------------------------
    protected function success($data, int $code = 200)
    {
        return response()->json(['result' => $data], $code);
    }

    protected function error(string $message, int $code = 400)
    {
        return response()->json(['message' => $message], $code);
    }
}