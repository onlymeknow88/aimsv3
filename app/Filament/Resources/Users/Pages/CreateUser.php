<?php

namespace App\Filament\Resources\Users\Pages;

use App\Filament\Resources\Users\UserResource;
use Filament\Resources\Pages\CreateRecord;

class CreateUser extends CreateRecord
{
    protected static string $resource = UserResource::class;

    protected function afterCreate(): void
    {
        $roleId = $this->data['aims_role_id'] ?? null;
        if ($roleId) {
            $this->record->documentRoles()->sync([$roleId]);
        }

        if (!empty($this->data['is_employee'])) {
            \App\Models\Employee::create([
                'user_id' => $this->record->id,
                'department_id' => $this->data['department_id'] ?? null,
                'company_id' => $this->data['employee_company_id'] ?? null,
                'number' => $this->data['employee_number'] ?? null,
                'id_number' => $this->data['employee_id_number'],
                'name' => $this->data['employee_name'],
                'date_of_birth' => $this->data['employee_date_of_birth'] ?? null,
                'gender' => $this->data['employee_gender'] ?? null,
                'address' => $this->data['employee_address'] ?? '',
                'employee_status' => $this->data['employee_status'] ?? null,
                'position' => $this->data['employee_position'] ?? null,
                'grade' => $this->data['employee_grade'] ?? null,
            ]);
        }
    }
}
