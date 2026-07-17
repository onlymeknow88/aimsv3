<?php

namespace App\Filament\Resources\BusinessEntities\Pages;

use App\Filament\Resources\BusinessEntities\BusinessEntityResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListBusinessEntities extends ListRecords
{
    protected static string $resource = BusinessEntityResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
