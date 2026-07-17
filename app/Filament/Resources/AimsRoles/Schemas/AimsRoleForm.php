<?php

namespace App\Filament\Resources\AimsRoles\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\Placeholder;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class AimsRoleForm
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
                    ->schema(function (callable $get, $livewire) {
                        // Dapatkan module_id berdasarkan context record di livewire
                        $moduleId = null;
                        if (method_exists($livewire, 'getOwnerRecord') && $livewire->getOwnerRecord()) {
                            $moduleId = $livewire->getOwnerRecord()->id;
                        } elseif (method_exists($livewire, 'getRecord') && $livewire->getRecord()) {
                            $moduleId = $livewire->getRecord()->module_id;
                        }
                        
                        // Default jika module_id tidak ketemu, tampilkan default module 1 (Document System)
                        if (!$moduleId) {
                            $moduleId = 1;
                        }

                        $menus = \App\Models\AimsMenu::where('module_id', $moduleId)->get();
                        
                        $gridComponents = [
                            // Header
                            Placeholder::make('hdr_menu')->label('MENU')->columnSpan(3),
                            Placeholder::make('hdr_view')->label('VIEW')->columnSpan(1),
                            Placeholder::make('hdr_create')->label('CREATE')->columnSpan(1),
                            Placeholder::make('hdr_edit')->label('EDIT')->columnSpan(1),
                            Placeholder::make('hdr_del')->label('DEL')->columnSpan(1),
                            Placeholder::make('hdr_app')->label('APP')->columnSpan(1),
                        ];

                        foreach ($menus as $menu) {
                            $gridComponents[] = Placeholder::make('lbl_' . $menu->slug)->label($menu->name)->columnSpan(3);
                            $gridComponents[] = Checkbox::make($menu->slug . '_can_view')->label('')->columnSpan(1);
                            $gridComponents[] = Checkbox::make($menu->slug . '_can_create')->label('')->columnSpan(1);
                            $gridComponents[] = Checkbox::make($menu->slug . '_can_edit')->label('')->columnSpan(1);
                            $gridComponents[] = Checkbox::make($menu->slug . '_can_delete')->label('')->columnSpan(1);
                            $gridComponents[] = Checkbox::make($menu->slug . '_can_approval')->label('')->columnSpan(1);
                        }

                        return [
                            Grid::make(8)->schema($gridComponents)
                        ];
                    }),
            ]);
    }
}
