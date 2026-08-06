<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $allowedModules = [];

        if ($user) {
            if (isset($user->role) && $user->role === 'super_admin') {
                $allowedModules = ['*'];
            } else {
                $allowedModules = \DB::table('aims_user_roles')
                    ->join('aims_roles', 'aims_user_roles.role_id', '=', 'aims_roles.id')
                    ->join('aims_modules', 'aims_roles.module_id', '=', 'aims_modules.id')
                    ->join('aims_permissions', 'aims_roles.id', '=', 'aims_permissions.role_id')
                    ->where('aims_user_roles.user_id', $user->id)
                    ->where('aims_permissions.can_view', 1)
                    ->distinct()
                    ->pluck('aims_modules.slug')
                    ->toArray();
            }
        }

        // FLS menus — hanya di-load untuk halaman field-leadership
        $flsMenus = [];
        if ($request->is('field-leadership*')) {
            $moduleId = \DB::table('aims_modules')->where('slug', 'field-leadership')->value('id');
            if ($moduleId) {
                $flsMenus = \DB::table('aims_menus')
                    ->where('module_id', $moduleId)
                    ->orderBy('parent_id')
                    ->orderBy('order_by')
                    ->get()
                    ->toArray();
            }
        }

        // CSMS menus — hanya di-load untuk halaman csms
        $csmsMenus = [];
        if ($request->is('csms*')) {
            $moduleId = \DB::table('aims_modules')->where('slug', 'csms')->value('id');
            if ($moduleId) {
                $csmsMenus = \DB::table('aims_menus')
                    ->where('module_id', $moduleId)
                    ->orderBy('parent_id')
                    ->orderBy('order_by')
                    ->get()
                    ->toArray();
            }
        }

        // PICA menus — hanya di-load untuk halaman pica
        $picaMenus = [];
        if ($request->is('pica*')) {
            $moduleId = \DB::table('aims_modules')->where('slug', 'pica')->value('id');
            if ($moduleId) {
                $picaMenus = \DB::table('aims_menus')
                    ->where('module_id', $moduleId)
                    ->orderBy('parent_id')
                    ->orderBy('order_by')
                    ->get()
                    ->toArray();
            }
        }

        // Document System menus — hanya di-load untuk halaman document-system
        $dsMenus = [];
        if ($request->is('document-system*') && $user) {
            $moduleId = \DB::table('aims_modules')->where('slug', 'document-system')->value('id');
            if ($moduleId) {
                if (in_array($user->role, ['super_admin', 'system_admin'])) {
                    $dsMenus = \DB::table('aims_menus')
                        ->where('module_id', $moduleId)
                        ->orderBy('parent_id')
                        ->orderBy('order_by')
                        ->get()
                        ->toArray();
                } else {
                    // Get menus where user has can_view permission
                    $allowedMenuIds = \DB::table('aims_user_roles')
                        ->join('aims_roles', 'aims_user_roles.role_id', '=', 'aims_roles.id')
                        ->join('aims_permissions', 'aims_roles.id', '=', 'aims_permissions.role_id')
                        ->where('aims_user_roles.user_id', $user->id)
                        ->where('aims_roles.module_id', $moduleId)
                        ->where('aims_permissions.can_view', 1)
                        ->distinct()
                        ->pluck('aims_permissions.menu_id')
                        ->toArray();

                    // Fetch the allowed menus
                    $menus = \DB::table('aims_menus')
                        ->where('module_id', $moduleId)
                        ->whereIn('id', $allowedMenuIds)
                        ->get()
                        ->toArray();

                    // Also include parent menus of allowed child menus if not already present
                    $parentIds = collect($menus)->pluck('parent_id')->filter()->unique()->toArray();
                    $allAllowedIds = array_unique(array_merge($allowedMenuIds, $parentIds));

                    $dsMenus = \DB::table('aims_menus')
                        ->where('module_id', $moduleId)
                        ->whereIn('id', $allAllowedIds)
                        ->orderBy('parent_id')
                        ->orderBy('order_by')
                        ->get()
                        ->toArray();
                }
            }
        }

        // Dashboard Portal menus — hanya di-load untuk halaman dashboard-portal
        $dpMenus = [];
        if ($request->is('dashboard-portal*') && $user) {
            $moduleId = \DB::table('aims_modules')->where('slug', 'dashboard-portal')->value('id');
            if ($moduleId) {
                if (in_array($user->role, ['super_admin', 'system_admin'])) {
                    $dpMenus = \DB::table('aims_menus')
                        ->where('module_id', $moduleId)
                        ->orderBy('parent_id')
                        ->orderBy('order_by')
                        ->get()
                        ->toArray();
                } else {
                    $allowedMenuIds = \DB::table('aims_user_roles')
                        ->join('aims_roles', 'aims_user_roles.role_id', '=', 'aims_roles.id')
                        ->join('aims_permissions', 'aims_roles.id', '=', 'aims_permissions.role_id')
                        ->where('aims_user_roles.user_id', $user->id)
                        ->where('aims_roles.module_id', $moduleId)
                        ->where('aims_permissions.can_view', 1)
                        ->distinct()
                        ->pluck('aims_permissions.menu_id')
                        ->toArray();

                    $menus = \DB::table('aims_menus')
                        ->where('module_id', $moduleId)
                        ->whereIn('id', $allowedMenuIds)
                        ->get()
                        ->toArray();

                    $parentIds = collect($menus)->pluck('parent_id')->filter()->unique()->toArray();
                    $allAllowedIds = array_unique(array_merge($allowedMenuIds, $parentIds));

                    $dpMenus = \DB::table('aims_menus')
                        ->where('module_id', $moduleId)
                        ->whereIn('id', $allAllowedIds)
                        ->orderBy('parent_id')
                        ->orderBy('order_by')
                        ->get()
                        ->toArray();
                }
            }
        }

        // CoE menus — hanya di-load untuk halaman coe
        $coeMenus = [];
        if ($request->is('coe*') && $user) {
            $moduleId = \DB::table('aims_modules')->where('slug', 'calender-of-event-coe')->value('id');
            if ($moduleId) {
                if (in_array($user->role, ['super_admin', 'system_admin'])) {
                    $coeMenus = \DB::table('aims_menus')
                        ->where('module_id', $moduleId)
                        ->orderBy('parent_id')
                        ->orderBy('order_by')
                        ->get()
                        ->toArray();
                } else {
                    $allowedMenuIds = \DB::table('aims_user_roles')
                        ->join('aims_roles', 'aims_user_roles.role_id', '=', 'aims_roles.id')
                        ->join('aims_permissions', 'aims_roles.id', '=', 'aims_permissions.role_id')
                        ->where('aims_user_roles.user_id', $user->id)
                        ->where('aims_roles.module_id', $moduleId)
                        ->where('aims_permissions.can_view', 1)
                        ->distinct()
                        ->pluck('aims_permissions.menu_id')
                        ->toArray();

                    $menus = \DB::table('aims_menus')
                        ->where('module_id', $moduleId)
                        ->whereIn('id', $allowedMenuIds)
                        ->get()
                        ->toArray();

                    $parentIds = collect($menus)->pluck('parent_id')->filter()->unique()->toArray();
                    $allAllowedIds = array_unique(array_merge($allowedMenuIds, $parentIds));

                    $coeMenus = \DB::table('aims_menus')
                        ->where('module_id', $moduleId)
                        ->whereIn('id', $allAllowedIds)
                        ->orderBy('parent_id')
                        ->orderBy('order_by')
                        ->get()
                        ->toArray();
                }
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'modules' => $allowedModules,
                'roles' => $user ? \DB::table('aims_user_roles')
                    ->join('aims_roles', 'aims_user_roles.role_id', '=', 'aims_roles.id')
                    ->where('aims_user_roles.user_id', $user->id)
                    ->pluck('aims_roles.slug')
                    ->toArray() : [],
            ],
            'flsMenus'  => $flsMenus,
            'csmsMenus' => $csmsMenus,
            'picaMenus' => $picaMenus,
            'dsMenus'   => $dsMenus,
            'dpMenus'   => $dpMenus,
            'coeMenus'  => $coeMenus,
        ];
    }
}
