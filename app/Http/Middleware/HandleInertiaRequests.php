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

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'modules' => $allowedModules,
            ],
            'flsMenus' => $flsMenus,
        ];
    }
}
