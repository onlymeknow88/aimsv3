<?php

namespace App\Filament\Resources\AimsRoles;

use App\Filament\Resources\AimsRoles\Pages\CreateAimsRole;
use App\Filament\Resources\AimsRoles\Pages\EditAimsRole;
use App\Filament\Resources\AimsRoles\Pages\ListAimsRoles;
use App\Filament\Resources\AimsRoles\Schemas\AimsRoleForm;
use App\Filament\Resources\AimsRoles\Tables\AimsRolesTable;
use App\Models\AimsRole;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;

class AimsRoleResource extends Resource
{
    protected static ?string $model = AimsRole::class;

    protected static bool $shouldRegisterNavigation = false;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-shield-check';

    protected static string | \UnitEnum | null $navigationGroup = 'Master Data';

    protected static ?int $navigationSort = 3;

    protected static ?string $navigationLabel = 'Roles';

    protected static ?string $recordTitleAttribute = 'name';

    public static function getModelLabel(): string
    {
        return 'Role';
    }

    public static function getPluralModelLabel(): string
    {
        return 'Roles';
    }

    public static function form(Schema $schema): Schema
    {
        return AimsRoleForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return AimsRolesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListAimsRoles::route('/'),
            'create' => CreateAimsRole::route('/create'),
            'edit' => EditAimsRole::route('/{record}/edit'),
        ];
    }
}
