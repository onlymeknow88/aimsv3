<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;

class DocumentSystemChannel {
    /**
     * Save custom data to database
     */
    public function send($notifiable, Notification $notification)
    {
        $data = $notification->toDatabase($notifiable);

        return $notifiable->routeNotificationFor('database')->create([
            'id'            => $notification->id,
            'n_type'        => $data['n_type'], //<-- comes from toDatabase() Method below
            'ds_status'     => $data['ds_status'],
            'type'          => get_class($notification),
            'data'          => $data,
            'read_at'       => null,
        ]);
    }
}
