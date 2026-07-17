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
    | 1 = Draft, 2 = Ongoing, 3 = Approved Level 1, 4 = Expired, 5 = Active, 6 = Obsolete
    */
    'status_codes' => [
        '1' => 'Draft',
        '2' => 'Ongoing',
        '3' => 'Approved L1',
        '4' => 'Expired',
        '5' => 'Active',
        '6' => 'Obsolete',
    ],

    /*
    | File upload settings
    */
    'upload_disk'    => 'public',
    'upload_path'    => 'document-system',
    'max_file_size'  => 20480, // KB (20MB)
    'allowed_mimes'  => ['pdf', 'docx', 'doc', 'xlsx', 'xls', 'pptx', 'png', 'jpg'],
];
