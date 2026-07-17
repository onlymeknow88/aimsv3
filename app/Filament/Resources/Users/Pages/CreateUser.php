<?php

namespace App\Filament\Resources\Users\Pages;

use App\Filament\Resources\Users\UserResource;
use Filament\Resources\Pages\CreateRecord;

class CreateUser extends CreateRecord
{
    protected static string $resource = UserResource::class;

    protected function afterCreate(): void
    {
        // Sync all checked roles from the dynamic aims_role_ids_{module_id} fields only if the module itself is checked
        $allSelectedRoles = [];
        $modules = \App\Models\AimsModule::all();
        foreach ($modules as $module) {
            $isModuleChecked = !empty($this->data['aims_module_checked_' . $module->id]);
            if ($isModuleChecked) {
                $rolesForModule = $this->data['aims_role_ids_' . $module->id] ?? [];
                if (is_array($rolesForModule)) {
                    $allSelectedRoles = array_merge($allSelectedRoles, $rolesForModule);
                }
            }
        }
        
        $this->record->documentRoles()->sync($allSelectedRoles);

        if (!empty($this->data['is_employee'])) {
            \App\Models\Employee::create([
                'user_id' => $this->record->id,
                'department_id' => $this->data['department_id'] ?? null,
                'company_id' => $this->data['employee_company_id'] ?? null,
                'number' => $this->data['employee_number'] ?? null,
                'id_number' => $this->data['employee_id_number'] ?? '',
                'name' => $this->data['employee_name'] ?? $this->record->name,
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
