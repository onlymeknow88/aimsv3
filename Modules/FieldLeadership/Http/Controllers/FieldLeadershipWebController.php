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
     * Daftar semua observasi (PTO + TTT + HR).
     */
    public function observations()
    {

        return inertia('FieldLeadership/Observations/Index', [
            'defaultType' => '',
        ]);
    }

    /**
     * Daftar observasi PTO saja.
     */
    public function pto()
    {
        return inertia('FieldLeadership/Observations/Index', [
            'defaultType' => 'Planned Task Observation',
        ]);
    }

    /**
     * Daftar observasi TTT saja.
     */
    public function ttt()
    {
        return inertia('FieldLeadership/Observations/Index', [
            'defaultType' => 'Take Time Talk',
        ]);
    }

    /**
     * Daftar observasi Hazard Report saja.
     */
    public function hr()
    {
        return inertia('FieldLeadership/Observations/Index', [
            'defaultType' => 'Hazard Report',
        ]);
    }

    /**
     * Form buat observasi baru.
     */
    public function create()
    {
        return inertia('FieldLeadership/Observations/Create');
    }

    /**
     * Detail satu observasi.
     */
    public function detail($id)
    {
        return inertia('FieldLeadership/Observations/Detail', [
            'id' => $id,
        ]);
    }

    /**
     * Daftar risk finding.
     */
    public function risks()
    {
        return inertia('FieldLeadership/Risks/Index');
    }

    /**

     * Daftar corrective actions — redirect ke risks dengan filter.
     */
    public function correctiveActions()
    {

        return inertia('FieldLeadership/Risks/Index');
    }

    /**
     * Master data (categories, KTA/TTA, potency).
     */

    public function master(Request $request)
    {
        return inertia('FieldLeadership/Master/Index');
    }

    /**
     * Settings / parameters modul.
     */
    public function settings()
    {
        $params = DB::table('field_leadership_parameters')->first();

        return inertia('FieldLeadership/Settings/Index', [
            'params' => $params,
        ]);
    }
}
