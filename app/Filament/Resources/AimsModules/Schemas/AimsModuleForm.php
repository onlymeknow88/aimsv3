<?php

namespace App\Filament\Resources\AimsModules\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class AimsModuleForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('slug')
                    ->required(),
            ]);
    }
}
