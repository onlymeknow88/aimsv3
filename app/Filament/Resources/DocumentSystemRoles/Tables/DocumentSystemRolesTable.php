<?php

namespace App\Filament\Resources\DocumentSystemRoles\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class DocumentSystemRolesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable(),
                TextColumn::make('slug')
                    ->searchable(),
                TextColumn::make('module.name')
                    ->label('Module')
                    ->searchable(),
                TextColumn::make('permissions')
                    ->label('Permissions')
                    ->badge()
                    ->state(fn ($record) => $record->permissions->pluck('module_name')->unique()->toArray()),
                IconColumn::make('is_system')
                    ->label('System Role')
                    ->boolean(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
