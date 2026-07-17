<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AimsModule;
use App\Models\AimsMenu;
use App\Models\AimsRole;
use App\Models\AimsPermission;

class DocumentPermissionSeederTableSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Module
        $module = AimsModule::updateOrCreate(
            ['slug' => 'document-system'],
            ['name' => 'Document System']
        );

        // 2. Create Menus
        $menus = [
            'doc'    => 'Standard Documents',
            'jsa'    => 'JSA',
            'ptw'    => 'PTW',
            'master' => 'Master Data',
        ];

        $menuIds = [];
        foreach ($menus as $slug => $name) {
            $m = AimsMenu::updateOrCreate(
                ['slug' => $slug],
                ['module_id' => $module->id, 'name' => $name]
            );
            $menuIds[$slug] = $m->id;
        }

        // 3. Create Roles
        $roles = [
            'maker'        => ['name' => 'Maker', 'is_system' => true],
            'approval_crs' => ['name' => 'Approval CRS', 'is_system' => true],
            'approval_pja' => ['name' => 'Approval PJA', 'is_system' => true],
            'super_admin'  => ['name' => 'Super Admin', 'is_system' => true],
        ];

        $roleModels = [];
        foreach ($roles as $slug => $data) {
            $r = AimsRole::updateOrCreate(
                ['slug' => $slug],
                [
                    'module_id' => $module->id,
                    'name'      => $data['name'],
                    'is_system' => $data['is_system']
                ]
            );
            $roleModels[$slug] = $r;
        }

        // 4. Default Permission Matrix Mapping
        $matrix = [
            'maker' => [
                'doc'    => ['view' => 1, 'create' => 1, 'edit' => 1, 'delete' => 0, 'approval' => 0],
                'jsa'    => ['view' => 1, 'create' => 1, 'edit' => 1, 'delete' => 0, 'approval' => 0],
                'ptw'    => ['view' => 1, 'create' => 1, 'edit' => 0, 'delete' => 0, 'approval' => 0],
                'master' => ['view' => 0, 'create' => 0, 'edit' => 0, 'delete' => 0, 'approval' => 0],
            ],
            'approval_crs' => [
                'doc'    => ['view' => 1, 'create' => 0, 'edit' => 0, 'delete' => 0, 'approval' => 1],
                'jsa'    => ['view' => 1, 'create' => 0, 'edit' => 0, 'delete' => 0, 'approval' => 0],
                'ptw'    => ['view' => 1, 'create' => 0, 'edit' => 0, 'delete' => 0, 'approval' => 0],
                'master' => ['view' => 0, 'create' => 0, 'edit' => 0, 'delete' => 0, 'approval' => 0],
            ],
            'approval_pja' => [
                'doc'    => ['view' => 1, 'create' => 0, 'edit' => 0, 'delete' => 0, 'approval' => 1],
                'jsa'    => ['view' => 1, 'create' => 0, 'edit' => 0, 'delete' => 0, 'approval' => 0],
                'ptw'    => ['view' => 1, 'create' => 0, 'edit' => 0, 'delete' => 0, 'approval' => 0],
                'master' => ['view' => 0, 'create' => 0, 'edit' => 0, 'delete' => 0, 'approval' => 0],
            ],
            'super_admin' => [
                'doc'    => ['view' => 1, 'create' => 1, 'edit' => 1, 'delete' => 1, 'approval' => 1],
                'jsa'    => ['view' => 1, 'create' => 1, 'edit' => 1, 'delete' => 1, 'approval' => 1],
                'ptw'    => ['view' => 1, 'create' => 1, 'edit' => 1, 'delete' => 1, 'approval' => 1],
                'master' => ['view' => 1, 'create' => 1, 'edit' => 1, 'delete' => 1, 'approval' => 1],
            ],
        ];

        foreach ($matrix as $roleSlug => $menuPermissions) {
            $roleId = $roleModels[$roleSlug]->id;
            foreach ($menuPermissions as $menuSlug => $perms) {
                $menuId = $menuIds[$menuSlug];
                AimsPermission::updateOrCreate(
                    ['role_id' => $roleId, 'menu_id' => $menuId],
                    [
                        'can_view'     => $perms['view'],
                        'can_create'   => $perms['create'],
                        'can_edit'     => $perms['edit'],
                        'can_delete'   => $perms['delete'],
                        'can_approval' => $perms['approval'],
                    ]
                );
            }
        }
    }
}
