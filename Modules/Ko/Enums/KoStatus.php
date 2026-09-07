<?php

namespace Modules\Ko\Enums;

enum KoStatus: string
{
    case Draft = 'Draft';
    case Returned = 'Returned';
    case AdminProposalVerification = 'Admin Proposal Verification';
    case CoordinatorProposalVerification = 'Coordinator Proposal Verification';
    case Commissioning = 'Commissioning in Progress';
    case Issue = 'Issue';
    case CommissionerCommissioningVerification = 'Commissioner Commissioning Verification';
    case CoordinatorCommissioningVerification = 'Coordinator Commissioning Verification';
    case CommissioningReturned = 'Commissioning Returned';
    case Completed = 'Completed';
}
