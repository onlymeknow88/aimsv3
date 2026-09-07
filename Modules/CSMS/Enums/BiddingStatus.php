<?php

namespace Modules\CSMS\Enums;

enum BiddingStatus: string
{
    case Draft = 'DRAFT';
    case Pending = 'PENDING';
    case Review = 'REVIEW';
}
