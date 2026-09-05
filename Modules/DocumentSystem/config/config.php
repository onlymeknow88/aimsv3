<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Document System Module Configuration
    |--------------------------------------------------------------------------
    */
    'name' => 'DocumentSystem',

    /*
    | Company code used for document numbering prefix
    */
    'company_code' => env('DOCUMENT_SYSTEM_COMPANY', 'PAMA'),

    /*
    | Document levels supported by the system
    */
    'document_levels' => ['SOP', 'TS', 'MN', 'WIN', 'FORM'],

    /*
    | PTW Permit types
    */
    'permit_types' => ['Hot Work', 'Working at Height', 'Confined Space', 'Electrical', 'General'],

    /*
    | Document status codes
    | 1 = Waiting Review, 2 = Draft, 3 = Rooting Approval, 4 = Revision, 5 = Active, 6 = Prepare Approval, 7 = Expired, 8 = Obsolete
    */
    'status_codes' => [
        '1' => 'Waiting Review',
        '2' => 'Draft',
        '3' => 'Rooting Approval',
        '4' => 'Revision',
        '5' => 'Active',
        '6' => 'Prepare Approval',
        '7' => 'Expired',
        '8' => 'Obsolete',
    ],

    /*
    | File upload settings
    */
    'upload_disk'    => 'public',
    'upload_path'    => 'document-system',
    'max_file_size'  => 20480, // KB (20MB)
    'allowed_mimes'  => ['pdf', 'docx', 'doc', 'xlsx', 'xls', 'pptx', 'png', 'jpg'],
];
