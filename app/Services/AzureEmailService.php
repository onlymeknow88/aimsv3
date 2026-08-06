<?php

namespace App\Services;

use App\Models\Office365;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class AzureEmailService
{
    protected $office365Config;
    protected $configId;

    public function __construct($configId = 3)
    {
        $this->configId = $configId;
        $this->office365Config = Office365::find($configId);
        // dd($this->office365Config);

        if (!$this->office365Config) {
            throw new \Exception("Office365 configuration not found with ID: {$configId}");
        }
    }

    /**
     * Get authorization URL for OAuth flows
     */
    public function getAuthorizationUrl(): string
    {
        $client_id = $this->office365Config->client_id;
        // dd($client_id);
        $tenant_id = $this->office365Config->tenant_id;
        $scope = 'Mail.Send offline_access';
        $redirect_uri = $this->office365Config->redirect_uri;

        $authUri = 'https://login.microsoftonline.com/' . $tenant_id
            . '/oauth2/v2.0/authorize?client_id=' . $client_id
            . '&scope=' . urlencode($scope)
            . '&redirect_uri=' . urlencode($redirect_uri)
            . '&response_type=code'
            . '&approval_prompt=auto';

        return $authUri;
    }

    /**
     * Exchange authorization code for access token
     */
    public function exchangeCodeForToken(string $code, ?string $sessionState = null): array
    {
        try {
            // Update the config with the received code and session state
            $this->office365Config->update([
                'code' => $code,
                'session_state' => $sessionState
            ]);

            $url = "https://login.microsoftonline.com/{$this->office365Config->tenant_id}/oauth2/v2.0/token";

            $paramPost = [
                'client_id' => $this->office365Config->client_id,
                'scope' => 'Mail.Send offline_access',
                'code' => $code,
                'session_state' => $sessionState,
                'client_secret' => $this->office365Config->client_secret,
                'redirect_uri' => $this->office365Config->redirect_uri,
                'grant_type' => 'authorization_code'
            ];

            $response = Http::asForm()->post($url, $paramPost);
            $dataResult = $response->json();

            // dd($dataResult);

            if ($response->successful() && isset($dataResult['access_token'])) {
                $accessToken = $dataResult['access_token'];
                $refreshToken = $dataResult['refresh_token'] ?? null;
                $expiresAt = Carbon::now()->addSeconds($dataResult['expires_in']);

                $this->office365Config->update([
                    'access_token' => $accessToken,
                    'refresh_token' => $refreshToken,
                    'expires_at' => $expiresAt,
                ]);

                return [
                    'success' => true,
                    'expires_at' => $expiresAt->toDateTimeString()
                ];
            } else {
                Log::error('Failed to retrieve access token', $dataResult);
                return [
                    'success' => false,
                    'message' => 'Failed to retrieve access token: ' . ($dataResult['error_description'] ?? 'Unknown error')
                ];
            }
        } catch (\Exception $e) {
            Log::error('Token exchange error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Token exchange failed: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Send email using Microsoft Graph API
     */
    public function sendEmail(array $emailData): array
    {
        try {
            if (!$this->isTokenValid()) {
                $refreshResult = $this->refreshAccessToken();
                if (!$refreshResult['success']) {
                    return [
                        'success' => false,
                        'message' => 'Token expired and refresh failed'
                    ];
                }
            }

            $graphUrl = 'https://graph.microsoft.com/v1.0/me/sendMail';

            $message = $this->buildEmailMessage($emailData);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->office365Config->access_token,
                'Content-Type' => 'application/json'
            ])->post($graphUrl, [
                'message' => $message
            ]);

            // Self-healing: if unauthorized/invalid token, refresh and retry once
            if ($response->status() === 401) {
                Log::info('AzureEmailService: Access token invalid/unauthorized. Attempting token refresh...');
                $refreshResult = $this->refreshAccessToken();
                if ($refreshResult['success']) {
                    // Refetch config to get updated access token
                    $this->office365Config = \App\Models\Office365::find($this->configId);
                    
                    Log::info('AzureEmailService: Token refreshed. Retrying email send...');
                    $response = Http::withHeaders([
                        'Authorization' => 'Bearer ' . $this->office365Config->access_token,
                        'Content-Type' => 'application/json'
                    ])->post($graphUrl, [
                        'message' => $message
                    ]);
                }
            }

            if ($response->successful()) {
                Log::info('Email sent successfully', ['to' => $emailData['to']]);
                return [
                    'success' => true,
                    'message_id' => $response->header('Location')
                ];
            } else {
                $error = $response->json();
                Log::error('Failed to send email', $error ?? []);
                return [
                    'success' => false,
                    'message' => 'Failed to send email: ' . ($error['error']['message'] ?? 'Unknown error or invalid token format')
                ];
            }
        } catch (\Exception $e) {
            Log::error('Email sending error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Email sending failed: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Send multiple emails
     */
    public function sendBulkEmails(array $emails): array
    {
        $results = [];

        foreach ($emails as $index => $emailData) {
            $result = $this->sendEmail($emailData);
            $results[] = array_merge($result, [
                'index' => $index,
                'to' => $emailData['to']
            ]);

            // Add small delay between emails to avoid rate limiting
            usleep(100000); // 0.1 second delay
        }

        return $results;
    }

    /**
     * Build email message structure for Graph API
     */
    protected function buildEmailMessage(array $emailData): array
    {
        $message = [
            'subject' => $emailData['subject'],
            'body' => [
                'contentType' => $emailData['is_html'] ? 'HTML' : 'Text',
                'content' => $emailData['body']
            ]
        ];

        // Handle multiple recipients in 'to' field
        if (is_string($emailData['to'])) {
            // Split by semicolon or comma
            $toEmails = preg_split('/[;,]/', $emailData['to']);
            $toEmails = array_map('trim', $toEmails);
            $toEmails = array_filter($toEmails); // Remove empty values
        } else {
            $toEmails = is_array($emailData['to']) ? $emailData['to'] : [$emailData['to']];
        }

        $message['toRecipients'] = [];
        foreach ($toEmails as $email) {
            if (!empty(trim($email))) {
                $message['toRecipients'][] = [
                    'emailAddress' => [
                        'address' => trim($email)
                    ]
                ];
            }
        }

        // Handle multiple recipients in 'to' field
        if (is_string($emailData['cc'])) {
            // Split by semicolon or comma
            $ccEmails = preg_split('/[;,]/', $emailData['cc']);
            $ccEmails = array_map('trim', $ccEmails);
            $ccEmails = array_filter($ccEmails); // Remove empty values
        } else {
            $ccEmails = is_array($emailData['cc']) ? $emailData['cc'] : [$emailData['cc']];
        }

        $message['ccRecipients'] = [];

        foreach ($ccEmails as $email) {
            if (!empty(trim($email))) {
                $message['ccRecipients'][] = [
                    'emailAddress' => [
                        'address' => trim($email)
                    ]
                ];
            }
        }

        // Add BCC recipients
        if (!empty($emailData['bcc'])) {
            $message['bccRecipients'] = [];
            $bccEmails = is_array($emailData['bcc']) ? $emailData['bcc'] : [trim($emailData['bcc'])];
            foreach ($bccEmails as $bcc) {
                if (!empty(trim($bcc))) {
                    $message['bccRecipients'][] = [
                        'emailAddress' => ['address' => trim($bcc)]
                    ];
                }
            }
        }

        // Add attachments - Handle single file or multiple files
        if (!empty($emailData['attachments'])) {
            $message['attachments'] = [];

            // Convert single attachment to array for uniform processing
            $attachments = is_array($emailData['attachments']) ? $emailData['attachments'] : [$emailData['attachments']];

            foreach ($attachments as $attachment) {
                if ($attachment && !empty($attachment)) {
                    try {
                        // Handle different types of attachment data
                        if (is_object($attachment) && method_exists($attachment, 'getClientOriginalName')) {
                            // Laravel UploadedFile object
                            $message['attachments'][] = [
                                '@odata.type' => '#microsoft.graph.fileAttachment',
                                'name' => $attachment->getClientOriginalName(),
                                'contentType' => $attachment->getMimeType(),
                                'contentBytes' => base64_encode(file_get_contents($attachment->getRealPath()))
                            ];
                        } elseif (is_array($attachment) && isset($attachment['name']) && isset($attachment['content'])) {
                            // Array format: ['name' => 'file.pdf', 'content' => 'base64_content', 'contentType' => 'application/pdf']
                            $message['attachments'][] = [
                                '@odata.type' => '#microsoft.graph.fileAttachment',
                                'name' => $attachment['name'],
                                'contentType' => $attachment['contentType'] ?? 'application/octet-stream',
                                'contentBytes' => is_string($attachment['content']) ? $attachment['content'] : base64_encode($attachment['content'])
                            ];
                        } elseif (is_array($attachment) && isset($attachment['path'])) {
                            // Array format with file path: ['name' => 'file.pdf', 'path' => '/path/to/file.pdf', 'contentType' => 'application/pdf']
                            if (file_exists($attachment['path'])) {
                                $message['attachments'][] = [
                                    '@odata.type' => '#microsoft.graph.fileAttachment',
                                    'name' => $attachment['name'] ?? basename($attachment['path']),
                                    'contentType' => $attachment['contentType'] ?? (@mime_content_type($attachment['path']) ?: 'application/octet-stream'),
                                    'contentBytes' => base64_encode(file_get_contents($attachment['path']))
                                ];
                            }
                        } elseif (is_string($attachment) && file_exists($attachment)) {
                            // Direct file path as string
                            $message['attachments'][] = [
                                '@odata.type' => '#microsoft.graph.fileAttachment',
                                'name' => basename($attachment),
                                'contentType' => @mime_content_type($attachment) ?: 'application/octet-stream',
                                'contentBytes' => base64_encode(file_get_contents($attachment))
                            ];
                        }
                    } catch (\Exception $e) {
                        // Log error but continue processing other attachments
                        Log::warning('Failed to process attachment: ' . $e->getMessage(), [
                            'attachment' => is_object($attachment) ? get_class($attachment) : gettype($attachment)
                        ]);
                    }
                }
            }
        }
        return $message;
    }

    /**
     * Check if access token is valid
     */
    public function isTokenValid(): bool
    {
        if (!$this->office365Config->access_token || !$this->office365Config->expires_at) {
            return false;
        }

        return Carbon::now()->lt($this->office365Config->expires_at);
    }

    /**
     * Refresh access token using refresh token
     */
    public function refreshAccessToken(): array
    {
        try {
            if (!$this->office365Config->refresh_token) {
                return [
                    'success' => false,
                    'message' => 'No refresh token available'
                ];
            }

            $url = "https://login.microsoftonline.com/{$this->office365Config->tenant_id}/oauth2/v2.0/token";

            $paramPost = [
                'client_id' => $this->office365Config->client_id,
                'scope' => 'Mail.Send',
                'refresh_token' => $this->office365Config->refresh_token,
                'client_secret' => $this->office365Config->client_secret,
                'grant_type' => 'refresh_token'
            ];

            $response = Http::asForm()->post($url, $paramPost);
            $dataResult = $response->json();

            if ($response->successful() && isset($dataResult['access_token'])) {
                $accessToken = $dataResult['access_token'];
                $refreshToken = $dataResult['refresh_token'] ?? $this->office365Config->refresh_token;
                $expiresAt = Carbon::now()->addSeconds($dataResult['expires_in']);

                $this->office365Config->update([
                    'access_token' => $accessToken,
                    'refresh_token' => $refreshToken,
                    'expires_at' => $expiresAt,
                ]);

                return [
                    'success' => true,
                    'expires_at' => $expiresAt->toDateTimeString()
                ];
            } else {
                Log::error('Failed to refresh access token', $dataResult);
                return [
                    'success' => false,
                    'message' => 'Failed to refresh token: ' . ($dataResult['error_description'] ?? 'Unknown error')
                ];
            }
        } catch (\Exception $e) {
            Log::error('Token refresh error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Token refresh failed: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Check token status
     */
    public function checkTokenStatus(): array
    {
        return [
            'has_token' => !empty($this->office365Config->access_token),
            'is_valid' => $this->isTokenValid(),
            'expires_at' => $this->office365Config->expires_at,
            'has_refresh_token' => !empty($this->office365Config->refresh_token)
        ];
    }

    /**
     * Get token expiry time
     */
    public function getTokenExpiryTime(): ?string
    {
        return $this->office365Config->expires_at;
    }

    /**
     * Test connection to Microsoft Graph API
     */
    public function testConnection(): array
    {
        try {
            if (!$this->isTokenValid()) {
                return [
                    'success' => false,
                    'message' => 'Token is not valid'
                ];
            }

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->office365Config->access_token
            ])->get('https://graph.microsoft.com/v1.0/me');

            if ($response->successful()) {
                $userData = $response->json();
                return [
                    'success' => true,
                    'message' => 'Connection successful',
                    'data' => [
                        'user_email' => $userData['mail'] ?? $userData['userPrincipalName'],
                        'display_name' => $userData['displayName']
                    ]
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Connection failed: ' . $response->status()
                ];
            }
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Connection test failed: ' . $e->getMessage()
            ];
        }
    }
}
