<?php

namespace App\Filament\Resources\Users\Pages;

use App\Filament\Resources\Users\UserResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Resources\Pages\EditRecord;

class EditUser extends EditRecord
{
    protected static string $resource = UserResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
        ];
    }

    protected function mutateRecordDataBeforeFill(array $data): array
    {
        $role = $this->record->documentRoles()->first();
        if ($role) {
            $data['aims_module_id'] = $role->module_id;
            $data['aims_role_id'] = $role->id;
        }

        $employee = $this->record->employee;
        if ($employee) {
            $data['is_employee'] = true;
            $data['employee_id_number'] = $employee->id_number;
            $data['employee_name'] = $employee->name;
            $data['employee_number'] = $employee->number;
            $data['employee_position'] = $employee->position;
            $data['employee_grade'] = $employee->grade;
            $data['employee_gender'] = $employee->gender;
            $data['employee_status'] = $employee->employee_status;
            $data['employee_company_id'] = $employee->company_id;
            $data['employee_date_of_birth'] = $employee->date_of_birth;
            $data['employee_address'] = $employee->address;
        } else {
            $data['is_employee'] = false;
        }

        return $data;
    }

    protected function afterSave(): void
    {
        $roleId = $this->data['aims_role_id'] ?? null;
        if ($roleId) {
            $this->record->documentRoles()->sync([$roleId]);
        } else {
            $this->record->documentRoles()->detach();
        }

        if (!empty($this->data['is_employee'])) {
            \App\Models\Employee::updateOrCreate(
                ['user_id' => $this->record->id],
                [
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
                ]
            );
        } else {
            $this->record->employee()->delete();
        }
    }
}
