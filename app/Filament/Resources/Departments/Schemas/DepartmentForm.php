<?php

namespace App\Filament\Resources\Departments\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Schema;

class DepartmentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Grid::make(1)
                    ->schema([
                        Select::make('head_id')
                            ->relationship('head', 'name', fn ($query) => $query->where('role', '!=', 'super_admin'))
                            ->nullable()
                            ->searchable()
                            ->preload(),
                        TextInput::make('code'),
                        TextInput::make('document_code'),
                        TextInput::make('name')
                            ->required(),
                    ]),
            ]);
    }
}
