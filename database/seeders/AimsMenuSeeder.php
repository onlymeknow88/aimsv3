<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AimsMenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $module = DB::table('aims_modules')->where('slug', 'document-system')->first();

        if (! $module) {
            return;
        }

        $menus = [
            ['name' => 'Dashboard', 'slug' => 'doc.dashboard', 'parent_slug' => null],
            ['name' => 'Standard Documents', 'slug' => 'doc', 'parent_slug' => null],
            ['name' => 'Active Document', 'slug' => 'doc.maker', 'parent_slug' => 'doc'],
            ['name' => 'Document On Review', 'slug' => 'doc.ongoing', 'parent_slug' => 'doc'],
            ['name' => 'Obsolete Document', 'slug' => 'doc.obsolete', 'parent_slug' => 'doc'],
            ['name' => 'Draft', 'slug' => 'doc.draft', 'parent_slug' => 'doc'],
            ['name' => 'Approval', 'slug' => 'doc.approval', 'parent_slug' => null],
            ['name' => 'JSA', 'slug' => 'jsa', 'parent_slug' => null],
            ['name' => 'Active JSA', 'slug' => 'doc.jsa', 'parent_slug' => 'jsa'],
            ['name' => 'Obsolete JSA', 'slug' => 'doc.jsa.obsolete', 'parent_slug' => 'jsa'],
            ['name' => 'Draft JSA', 'slug' => 'doc.jsa.draft', 'parent_slug' => 'jsa'],
            ['name' => 'Permit To Work (PTW)', 'slug' => 'doc.ptw.parent', 'parent_slug' => null],
            ['name' => 'Active PTW', 'slug' => 'doc.ptw', 'parent_slug' => 'doc.ptw.parent'],
            ['name' => 'Master Data', 'slug' => 'doc.master', 'parent_slug' => null],
        ];

        $menuIds = [];

        foreach ($menus as $index => $menu) {
            $existing = DB::table('aims_menus')->where('slug', $menu['slug'])->first();

            if ($existing) {
                DB::table('aims_menus')->where('id', $existing->id)->update([
                    'module_id' => $module->id,
                    'name' => $menu['name'],
                    'order_by' => $index + 1,
                    'updated_at' => now(),
                ]);
                $menuIds[$menu['slug']] = $existing->id;
            } else {
                $menuIds[$menu['slug']] = DB::table('aims_menus')->insertGetId([
                    'module_id' => $module->id,
                    'name' => $menu['name'],
                    'slug' => $menu['slug'],
                    'order_by' => $index + 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        foreach ($menus as $menu) {
            if ($menu['parent_slug'] && isset($menuIds[$menu['parent_slug']])) {
                DB::table('aims_menus')
                    ->where('id', $menuIds[$menu['slug']])
                    ->update(['parent_id' => $menuIds[$menu['parent_slug']]]);
            } else {
                DB::table('aims_menus')
                    ->where('id', $menuIds[$menu['slug']])
                    ->update(['parent_id' => null]);
            }
        }
    }
}
