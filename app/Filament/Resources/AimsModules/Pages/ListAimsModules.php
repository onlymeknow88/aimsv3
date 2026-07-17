<?php

namespace App\Filament\Resources\AimsModules\Pages;

use App\Filament\Resources\AimsModules\AimsModuleResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListAimsModules extends ListRecords
{
    protected static string $resource = AimsModuleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
