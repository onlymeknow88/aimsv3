<?php

namespace App\Filament\Resources\Users\Schemas;

use App\Models\AimsModule;
use App\Models\AimsRole;
use App\Models\Company;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                // Bungkus field atas dalam Grid 1 kolom full-width agar tersusun vertikal penuh
                Grid::make(1)
                    ->columnSpan('full')
                    ->schema([
                        TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            ->inlineLabel(),

                        TextInput::make('email')
                            ->email()
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->inlineLabel(),

                        Select::make('department_id')
                            ->label('Departments')
                            ->relationship('department', 'name')
                            ->searchable()
                            ->preload()
                            ->required()
                            ->inlineLabel(),

                        TextInput::make('password')
                            ->password()
                            ->dehydrateStateUsing(fn ($state) => bcrypt($state))
                            ->dehydrated(fn ($state) => filled($state))
                            ->required(fn (string $context) => $context === 'create')
                            ->inlineLabel(),

                        Toggle::make('is_employee')
                            ->label('Create Employee Data')
                            ->reactive()
                            ->default(false)
                            ->inlineLabel(),
                    ]),

                // Employee Data Section (diatur ke full-width)
                Section::make('Employee Data')
                    ->visible(fn (callable $get) => (bool) $get('is_employee'))
                    ->inlineLabel()
                    ->columnSpan('full')
                    ->schema([
                        TextInput::make('employee_number')
                            ->label('Employee Number')
                            ->required(fn (callable $get) => (bool) $get('is_employee'))
                            ->maxLength(255),

                        TextInput::make('employee_name')
                            ->label('Name')
                            ->required(fn (callable $get) => (bool) $get('is_employee'))
                            ->maxLength(255),

                        TextInput::make('employee_id_number')
                            ->label('Id number')
                            ->required(fn (callable $get) => (bool) $get('is_employee'))
                            ->maxLength(255),

                        DatePicker::make('employee_date_of_birth')
                            ->label('Date of birth')
                            ->nullable(),

                        Select::make('employee_gender')
                            ->label('Gender')
                            ->options([
                                'Laki-laki' => 'Laki-laki',
                                'Perempuan' => 'Perempuan',
                            ])
                            ->required(fn (callable $get) => (bool) $get('is_employee'))
                            ->nullable(),

                        TextInput::make('employee_position')
                            ->label('Position')
                            ->maxLength(255),

                        TextInput::make('employee_grade')
                            ->label('Grade')
                            ->maxLength(255),

                        Select::make('employee_status')
                            ->label('Status')
                            ->options([
                                'Active' => 'Active',
                                'Inactive' => 'Inactive',
                                'Candidate' => 'Candidate',
                            ])
                            ->nullable(),

                        Select::make('employee_company_id')
                            ->label('Company')
                            ->options(Company::pluck('company_name', 'id'))
                            ->nullable(),

                        Textarea::make('employee_address')
                            ->label('Address')
                            ->nullable(),
                    ]),

                // AIMS Module Role Section (diatur ke full-width)
                Section::make('AIMS Module Role')
                    ->columnSpan('full')
                    ->inlineLabel()
                    ->schema([
                        Select::make('aims_module_id')
                            ->label('Select Module')
                            ->options(AimsModule::pluck('name', 'id'))
                            ->reactive()
                            ->afterStateUpdated(fn (callable $set) => $set('aims_role_id', null)),

                        Select::make('aims_role_id')
                            ->label('Select Role')
                            ->options(function (callable $get) {
                                $moduleId = $get('aims_module_id');
                                if (! $moduleId) {
                                    return [];
                                }

                                return AimsRole::where('module_id', $moduleId)->pluck('name', 'id');
                            })
                            ->visible(fn (callable $get) => filled($get('aims_module_id'))),
                    ]),
            ]);
    }
}
