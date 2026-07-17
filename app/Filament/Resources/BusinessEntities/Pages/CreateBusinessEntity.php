<?php

namespace App\Filament\Resources\BusinessEntities\Pages;

use App\Filament\Resources\BusinessEntities\BusinessEntityResource;
use Filament\Resources\Pages\CreateRecord;

class CreateBusinessEntity extends CreateRecord
{
    protected static string $resource = BusinessEntityResource::class;
}
