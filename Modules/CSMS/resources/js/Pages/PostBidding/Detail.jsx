import React from 'react';
import { usePage } from '@inertiajs/react';
import CSMSLayout from '../../Layouts/CSMSLayout';
import BiddingDetail from '../Bidding/Detail';

// PostBidding Detail menggunakan komponen yang sama dengan Bidding Detail
// karena struktur data identik, hanya berbeda criteria
export default function PostBiddingDetail() {
    return <BiddingDetail />;
}