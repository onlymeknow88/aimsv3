<?php

namespace Modules\FieldLeadership\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FieldLeadershipWebController extends Controller
{
    /**
     * Dashboard utama modul Field Leadership.
     */
    public function index()
    {
        $stats = [
            'total'       => DB::table('field_leaderships')->count(),
            'open'        => DB::table('field_leaderships')->where('status', 'Open')->count(),
            'closed'      => DB::table('field_leaderships')->where('status', 'Closed')->count(),
            'overdue'     => DB::table('field_leaderships')->where('status', 'Overdue')->count(),
            'pto'         => DB::table('field_leaderships')->where('type', 'Planned Task Observation')->count(),
            'ttt'         => DB::table('field_leaderships')->where('type', 'Take Time Talk')->count(),
            'hr'          => DB::table('field_leaderships')->where('type', 'Hazard Report')->count(),
        ];

        return inertia('FieldLeadership/Index', [
            'stats' => $stats,
        ]);
    }

    /**
     * Listing Field Leadership (Active).
     */
    public function fieldLeadership()
    {
        return inertia('FieldLeadership/FieldLeadership/Index', [
            'defaultType' => '',
        ]);
    }

    /**
     * Form buat observasi baru.
     * Semua master data di-fetch oleh useObservationForm hook via API.
     */
    public function create()
    {
        return inertia('FieldLeadership/FieldLeadership/Create');
    }

    /**
     * Form edit observasi yang sudah ada.
     * Hanya pass editId — hook fetch semua data via API.
     */
    public function edit($id)
    {
        if (! DB::table('field_leaderships')->where('id', $id)->exists()) {
            abort(404);
        }

        return inertia('FieldLeadership/FieldLeadership/Create', [
            'editId' => $id,
        ]);
    }

    /**
     * Detail satu observasi.
     */
    public function detail($id)
    {
        return inertia('FieldLeadership/FieldLeadership/Detail', [
            'id' => $id,
        ]);
    }

    /**
     * Penanggung Jawab Area - Request Review.
     */
    public function pjaRequestReview()
    {
        return inertia('FieldLeadership/Pja/Index', [
            'defaultStatus' => 'On Review PJA',
            'title' => 'PJA — Request Review'
        ]);
    }

    /**
     * Penanggung Jawab Area - Draft.
     */
    public function pjaDraft()
    {
        return inertia('FieldLeadership/Pja/Index', [
            'defaultStatus' => 'Draft',
            'title' => 'PJA — Draft'
        ]);
    }

    /**
     * Approval PJA.
     */
    public function approvalPja()
    {
        return inertia('FieldLeadership/Pja/Index', [
            'defaultStatus' => 'On Review Approval',
            'title' => 'Approval PJA'
        ]);
    }

    /**
     * Master Library (Limit Parameter, Jenis KTA/TTA, Potensi Konsekuensi).
     */
    public function master(Request $request)
    {
        return inertia('FieldLeadership/Master/Index');
    }
}
