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
    // Removed static $response to prevent state leaking between requests

    /**
     * Give success response.
     */
    public static function success($data = null, $message = null, $resourceClassOrCode = null)
    {
        $httpCode      = 200;
        $resourceClass = null;

        if (is_int($resourceClassOrCode)) {
            $httpCode = $resourceClassOrCode;
        } elseif (is_string($resourceClassOrCode)) {
            $resourceClass = $resourceClassOrCode;
        }

        $result = null;
        if ($data instanceof \Illuminate\Contracts\Pagination\LengthAwarePaginator) {
            $result = [
                'current_page'   => $data->currentPage(),
                'data'           => $resourceClass ? $resourceClass::collection($data->items()) : $data->items(),
                'first_page_url' => $data->url(1),
                'from'           => $data->firstItem(),
                'last_page'      => $data->lastPage(),
                'last_page_url'  => $data->url($data->lastPage()),
                'links'          => $data->linkCollection()->toArray(),
                'next_page_url'  => $data->nextPageUrl(),
                'path'           => $data->path(),
                'per_page'       => $data->perPage(),
                'prev_page_url'  => $data->previousPageUrl(),
                'to'             => $data->lastItem(),
                'total'          => $data->total(),
            ];
        } else {
            $result = $data;
        }

        return response()->json([
            'meta'   => ['code' => $httpCode, 'status' => 'success', 'message' => $message],
            'result' => $result,
        ], $httpCode);
    }

    /**
     * Give error response.
     */
    public static function error($message = null, $code = 400)
    {
        $httpCode = (int) $code;

        return response()->json([
            'meta'   => ['code' => $httpCode, 'status' => 'error', 'message' => $message],
            'result' => null,
        ], $httpCode);
    }

}
