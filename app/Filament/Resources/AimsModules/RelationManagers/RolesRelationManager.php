<?php

namespace App\Filament\Resources\AimsModules\RelationManagers;

use App\Filament\Resources\AimsRoles\AimsRoleResource;
use App\Filament\Resources\AimsRoles\Schemas\AimsRoleForm;
use Filament\Actions\CreateAction;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Table;

class RolesRelationManager extends RelationManager
{
    protected static string $relationship = 'roles';

    protected static ?string $relatedResource = null;

    public function form(\Filament\Schemas\Schema $schema): \Filament\Schemas\Schema
    {
        return AimsRoleForm::configure($schema);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
                \Filament\Tables\Columns\TextColumn::make('name')
                    ->label('name'),
            ])
            ->headerActions([
                \Filament\Actions\CreateAction::make()
                    ->after(function (\App\Models\AimsRole $record, array $data): void {
                        $menus = \App\Models\AimsMenu::where('module_id', $record->module_id)->get();

                        foreach ($menus as $menu) {
                            $slug = $menu->slug;
                            \App\Models\AimsPermission::updateOrCreate(
                                 ['role_id' => $record->id, 'menu_id' => $menu->id],
                                 [
                                     'can_view'     => !empty($data["{$slug}_can_view"]),
                                     'can_create'   => !empty($data["{$slug}_can_create"]),
                                     'can_edit'     => !empty($data["{$slug}_can_edit"]),
                                     'can_delete'   => !empty($data["{$slug}_can_delete"]),
                                     'can_approval' => !empty($data["{$slug}_can_approval"]),
                                 ]
                            );
                        }
                    }),
            ])
            ->recordActions([
                \Filament\Actions\EditAction::make()
                    ->mutateRecordDataUsing(function (array $data, \App\Models\AimsRole $record): array {
                        $permissions = $record->permissions()->with('menu')->get();
                        $menus = \App\Models\AimsMenu::where('module_id', $record->module_id)->get();
                        
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
                        return $data;
                    })
                    ->after(function (\App\Models\AimsRole $record, array $data): void {
                        $menus = \App\Models\AimsMenu::where('module_id', $record->module_id)->get();

                        foreach ($menus as $menu) {
                            $slug = $menu->slug;
                            \App\Models\AimsPermission::updateOrCreate(
                                ['role_id' => $record->id, 'menu_id' => $menu->id],
                                [
                                    'can_view'     => !empty($data["{$slug}_can_view"]),
                                    'can_create'   => !empty($data["{$slug}_can_create"]),
                                    'can_edit'     => !empty($data["{$slug}_can_edit"]),
                                    'can_delete'   => !empty($data["{$slug}_can_delete"]),
                                    'can_approval' => !empty($data["{$slug}_can_approval"]),
                                ]
                            );
                        }
                    }),
            ]);
    }
}
