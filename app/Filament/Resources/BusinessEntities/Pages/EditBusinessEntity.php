<?php

namespace App\Filament\Resources\BusinessEntities\Pages;

use App\Filament\Resources\BusinessEntities\BusinessEntityResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditBusinessEntity extends EditRecord
{
    protected static string $resource = BusinessEntityResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
