<?php

namespace App\Filament\Resources\AimsModules\Pages;

use App\Filament\Resources\AimsModules\AimsModuleResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditAimsModule extends EditRecord
{
    protected static string $resource = AimsModuleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
