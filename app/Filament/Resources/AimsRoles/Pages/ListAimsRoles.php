<?php

namespace App\Filament\Resources\AimsRoles\Pages;

use App\Filament\Resources\AimsRoles\AimsRoleResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListAimsRoles extends ListRecords
{
    protected static string $resource = AimsRoleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
