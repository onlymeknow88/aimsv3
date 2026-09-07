<?php

namespace Modules\FieldLeadership\App\Support;

/**
 * Sumber tunggal status dokumen Field Leadership.
 *
 * Dua controller sebelumnya mendefinisikan set konstanta berbeda untuk tabel
 * yang sama; kelas ini menyatukannya. Set WORKFLOW adalah alur aktif
 * (lihat FieldLeadershipApprovalApiController), LEGACY disediakan agar data
 * lama tetap valid untuk filter/tampilan.
 */
class FieldLeadershipStatus
{
    // ── Workflow aktif ────────────────────────────────────────────────────────
    public const OPEN             = 'Open';
    public const ON_REVIEW_PJA    = 'On Review PJA';
    public const PENDING_CRS      = 'Pending CRS';
    public const ON_REVIEW_CRS    = 'On Review CRS';
    public const NOT_FOLLOWED_UP  = 'Not Followed Up';
    public const CLOSED           = 'Closed';

    // ── Non-workflow ──────────────────────────────────────────────────────────
    public const DRAFT = 'Draft';

    // ── Legacy (data lama sebelum revisi workflow) ────────────────────────────
    public const ON_REVIEW_PICA     = 'On Review PICA';
    public const ON_REVIEW_APPROVAL = 'On Review Approval';
    public const OVERDUE            = 'Overdue';

    /** Semua nilai status yang dikenal sistem. */
    public const ALL = [
        self::OPEN,
        self::ON_REVIEW_PJA,
        self::PENDING_CRS,
        self::ON_REVIEW_CRS,
        self::NOT_FOLLOWED_UP,
        self::CLOSED,
        self::DRAFT,
        self::ON_REVIEW_PICA,
        self::ON_REVIEW_APPROVAL,
        self::OVERDUE,
    ];

    /** Status akhir yang tidak boleh dihapus/diubah lagi. */
    public const FINAL = [
        self::CLOSED,
        self::NOT_FOLLOWED_UP,
    ];

    /** Daftar opsi filter dropdown (workflow aktif + legacy). */
    public const FILTER_OPTIONS = [
        self::DRAFT,
        self::OPEN,
        self::ON_REVIEW_PJA,
        self::PENDING_CRS,
        self::ON_REVIEW_CRS,
        self::NOT_FOLLOWED_UP,
        self::CLOSED,
        self::ON_REVIEW_PICA,
        self::ON_REVIEW_APPROVAL,
        self::OVERDUE,
    ];
}
