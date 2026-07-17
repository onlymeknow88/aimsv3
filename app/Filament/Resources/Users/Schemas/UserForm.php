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
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\Placeholder;
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
                            ->dehydrated(true)
                            ->default(false)
                            ->afterStateHydrated(function ($set, $record) {
                                if ($record && $record->employee) {
                                    $set('is_employee', true);
                                }
                            })
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
                            ->dehydrated(true)
                            ->afterStateHydrated(function ($state, $set, $record) {
                                if ($record && $record->employee) {
                                    $set('employee_number', $record->employee->number);
                                }
                            })
                            ->maxLength(255),

                        TextInput::make('employee_name')
                            ->label('Name')
                            ->required(fn (callable $get) => (bool) $get('is_employee'))
                            ->dehydrated(true)
                            ->afterStateHydrated(function ($state, $set, $record) {
                                if ($record && $record->employee) {
                                    $set('employee_name', $record->employee->name);
                                }
                            })
                            ->maxLength(255),

                        TextInput::make('employee_id_number')
                            ->label('Id number')
                            ->required(fn (callable $get) => (bool) $get('is_employee'))
                            ->dehydrated(true)
                            ->afterStateHydrated(function ($state, $set, $record) {
                                if ($record && $record->employee) {
                                    $set('employee_id_number', $record->employee->id_number);
                                }
                            })
                            ->maxLength(255),

                        DatePicker::make('employee_date_of_birth')
                            ->label('Date of birth')
                            ->dehydrated(true)
                            ->afterStateHydrated(function ($state, $set, $record) {
                                if ($record && $record->employee) {
                                    $set('employee_date_of_birth', $record->employee->date_of_birth);
                                }
                            })
                            ->nullable(),

                        Select::make('employee_gender')
                            ->label('Gender')
                            ->options([
                                'Laki-laki' => 'Laki-laki',
                                'Perempuan' => 'Perempuan',
                            ])
                            ->required(fn (callable $get) => (bool) $get('is_employee'))
                            ->dehydrated(true)
                            ->afterStateHydrated(function ($state, $set, $record) {
                                if ($record && $record->employee) {
                                    $set('employee_gender', $record->employee->gender);
                                }
                            })
                            ->nullable(),

                        TextInput::make('employee_position')
                            ->label('Position')
                            ->dehydrated(true)
                            ->afterStateHydrated(function ($state, $set, $record) {
                                if ($record && $record->employee) {
                                    $set('employee_position', $record->employee->position);
                                }
                            })
                            ->maxLength(255),

                        TextInput::make('employee_grade')
                            ->label('Grade')
                            ->dehydrated(true)
                            ->afterStateHydrated(function ($state, $set, $record) {
                                if ($record && $record->employee) {
                                    $set('employee_grade', $record->employee->grade);
                                }
                            })
                            ->maxLength(255),

                        Select::make('employee_status')
                            ->label('Status')
                            ->options([
                                'Active' => 'Active',
                                'Inactive' => 'Inactive',
                                'Candidate' => 'Candidate',
                            ])
                            ->dehydrated(true)
                            ->afterStateHydrated(function ($state, $set, $record) {
                                if ($record && $record->employee) {
                                    $set('employee_status', $record->employee->employee_status);
                                }
                            })
                            ->nullable(),

                        Select::make('employee_company_id')
                            ->label('Company')
                            ->options(Company::pluck('company_name', 'id'))
                            ->dehydrated(true)
                            ->afterStateHydrated(function ($state, $set, $record) {
                                if ($record && $record->employee) {
                                    $set('employee_company_id', $record->employee->company_id);
                                }
                            })
                            ->nullable(),

                        Textarea::make('employee_address')
                            ->label('Address')
                            ->dehydrated(true)
                            ->afterStateHydrated(function ($state, $set, $record) {
                                if ($record && $record->employee) {
                                    $set('employee_address', $record->employee->address);
                                }
                            })
                            ->nullable(),
                    ]),

                // AIMS Module Roles Section (Collapsible layout)
                Section::make('AIMS Module Roles')
                    ->columnSpan('full')
                    ->collapsible()
                    ->collapsed(true) // Collapsed secara default
                    ->inlineLabel()
                    ->schema(function() {
                        $modules = AimsModule::with('roles')->get();
                        $schemaComponents = [];

                        foreach ($modules as $module) {
                             // Checkbox modul utama bertindak sebagai switch reaktif
                             $schemaComponents[] = Checkbox::make('aims_module_checked_' . $module->id)
                                 ->label(strtoupper($module->name))
                                 ->reactive()
                                 ->afterStateHydrated(function ($state, $set, $record) use ($module) {
                                     if ($record) {
                                         // Jika user memiliki role pada modul ini, centang modulnya
                                         $hasRoleInModule = $record->documentRoles()->where('module_id', $module->id)->exists();
                                         $set('aims_module_checked_' . $module->id, $hasRoleInModule);
                                     }
                                 })
                                 ->inlineLabel(false);
 
                             if (!$module->roles->isEmpty()) {
                                 // CheckboxList untuk role di modul tersebut, reaktif terhadap status checkbox modul utama
                                 $schemaComponents[] = CheckboxList::make('aims_role_ids_' . $module->id)
                                     ->label('Select Roles')
                                     ->relationship('documentRoles', 'name')
                                     ->options($module->roles->pluck('name', 'id'))
                                     ->columns(2)
                                     ->afterStateHydrated(function ($state, $set, $record) use ($module) {
                                         if ($record) {
                                             // Isi state dengan array ID role user yang sesuai dengan modul ini
                                             $assignedRoles = $record->documentRoles()
                                                 ->where('module_id', $module->id)
                                                 ->pluck('aims_roles.id')
                                                 ->toArray();
                                             $set('aims_role_ids_' . $module->id, $assignedRoles);
                                         }
                                     })
                                     ->visible(fn (callable $get) => (bool) $get('aims_module_checked_' . $module->id));
                             }
                        }

                        return $schemaComponents;
                    }),
            ]);
    }
}
