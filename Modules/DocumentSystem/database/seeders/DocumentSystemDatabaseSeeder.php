<?php

namespace Modules\DocumentSystem\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DocumentSystemDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Seed AIMS Module
        $existingModule = DB::table('aims_modules')->where('slug', 'document-system')->first();
        if ($existingModule) {
            $moduleId = $existingModule->id;
        } else {
            $moduleId = DB::table('aims_modules')->insertGetId([
                'name' => 'Document System',
                'slug' => 'document-system',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 2. Seed AIMS Menus
        $menus = [
            ['name' => 'Dashboard', 'slug' => 'doc.dashboard', 'parent_slug' => null],
            // Parent Menu Dokumen Kebijakan
            ['name' => 'Standard Documents', 'slug' => 'doc', 'parent_slug' => null],
            // Sub Menus Dokumen Kebijakan
            ['name' => 'Active Document', 'slug' => 'doc.maker', 'parent_slug' => 'doc'],
            ['name' => 'Document On Review', 'slug' => 'doc.ongoing', 'parent_slug' => 'doc'],
            ['name' => 'Obsolete Document', 'slug' => 'doc.obsolete', 'parent_slug' => 'doc'],
            ['name' => 'Draft', 'slug' => 'doc.draft', 'parent_slug' => 'doc'],
            
            ['name' => 'Approval', 'slug' => 'doc.approval', 'parent_slug' => null],
            
            // Parent Menu JSA
            ['name' => 'JSA', 'slug' => 'jsa', 'parent_slug' => null],
            // Sub Menus JSA
            ['name' => 'Active JSA', 'slug' => 'doc.jsa', 'parent_slug' => 'jsa'],
            ['name' => 'Obsolete JSA', 'slug' => 'doc.jsa.obsolete', 'parent_slug' => 'jsa'],
            ['name' => 'Draft JSA', 'slug' => 'doc.jsa.draft', 'parent_slug' => 'jsa'],
            
            // Parent Menu PTW
            ['name' => 'Permit To Work (PTW)', 'slug' => 'doc.ptw.parent', 'parent_slug' => null],
            // Sub Menus PTW
            ['name' => 'Active PTW', 'slug' => 'doc.ptw', 'parent_slug' => 'doc.ptw.parent'],
            
            ['name' => 'Master Data', 'slug' => 'doc.master', 'parent_slug' => null],
        ];

        $menuIds = [];
        // Loop pertama: Insert/Update menu dasar untuk mendapatkan semua ID menu
        foreach ($menus as $index => $m) {
            $existingMenu = DB::table('aims_menus')->where('slug', $m['slug'])->first();
            if ($existingMenu) {
                DB::table('aims_menus')->where('id', $existingMenu->id)->update([
                    'name' => $m['name'],
                    'order_by' => $index + 1,
                    'updated_at' => now(),
                ]);
                $menuIds[$m['slug']] = $existingMenu->id;
            } else {
                $menuIds[$m['slug']] = DB::table('aims_menus')->insertGetId([
                    'module_id' => $moduleId,
                    'name' => $m['name'],
                    'slug' => $m['slug'],
                    'order_by' => $index + 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Loop kedua: Set parent_id berdasarkan parent_slug
        foreach ($menus as $m) {
            if ($m['parent_slug'] && isset($menuIds[$m['parent_slug']])) {
                DB::table('aims_menus')
                    ->where('id', $menuIds[$m['slug']])
                    ->update(['parent_id' => $menuIds[$m['parent_slug']]]);
            } else {
                DB::table('aims_menus')
                    ->where('id', $menuIds[$m['slug']])
                    ->update(['parent_id' => null]);
            }
        }

        // 3. Seed AIMS Roles
        $roles = [
            ['name' => 'Maker', 'slug' => 'maker', 'is_system' => true],
            ['name' => 'Approval CRS', 'slug' => 'approval_crs', 'is_system' => true],
            ['name' => 'Approval PJA', 'slug' => 'approval_pja', 'is_system' => true],
            ['name' => 'Super Admin', 'slug' => 'super_admin', 'is_system' => true],
        ];

        $roleIds = [];
        foreach ($roles as $r) {
            $existingRole = DB::table('aims_roles')->where('module_id', $moduleId)->where('slug', $r['slug'])->first();
            if ($existingRole) {
                $roleIds[$r['slug']] = $existingRole->id;
            } else {
                $roleIds[$r['slug']] = DB::table('aims_roles')->insertGetId([
                    'module_id' => $moduleId,
                    'name' => $r['name'],
                    'slug' => $r['slug'],
                    'is_system' => $r['is_system'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // 4. Seed Matrix Permissions (based on PRD Section 8)
        // Table Columns: role_id, menu_id, can_view, can_create, can_edit, can_delete, can_approval
        
        // Define default settings for Maker Role
        $makerPermissions = [
            'doc.dashboard' => ['view' => true],
            'doc.maker' => ['view' => true, 'create' => true, 'edit' => true],
            'doc.ongoing' => ['view' => true],
            'doc.draft' => ['view' => true, 'create' => true, 'edit' => true],
            'doc.obsolete' => ['view' => true],
            'doc.jsa' => ['view' => true, 'create' => true, 'edit' => true],
            'doc.jsa.obsolete' => ['view' => true],
            'doc.jsa.draft' => ['view' => true, 'create' => true, 'edit' => true],
            'doc.ptw' => ['view' => true, 'create' => true],
        ];

        // Define default settings for Approval CRS (Level 1 Approval)
        $crsPermissions = [
            'doc.dashboard' => ['view' => true],
            'doc.maker' => ['view' => true],
            'doc.ongoing' => ['view' => true],
            'doc.obsolete' => ['view' => true],
            'doc.approval' => ['view' => true, 'approval' => true],
            'doc.jsa' => ['view' => true],
            'doc.jsa.obsolete' => ['view' => true],
            'doc.jsa.draft' => ['view' => true],
            'doc.ptw' => ['view' => true],
        ];

        // Define default settings for Approval PJA (Level 2 Approval)
        $pjaPermissions = [
            'doc.dashboard' => ['view' => true],
            'doc.maker' => ['view' => true],
            'doc.ongoing' => ['view' => true],
            'doc.approval' => ['view' => true, 'approval' => true],
            'doc.jsa' => ['view' => true],
            'doc.jsa.obsolete' => ['view' => true],
            'doc.jsa.draft' => ['view' => true],
            'doc.ptw' => ['view' => true],
        ];

        // Super Admin gets ALL permissions
        foreach ($roleIds as $slug => $roleId) {
            foreach ($menuIds as $menuSlug => $menuId) {
                $canView = false;
                $canCreate = false;
                $canEdit = false;
                $canDelete = false;
                $canApproval = false;

                if ($slug === 'super_admin') {
                    $canView = true;
                    $canCreate = true;
                    $canEdit = true;
                    $canDelete = true;
                    $canApproval = true;
                } elseif ($slug === 'maker' && isset($makerPermissions[$menuSlug])) {
                    $canView = $makerPermissions[$menuSlug]['view'] ?? false;
                    $canCreate = $makerPermissions[$menuSlug]['create'] ?? false;
                    $canEdit = $makerPermissions[$menuSlug]['edit'] ?? false;
                } elseif ($slug === 'approval_crs' && isset($crsPermissions[$menuSlug])) {
                    $canView = $crsPermissions[$menuSlug]['view'] ?? false;
                    $canApproval = $crsPermissions[$menuSlug]['approval'] ?? false;
                } elseif ($slug === 'approval_pja' && isset($pjaPermissions[$menuSlug])) {
                    $canView = $pjaPermissions[$menuSlug]['view'] ?? false;
                    $canApproval = $pjaPermissions[$menuSlug]['approval'] ?? false;
                }

                // If any permission is true, insert or update the record
                if ($canView || $canCreate || $canEdit || $canDelete || $canApproval) {
                    DB::table('aims_permissions')->updateOrInsert(
                        ['role_id' => $roleId, 'menu_id' => $menuId],
                        [
                            'can_view' => $canView,
                            'can_create' => $canCreate,
                            'can_edit' => $canEdit,
                            'can_delete' => $canDelete,
                            'can_approval' => $canApproval,
                            'updated_at' => now(),
                        ]
                    );
                }
            }
        }

        // 5. Seed Taxonomy Classification default data (document_system_modules)
        $existingModuleDS = DB::table('document_system_modules')->where('index', 'SO')->first();
        if ($existingModuleDS) {
            $m1 = $existingModuleDS->id;
        } else {
            $m1 = \Illuminate\Support\Str::uuid()->toString();
            DB::table('document_system_modules')->insert([
                'id' => $m1,
                'index' => 'SO',
                'name' => 'Safety Operations',
                'has_document_number' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $existingCategoryDS = DB::table('document_system_categories')->where('index', 'SOP-K3')->first();
        if ($existingCategoryDS) {
            $c1 = $existingCategoryDS->id;
        } else {
            $c1 = \Illuminate\Support\Str::uuid()->toString();
            DB::table('document_system_categories')->insert([
                'id' => $c1,
                'module_id' => $m1,
                'index' => 'SOP-K3',
                'name' => 'SOP K3',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $existingMappingDS = DB::table('document_system_mappings')->where('index', 'WAH')->first();
        if (!$existingMappingDS) {
            DB::table('document_system_mappings')->insert([
                'id' => \Illuminate\Support\Str::uuid()->toString(),
                'category_id' => $c1,
                'index' => 'WAH',
                'name' => 'Bekerja di Ketinggian (Working at Heights)',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
