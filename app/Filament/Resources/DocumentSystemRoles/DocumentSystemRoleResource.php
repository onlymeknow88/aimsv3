<?php

namespace App\Filament\Resources\DocumentSystemRoles;

use App\Filament\Resources\DocumentSystemRoles\Pages\CreateDocumentSystemRole;
use App\Filament\Resources\DocumentSystemRoles\Pages\EditDocumentSystemRole;
use App\Filament\Resources\DocumentSystemRoles\Pages\ListDocumentSystemRoles;
use App\Filament\Resources\DocumentSystemRoles\Schemas\DocumentSystemRoleForm;
use App\Filament\Resources\DocumentSystemRoles\Tables\DocumentSystemRolesTable;
use App\Models\AimsRole;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class DocumentSystemRoleResource extends Resource
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
        return DocumentSystemRoleForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return DocumentSystemRolesTable::configure($table);
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
            'index' => ListDocumentSystemRoles::route('/'),
            'create' => CreateDocumentSystemRole::route('/create'),
            'edit' => EditDocumentSystemRole::route('/{record}/edit'),
        ];
    }
}
