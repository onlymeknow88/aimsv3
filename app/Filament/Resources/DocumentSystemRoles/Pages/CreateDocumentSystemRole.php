<?php

namespace App\Filament\Resources\DocumentSystemRoles\Pages;

use App\Filament\Resources\DocumentSystemRoles\DocumentSystemRoleResource;
use App\Models\AimsPermission;
use Filament\Resources\Pages\CreateRecord;

class CreateDocumentSystemRole extends CreateRecord
{
    protected static string $resource = DocumentSystemRoleResource::class;

    protected function afterCreate(): void
    {
        $role = $this->getRecord();
        $data = $this->form->getRawState();

        $menus = ['doc' => 1, 'jsa' => 2, 'ptw' => 3, 'master' => 4];
        foreach ($menus as $slug => $menuId) {
            AimsPermission::updateOrCreate(
                ['role_id' => $role->id, 'menu_id' => $menuId],
                [
                    'can_view' => !empty($data["{$slug}_can_view"]),
                    'can_create' => !empty($data["{$slug}_can_create"]),
                    'can_edit' => !empty($data["{$slug}_can_edit"]),
                    'can_delete' => !empty($data["{$slug}_can_delete"]),
                    'can_approval' => !empty($data["{$slug}_can_approval"]),
                ]
            );
        }
    }
}
