<?php

namespace Modules\CSMS\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use Modules\CSMS\Entities\Bidding;
use Modules\CSMS\Entities\CsmsPjo;

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
        if (!Bidding::where('id', $id)->exists()) {
            abort(404);
        }
        return Inertia::render('CSMS/Bidding/Edit', ['id' => $id]);
    }

    public function biddingDetail($id): Response
    {
        if (!Bidding::where('id', $id)->exists()) {
            abort(404);
        }
        return Inertia::render('CSMS/Bidding/Detail', ['id' => $id]);
    }

    public function postBiddingIndex(): Response
    {
        return Inertia::render('CSMS/PostBidding/Index');
    }

    public function postBiddingActive(): Response
    {
        return Inertia::render('CSMS/PostBidding/Active');
    }

    public function postBiddingInactive(): Response
    {
        return Inertia::render('CSMS/PostBidding/Inactive');
    }

    public function postBiddingCreate(): Response
    {
        return Inertia::render('CSMS/PostBidding/Create');
    }

    public function postBiddingEdit($id): Response
    {
        if (!Bidding::where('id', $id)->exists()) {
            abort(404);
        }
        return Inertia::render('CSMS/PostBidding/Edit', ['id' => $id]);
    }

    public function postBiddingDetail($id): Response
    {
        if (!Bidding::where('id', $id)->exists()) {
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

    public function pjoEdit($id): Response
    {
        if (!CsmsPjo::where('id', $id)->exists()) {
            abort(404);
        }
        return Inertia::render('CSMS/Pjo/Edit', ['id' => $id]);
    }

    public function pjoDetail($id): Response
    {
        if (!CsmsPjo::where('id', $id)->exists()) {
            abort(404);
        }
        return Inertia::render('CSMS/Pjo/Detail', ['id' => $id]);
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
