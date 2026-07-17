<?php

namespace App\Filament\Resources\DocumentSystemRoles\Pages;

use App\Filament\Resources\DocumentSystemRoles\DocumentSystemRoleResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListDocumentSystemRoles extends ListRecords
{
    protected static string $resource = DocumentSystemRoleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
