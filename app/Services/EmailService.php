<?php

namespace App\Services;

use PHPMailer\PHPMailer\PHPMailer;

class EmailService
{
    /**
     * Funciton to send email to selected users
     */
    public function sendEmail($data)
    {
        try {
            $config = [
                'name' => env('APP_NAME'),
                'email' => env('MAIL_USERNAME'),
                'host' => env('MAIL_HOST', 'smtp.mailgun.org'),
                'port' => env('MAIL_PORT', 587),
                'username' => env('MAIL_USERNAME'),
                'password' => env('MAIL_PASSWORD'),
                'encryption' => env('MAIL_ENCRYPTION'),
            ];

            $mail = new PHPMailer(true);

            if ($data['type'] == 'new_document') {
                $html = view('email_templates.document_system_review', [
                    'title' => $data['title'],
                    'pic' => $data['pic'],
                    'action_url' => url('document-systems/login'),
                ])->render();

                $subject = trans('global.new_document');
            } else if ($data['type'] == 'almost_expire_document') {
                $html = view('email_templates.almost_expire_document', [
                    'documents' => $data['documents'],
                    'day' => $data['day'],
                ])->render();

                $subject = 'Reminder Expire Document';
            } else if ($data['type'] == 'expire_document') {
                $html = view('email_templates.expire_document', [
                    'documents' => $data['documents'],
                ])->render();

                $subject = 'Expire Document';
            } else {
                $html = view('email_templates.expire_document', [
                    'documents' => $data['documents'],
                ])->render();

                $subject = 'Expire Document';
            }


            $to = '';
            if (isset($data['receiver'])) {
                if (is_array($data['receiver'])) {
                    $to = implode(';', $data['receiver']);
                } else {
                    $to = $data['receiver'];
                }
            }

            $attachmentPath = '';
            $attachmentName = '';
            if (isset($data['has_attachments']) && $data['has_attachments'] && isset($data['files']) && count($data['files']) > 0) {
                $attachmentPath = $data['files'][0];
                $attachmentName = basename($attachmentPath);
            }

            $response = sendPowerAutomateEmail([
                'SendTo' => $to,
                'Title' => $subject,
                'MsgBody' => $html,
                'AttchmentPath' => $attachmentPath,
                'AttchmentName' => $attachmentName,
                'SendCC' => '',
            ]);

            if (isset($response['status']) && $response['status'] === 'success') {
                return [
                    'error' => false,
                    'response' => $response,
                ];
            } else {
                return [
                    'error' => true,
                    'message' => $response['message'] ?? 'Unknown error sending email via Power Automate',
                ];
            }
        } catch (\Throwable $e) {
            return [
                'error' => true,
                'message' => $e->getMessage() . '--' . $e->getLine() . '--' . $e->getFile(),
            ];
        }
    }
}
