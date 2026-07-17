<?php

namespace App\Filament\Resources\AimsModules;

use App\Filament\Resources\AimsModules\Pages\CreateAimsModule;
use App\Filament\Resources\AimsModules\Pages\EditAimsModule;
use App\Filament\Resources\AimsModules\Pages\ListAimsModules;
use App\Filament\Resources\AimsModules\Schemas\AimsModuleForm;
use App\Filament\Resources\AimsModules\Tables\AimsModulesTable;
use App\Models\AimsModule;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class AimsModuleResource extends Resource
{
    protected static ?string $model = AimsModule::class;

    protected static bool $shouldRegisterNavigation = true;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-shield-check';

    protected static string | \UnitEnum | null $navigationGroup = null;

    protected static ?int $navigationSort = 3;

    protected static ?string $navigationLabel = 'Roles';

    protected static ?string $recordTitleAttribute = 'name';

    public static function getModelLabel(): string
    {
        return 'Module';
    }

    public static function getPluralModelLabel(): string
    {
        return 'Roles';
    }

    public static function form(Schema $schema): Schema
    {
        return AimsModuleForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return AimsModulesTable::configure($table);
    }

    public static function canCreate(): bool
    {
        return true;
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\MenusRelationManager::class,
            RelationManagers\RolesRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListAimsModules::route('/'),
            'create' => CreateAimsModule::route('/create'),
            'edit' => EditAimsModule::route('/{record}/edit'),
        ];
    }
}
