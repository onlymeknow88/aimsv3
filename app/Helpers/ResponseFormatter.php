<?php

namespace App\Helpers;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Resources\Json\ResourceCollection;

/**
 * Format response.
 */
class ResponseFormatter
{
    /**
     * API Response
     *
     * @var array
     */
    protected static $response = [
        'meta' => [
            'code' => 200,
            'status' => 'success',
            'message' => null,
        ],
        'result' => null,
    ];

    /**
     * Give success response.
     */
    public static function success($data = null, $message = null, $resourceClass = null)
    {
        self::$response['meta']['message'] = $message;

        // Check if $data is a paginated collection
        if ($data instanceof \Illuminate\Contracts\Pagination\LengthAwarePaginator) {
            self::$response['result'] = [
                'current_page' => $data->currentPage(),
                'data' => $resourceClass
                ? $resourceClass::collection($data->items())
                : $data->items(),
                'first_page_url' => $data->url(1),
                'from' => $data->firstItem(),
                'last_page' => $data->lastPage(),
                'last_page_url' => $data->url($data->lastPage()),
                'links' => $data->linkCollection()->toArray(),
                'next_page_url' => $data->nextPageUrl(),
                'path' => $data->path(),
                'per_page' => $data->perPage(),
                'prev_page_url' => $data->previousPageUrl(),
                'to' => $data->lastItem(),
                'total' => $data->total(),
            ];
        } else {
            // Standard response
            self::$response['result'] = $data;
        }

        return response()->json(self::$response, self::$response['meta']['code']);
    }


    /**
     * Give error response.
     */
    public static function error($message = null, $code = 400)
    {
        self::$response['meta']['status'] = 'error';
        self::$response['meta']['code'] = $code;
        self::$response['meta']['message'] = $message;

        return response()->json(self::$response, self::$response['meta']['code']);
    }

}
