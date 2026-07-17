<?php

namespace App\Filament\Resources\AimsRoles\Pages;

use App\Filament\Resources\AimsRoles\AimsRoleResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditAimsRole extends EditRecord
{
    protected static string $resource = AimsRoleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    protected function mutateRecordDataBeforeFill(array $data): array
    {
        $permissions = $this->record->permissions()->with('menu')->get();
        $moduleId = $this->record->module_id;
        
        if ($moduleId) {
            $menus = \App\Models\AimsMenu::where('module_id', $moduleId)->get();
            $actions = ['can_view', 'can_create', 'can_edit', 'can_delete', 'can_approval'];

            foreach ($menus as $menu) {
                foreach ($actions as $action) {
                    $data["{$menu->slug}_{$action}"] = false;
                }
            }

            foreach ($permissions as $perm) {
                $slug = $perm->menu?->slug;
                if ($slug) {
                    foreach ($actions as $action) {
                        $data["{$slug}_{$action}"] = (bool) $perm->{$action};
                    }
                }
            }
        }
        return $data;
    }

    protected function afterSave(): void
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
