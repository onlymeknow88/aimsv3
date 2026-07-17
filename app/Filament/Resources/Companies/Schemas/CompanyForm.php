<?php

namespace App\Filament\Resources\Companies\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Schemas\Schema;

class CompanyForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('company_name')
                    ->required(),
                TextInput::make('document_code'),
                TextInput::make('address'),
                TextInput::make('email')
                    ->label('Email address')
                    ->email(),
                TextInput::make('phone_number')
                    ->tel(),
                Select::make('type')
                    ->options([
                        'Internal' => 'Internal',
                        'Contractor' => 'Contractor',
                        'SubContractor' => 'SubContractor',
                    ])
                    ->nullable(),
                Select::make('parent_company_id')
                    ->relationship('parentCompany', 'company_name')
                    ->nullable()
                    ->searchable()
                    ->preload(),
                Select::make('user_id')
                    ->relationship('manager', 'name', fn ($query) => $query->where('role', '!=', 'super_admin'))
                    ->nullable()
                    ->searchable()
                    ->preload(),
            ]);
    }
}
