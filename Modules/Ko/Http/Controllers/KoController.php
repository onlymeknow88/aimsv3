<?php

namespace Modules\Ko\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class KoController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('Ko/Dashboard/Index');
    }

    public function proposals()
    {
        return Inertia::render('Ko/Proposal/Index');
    }

    public function proposalCreate()
    {
        return Inertia::render('Ko/Proposal/Create');
    }

    public function proposalEdit(string $id)
    {
        return Inertia::render('Ko/Proposal/Edit', ['id' => $id]);
    }

    public function proposalDetail(string $id)
    {
        return Inertia::render('Ko/Proposal/Detail', ['id' => $id]);
    }

    public function commissionings()
    {
        return Inertia::render('Ko/Commissioning/Index');
    }

    public function commissioningCreate()
    {
        return Inertia::render('Ko/Commissioning/Create');
    }

    public function commissioningDetail(string $id)
    {
        return Inertia::render('Ko/Commissioning/Detail', ['id' => $id]);
    }

    public function issues()
    {
        return Inertia::render('Ko/Issue/Index');
    }

    public function units()
    {
        return Inertia::render('Ko/Unit/Index');
    }

    public function master()
    {
        return Inertia::render('Ko/Master/Index');
    }

    public function qrRequests()
    {
        return Inertia::render('Ko/Qr/Index');
    }
}
