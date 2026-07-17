<?php

namespace App\Filament\Resources\DocumentSystemRoles\Pages;

use App\Filament\Resources\DocumentSystemRoles\DocumentSystemRoleResource;
use App\Models\AimsPermission;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditDocumentSystemRole extends EditRecord
{
    protected static string $resource = DocumentSystemRoleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $role = $this->getRecord();
        $permissions = AimsPermission::where('role_id', $role->id)->get();

        $menus = ['doc' => 1, 'jsa' => 2, 'ptw' => 3, 'master' => 4];
        foreach ($menus as $slug => $menuId) {
            $perm = $permissions->where('menu_id', $menuId)->first();
            $data["{$slug}_can_view"] = $perm ? (bool)$perm->can_view : false;
            $data["{$slug}_can_create"] = $perm ? (bool)$perm->can_create : false;
            $data["{$slug}_can_edit"] = $perm ? (bool)$perm->can_edit : false;
            $data["{$slug}_can_delete"] = $perm ? (bool)$perm->can_delete : false;
            $data["{$slug}_can_approval"] = $perm ? (bool)$perm->can_approval : false;
        }

        return $data;
    }

    protected function afterSave(): void
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
