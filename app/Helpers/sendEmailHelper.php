<?php

namespace App\Traits;

use App\Services\AzureEmailService;
use Illuminate\Support\Facades\Log;

trait SendsEmail
{
    /**
     * Azure Email Service instance
     */
    protected $azureEmailService;

    /**
     * Initialize Azure Email Service
     *
     * @param int $configId
     * @return AzureEmailService
     */
    protected function getAzureEmailService(int $configId = 2): AzureEmailService
    {
        if (!$this->azureEmailService) {
            $this->azureEmailService = new AzureEmailService($configId);
        }

        return $this->azureEmailService;
    }

    /**
     * Send email using Azure Email Service with view template
     *
     * @param string $viewTemplate - View template path
     * @param array $mailData - Data to pass to the view
     * @param string|array $recipients - Email recipients
     * @param string $subject - Email subject
     * @param string|array|null $cc - CC recipients (optional)
     * @param string|array|null $bcc - BCC recipients (optional)
     * @param array $attachments - Email attachments (optional)
     * @param int $configId - Azure config ID (optional, default: 2)
     * @return array - Result from Azure Email Service
     */
    protected function sendEmailWithTemplate(
        string $viewTemplate,
        array $mailData,
        $recipients,
        string $subject,
        $cc = null,
        $bcc = null,
        array $attachments = [],
        int $configId = 2
    ): array {
        try {
            $azureService = $this->getAzureEmailService($configId);
            $body = view($viewTemplate, $mailData)->render();

            $emailData = [
                'to' => $recipients,
                'subject' => $subject,
                'body' => $body,
                'cc' => $cc ?? [],
                'bcc' => $bcc ?? [],
                'is_html' => true,
                'attachments' => $attachments
            ];

            $result = $azureService->sendEmail($emailData);

            // Log successful email sending
            if ($result['success']) {
                Log::info('Email sent successfully via trait', [
                    'template' => $viewTemplate,
                    'recipients' => $recipients,
                    'subject' => $subject
                ]);
            }

            return $result;

        } catch (\Exception $e) {
            Log::error('Trait - Email sending failed: ' . $e->getMessage(), [
                'template' => $viewTemplate,
                'recipients' => $recipients,
                'subject' => $subject,
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'message' => 'Email sending failed: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Send simple email without template
     *
     * @param string|array $recipients
     * @param string $subject
     * @param string $body
     * @param bool $isHtml
     * @param string|array|null $cc
     * @param string|array|null $bcc
     * @param array $attachments
     * @param int $configId
     * @return array
     */
    protected function sendSimpleEmail(
        $recipients,
        string $subject,
        string $body,
        bool $isHtml = true,
        $cc = null,
        $bcc = null,
        array $attachments = [],
        int $configId = 2
    ): array {
        try {
            $azureService = $this->getAzureEmailService($configId);

            $emailData = [
                'to' => $recipients,
                'subject' => $subject,
                'body' => $body,
                'cc' => $cc ?? [],
                'bcc' => $bcc ?? [],
                'is_html' => $isHtml,
                'attachments' => $attachments
            ];

            return $azureService->sendEmail($emailData);

        } catch (\Exception $e) {
            Log::error('Trait - Simple email sending failed: ' . $e->getMessage());

            return [
                'success' => false,
                'message' => 'Email sending failed: ' . $e->getMessage()
            ];
        }
    }



    /**
     * Send welcome email
     *
     * @param array $mailData
     * @param string|array $recipients
     * @param string $subject
     * @param array $attachments
     * @param int $configId
     * @return array
     */
    protected function sendWelcomeEmail(
        array $mailData,
        $recipients,
        string $subject = 'Welcome!',
        array $attachments = [],
        int $configId = 2
    ): array {
        return $this->sendEmailWithTemplate(
            'emails.welcome',
            $mailData,
            $recipients,
            $subject,
            null,
            null,
            $attachments,
            $configId
        );
    }

    /**
     * Send bulk emails with same template
     *
     * @param string $viewTemplate
     * @param array $emailsData - Array of email configurations
     * @param int $configId
     * @return array
     */
    protected function sendBulkEmailsWithTemplate(
        string $viewTemplate,
        array $emailsData,
        int $configId = 2
    ): array {
        try {
            $azureService = $this->getAzureEmailService($configId);
            $results = [];
            $successCount = 0;
            $failCount = 0;

            foreach ($emailsData as $index => $emailConfig) {
                try {
                    $body = view($viewTemplate, $emailConfig['mailData'] ?? [])->render();

                    $emailData = [
                        'to' => $emailConfig['recipients'],
                        'subject' => $emailConfig['subject'],
                        'body' => $body,
                        'cc' => $emailConfig['cc'] ?? [],
                        'bcc' => $emailConfig['bcc'] ?? [],
                        'is_html' => true,
                        'attachments' => $emailConfig['attachments'] ?? []
                    ];

                    $result = $azureService->sendEmail($emailData);

                    if ($result['success']) {
                        $successCount++;
                    } else {
                        $failCount++;
                    }

                    $results[] = array_merge($result, [
                        'index' => $index,
                        'recipients' => $emailConfig['recipients']
                    ]);

                    // Small delay to avoid rate limiting
                    usleep(100000); // 0.1 second

                } catch (\Exception $e) {
                    $failCount++;
                    $results[] = [
                        'success' => false,
                        'message' => 'Email processing failed: ' . $e->getMessage(),
                        'index' => $index,
                        'recipients' => $emailConfig['recipients'] ?? 'unknown'
                    ];
                }
            }

            Log::info('Bulk email sending completed', [
                'template' => $viewTemplate,
                'total' => count($emailsData),
                'success' => $successCount,
                'failed' => $failCount
            ]);

            return [
                'success' => true,
                'results' => $results,
                'summary' => [
                    'total' => count($emailsData),
                    'success' => $successCount,
                    'failed' => $failCount
                ]
            ];

        } catch (\Exception $e) {
            Log::error('Trait - Bulk email sending failed: ' . $e->getMessage());

            return [
                'success' => false,
                'message' => 'Bulk email sending failed: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Check Azure email service connection
     *
     * @param int $configId
     * @return array
     */
    protected function checkEmailServiceConnection(int $configId = 2): array
    {
        try {
            $azureService = $this->getAzureEmailService($configId);
            return $azureService->testConnection();
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Connection test failed: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Get email service token status
     *
     * @param int $configId
     * @return array
     */
    protected function getEmailServiceTokenStatus(int $configId = 2): array
    {
        try {
            $azureService = $this->getAzureEmailService($configId);
            return $azureService->checkTokenStatus();
        } catch (\Exception $e) {
            return [
                'has_token' => false,
                'is_valid' => false,
                'error' => $e->getMessage()
            ];
        }
    }
}
