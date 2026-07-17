<?php

namespace App\Filament\Resources\BusinessEntities;

use App\Filament\Resources\BusinessEntities\Pages\CreateBusinessEntity;
use App\Filament\Resources\BusinessEntities\Pages\EditBusinessEntity;
use App\Filament\Resources\BusinessEntities\Pages\ListBusinessEntities;
use App\Filament\Resources\BusinessEntities\Schemas\BusinessEntityForm;
use App\Filament\Resources\BusinessEntities\Tables\BusinessEntitiesTable;
use App\Models\BusinessEntity;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class BusinessEntityResource extends Resource
{
    protected static ?string $model = BusinessEntity::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-building-storefront';

    protected static string | \UnitEnum | null $navigationGroup = null;

    protected static ?int $navigationSort = 2;

    protected static ?string $navigationLabel = 'Business Entities';

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Schema $schema): Schema
    {
        return BusinessEntityForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return BusinessEntitiesTable::configure($table);
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
            'index' => ListBusinessEntities::route('/'),
            'create' => CreateBusinessEntity::route('/create'),
            'edit' => EditBusinessEntity::route('/{record}/edit'),
        ];
    }
}
