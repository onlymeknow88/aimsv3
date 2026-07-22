<?php

namespace Modules\CSMS\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

class CSMSController extends Controller
{
    public function dashboardIndex(): Response
    {
        return Inertia::render('CSMS/Dashboard/Index');
    }

    public function biddingIndex(): Response
    {
        return Inertia::render('CSMS/Bidding/Index');
    }

    public function biddingCreate(): Response
    {
        return Inertia::render('CSMS/Bidding/Create');
    }

    public function biddingEdit($id): Response
    {
        if (!DB::table('biddings')->where('id', $id)->exists()) {
            abort(404);
        }
        return Inertia::render('CSMS/Bidding/Edit', ['id' => $id]);
    }

    public function biddingDetail($id): Response
    {
        if (!DB::table('biddings')->where('id', $id)->exists()) {
            abort(404);
        }
        return Inertia::render('CSMS/Bidding/Detail', ['id' => $id]);
    }

    public function postBiddingIndex(): Response
    {
        return Inertia::render('CSMS/PostBidding/Index');
    }

    public function postBiddingDetail($id): Response
    {
        if (!DB::table('biddings')->where('id', $id)->exists()) {
            abort(404);
        }
        return Inertia::render('CSMS/PostBidding/Detail', ['id' => $id]);
    }

    public function renewalIndex(): Response
    {
        return Inertia::render('CSMS/Renewal/Index');
    }

    public function picaIndex(): Response
    {
        return Inertia::render('CSMS/Pica/Index');
    }

    public function pjoIndex(): Response
    {
        return Inertia::render('CSMS/Pjo/Index');
    }

    public function pjoCreate(): Response
    {
        return Inertia::render('CSMS/Pjo/Create');
    }

    public function memoKttIndex(): Response
    {
        return Inertia::render('CSMS/MemoKtt/Index');
    }

    public function letterIndex(): Response
    {
        return Inertia::render('CSMS/Letter/Index');
    }

    public function dictionaryIndex(): Response
    {
        return Inertia::render('CSMS/Dictionary/Index');
    }

    public function approvalBiddingIndex(): Response
    {
        return Inertia::render('CSMS/Approval/BiddingApproval');
    }

    public function approvalPostBiddingIndex(): Response
    {
        return Inertia::render('CSMS/Approval/PostBiddingApproval');
    }
}
