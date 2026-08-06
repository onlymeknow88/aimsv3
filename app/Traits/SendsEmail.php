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
    protected function getAzureEmailService(int $configId = 3): AzureEmailService
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
        int $configId = 3
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
        int $configId = 3
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
     * Check Azure email service connection
     *
     * @param int $configId
     * @return array
     */
    protected function checkEmailServiceConnection(int $configId = 3): array
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
    protected function getEmailServiceTokenStatus(int $configId = 3): array
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
