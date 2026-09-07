<?php

namespace Modules\Ko\Enums;

enum IssueReportStatus: string
{
    case Open = 'Open';
    case Returned = 'Returned';
    case AdminVerification = 'Under Admin Verification';
    case CoordinatorVerification = 'Under Coordinator Verification';
    case Solved = 'Solved';
}
