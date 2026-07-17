<?php

namespace App\Filament\Resources\AimsModules\RelationManagers;

use App\Filament\Resources\DocumentSystemRoles\DocumentSystemRoleResource;
use Filament\Actions\CreateAction;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Table;

class RolesRelationManager extends RelationManager
{
    protected static string $relationship = 'roles';

    protected static ?string $relatedResource = DocumentSystemRoleResource::class;

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
                \Filament\Tables\Columns\TextColumn::make('name')
                    ->label('name'),
            ])
            ->headerActions([
                // Disable creating new roles via this relation manager
            ])
            ->recordActions([
                \Filament\Actions\EditAction::make()
                    ->mutateRecordDataUsing(function (array $data, \App\Models\AimsRole $record): array {
                        $permissions = $record->permissions()->with('menu')->get();
                        
                        $menuSlugs = ['doc', 'jsa', 'ptw', 'master'];
                        $actions = ['can_view', 'can_create', 'can_edit', 'can_delete', 'can_approval'];

                        foreach ($menuSlugs as $slug) {
                            foreach ($actions as $action) {
                                $data["{$slug}_{$action}"] = false;
                            }
                        }

                        foreach ($permissions as $perm) {
                            $slug = $perm->menu?->slug;
                            if ($slug && in_array($slug, $menuSlugs)) {
                                foreach ($actions as $action) {
                                    $data["{$slug}_{$action}"] = (bool) $perm->{$action};
                                }
                            }
                        }
                        return $data;
                    })
                    ->after(function (\App\Models\AimsRole $record, array $data): void {
                        $menuSlugs = ['doc', 'jsa', 'ptw', 'master'];

                        foreach ($menuSlugs as $slug) {
                            $menu = \App\Models\AimsMenu::where('slug', $slug)->first();
                            if ($menu) {
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
                        }
                    }),
            ]);
    }
}
