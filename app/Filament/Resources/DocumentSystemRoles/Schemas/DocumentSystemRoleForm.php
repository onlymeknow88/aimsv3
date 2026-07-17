<?php

namespace App\Filament\Resources\DocumentSystemRoles\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\Placeholder;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class DocumentSystemRoleForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Detail Role')
                    ->schema([
                        TextInput::make('name')
                            ->required(),
                        TextInput::make('slug')
                            ->required(),
                        Toggle::make('is_system')
                            ->label('System Role'),
                    ])->columns(2)->columnSpan('full'),

                Section::make('Permission Matrix')
                    ->columnSpan('full')
                    ->schema([
                        Grid::make(8)
                            ->schema([
                                // Header
                                Placeholder::make('hdr_module')->label('MODULE')->columnSpan(3),
                                Placeholder::make('hdr_view')->label('VIEW')->columnSpan(1),
                                Placeholder::make('hdr_create')->label('CREATE')->columnSpan(1),
                                Placeholder::make('hdr_edit')->label('EDIT')->columnSpan(1),
                                Placeholder::make('hdr_del')->label('DEL')->columnSpan(1),
                                Placeholder::make('hdr_app')->label('APP')->columnSpan(1),

                                // Row 1: Standard Documents
                                Placeholder::make('lbl_doc')->label('Standard Documents')->columnSpan(3),
                                Checkbox::make('doc_can_view')->label('')->columnSpan(1),
                                Checkbox::make('doc_can_create')->label('')->columnSpan(1),
                                Checkbox::make('doc_can_edit')->label('')->columnSpan(1),
                                Checkbox::make('doc_can_delete')->label('')->columnSpan(1),
                                Checkbox::make('doc_can_approval')->label('')->columnSpan(1),

                                // Row 2: JSA
                                Placeholder::make('lbl_jsa')->label('  └─ JSA')->columnSpan(3),
                                Checkbox::make('jsa_can_view')->label('')->columnSpan(1),
                                Checkbox::make('jsa_can_create')->label('')->columnSpan(1),
                                Checkbox::make('jsa_can_edit')->label('')->columnSpan(1),
                                Checkbox::make('jsa_can_delete')->label('')->columnSpan(1),
                                Checkbox::make('jsa_can_approval')->label('')->columnSpan(1),

                                // Row 3: PTW
                                Placeholder::make('lbl_ptw')->label('  └─ PTW')->columnSpan(3),
                                Checkbox::make('ptw_can_view')->label('')->columnSpan(1),
                                Checkbox::make('ptw_can_create')->label('')->columnSpan(1),
                                Checkbox::make('ptw_can_edit')->label('')->columnSpan(1),
                                Checkbox::make('ptw_can_delete')->label('')->columnSpan(1),
                                Checkbox::make('ptw_can_approval')->label('')->columnSpan(1),

                                // Row 4: Master Data
                                Placeholder::make('lbl_master')->label('Master Data')->columnSpan(3),
                                Checkbox::make('master_can_view')->label('')->columnSpan(1),
                                Checkbox::make('master_can_create')->label('')->columnSpan(1),
                                Checkbox::make('master_can_edit')->label('')->columnSpan(1),
                                Checkbox::make('master_can_delete')->label('')->columnSpan(1),
                                Checkbox::make('master_can_approval')->label('')->columnSpan(1),
                            ]),
                    ]),
            ]);
    }
}
