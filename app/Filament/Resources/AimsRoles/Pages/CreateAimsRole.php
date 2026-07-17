<?php

namespace App\Filament\Resources\AimsRoles\Pages;

use App\Filament\Resources\AimsRoles\AimsRoleResource;
use Filament\Resources\Pages\CreateRecord;

class CreateAimsRole extends CreateRecord
{
    protected static string $resource = AimsRoleResource::class;

    protected function afterCreate(): void
    {
        $moduleId = $this->record->module_id;
        if (!$moduleId) {
            return;
        }

        $menus = \App\Models\AimsMenu::where('module_id', $moduleId)->get();
        foreach ($menus as $menu) {
            $slug = $menu->slug;
            \App\Models\AimsPermission::updateOrCreate(
                ['role_id' => $this->record->id, 'menu_id' => $menu->id],
                [
                    'can_view'     => !empty($this->data["{$slug}_can_view"]),
                    'can_create'   => !empty($this->data["{$slug}_can_create"]),
                    'can_edit'     => !empty($this->data["{$slug}_can_edit"]),
                    'can_delete'   => !empty($this->data["{$slug}_can_delete"]),
                    'can_approval' => !empty($this->data["{$slug}_can_approval"]),
                ]
            );
        }
    }
}
