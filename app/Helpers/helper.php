<?php

use GuzzleHttp\Client;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

if (! function_exists('setting')) {
    function setting($key)
    {
        return DB::table('app_settings')->where('id', $key)->value('val');
    }
}

if (! function_exists('uploadToBlobStorage')) {
    function uploadToBlobStorage($filename, $filePathTemp, $directPath)
    {
        try {
            $client = new Client;

            $urlBlobApiLogin = setting('blob_api_login_url');

            $responseLogin = $client->request('POST', $urlBlobApiLogin, [
                'json' => [
                    'username' => setting('blob_api_login_username'),
                    'password' => setting('blob_api_login_password'),
                ],
            ]);

            $token = json_decode($responseLogin->getBody(), true)['token'] ?? null;
            if (! $token) {
                return [
                    'fileBlobUrl' => null,
                    'fileBlobPathName' => null,
                    'blobResponse' => null,
                ];
            }

            $urlBlobApi = setting('blob_api_upload_url');

            // rtrim trailing slash to prevent double slash in blob URL (e.g. uuid//filename.pdf)
            $DirectoryPath = config('app.env') === 'local'
                ? 'test/' . rtrim($directPath, '/')
                : 'complianceCMS/' . rtrim($directPath, '/');

            $response = $client->request('POST', $urlBlobApi, [
                'multipart' => [
                    [
                        'name' => 'Files',
                        'contents' => fopen($filePathTemp, 'r'),
                        'filename' => $filename,
                    ],
                    [
                        'name' => 'ContainerName',
                        'contents' => 'aims-cntr',
                    ],
                    [
                        'name' => 'DirectoryPath',
                        'contents' => $DirectoryPath,
                    ],
                ],
                'headers' => [
                    'Authorization' => 'Bearer '.$token,
                ],
            ]);



            if ($response->getStatusCode() === 200) {
                $body = json_decode($response->getBody(), true);

                Log::info($body);

                return [
                    'fileBlobUrl' => $body[0]['blobUri'] ?? null,
                    'fileBlobPathName' => $body[0]['fileName'] ?? null,
                    'blobResponse' => [
                        'blobResponse' => $body,
                    ],
                ];
            }
        } catch (Exception $e) {
            Log::error('uploadToBlobStorage error: '.$e->getMessage());
        }

        return [
            'fileBlobUrl' => null,
            'fileBlobPathName' => null,
            'blobResponse' => null,
        ];
    }
}

if (! function_exists('GetBlobSasUri')) {
    function GetBlobSasUri($container, $filePath, $expSasLimit = 5)
    {
        try {
            $client = new Client;

            $urlBlobApiLogin = setting('blob_api_login_url');

            $responseLogin = $client->request('POST', $urlBlobApiLogin, [
                'json' => [
                    'username' => setting('blob_api_login_username'),
                    'password' => setting('blob_api_login_password'),
                ],
            ]);

            $token = json_decode($responseLogin->getBody(), true)['token'] ?? null;
            if (! $token) {
                return null;
            }

            $urlBlobApi = setting('blob_api_get_blob_url_sas');

            $response = $client->request('POST', $urlBlobApi, [
                'json' => [
                    'container' => $container,
                    'filePath' => $filePath,
                    'expSasLimit' => (int) $expSasLimit,
                ],
                'headers' => [
                    'Authorization' => 'Bearer '.$token,
                    'Accept' => 'application/json',
                ],
            ]);

            if ($response->getStatusCode() === 200) {
                return json_decode($response->getBody(), true);
            }
        } catch (\Exception $e) {
            Log::error('GetBlobSasUri error: '.$e->getMessage());
        }

        return null;
    }
}

if (! function_exists('sendPowerAutomateEmail')) {
    function sendPowerAutomateEmail($data)
    {
        $url = setting('power_automate_email');

        if (!$url) {
            return [
                'status' => 'error',
                'message' => 'Power Automate URL not configured in app_settings'
            ];
        }

        // Add security key if not present
        if (!isset($data['Key'])) {
            $data['Key'] = '!234$';
        }

        try {
            $response = \Illuminate\Support\Facades\Http::post($url, $data);

            if ($response->successful()) {
                return [
                    'status' => 'success',
                    'message' => 'Email sent successfully via Power Automate'
                ];
            } else {
                return [
                    'status' => 'error',
                    'message' => 'Failed to send email: ' . $response->body()
                ];
            }
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => 'Error sending email: ' . $e->getMessage()
            ];
        }
    }
}
