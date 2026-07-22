<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckModulePermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $moduleSlug  slug of the module (e.g. 'document-system')
     * @param  string|null  $permissionType  action permission (can_view, can_create, can_edit, can_delete, can_approval)
     * @param  string|null  $menuSlug  slug of the specific menu inside the module
     */
    public function handle(Request $request, Closure $next, string $moduleSlug, ?string $permissionType = 'can_view', ?string $menuSlug = null): Response
    {
        $user = $request->user() ?? Auth::guard('admin')->user() ?? Auth::guard('web')->user();

        // 1. Check if user is authenticated
        if (!$user) {
            return redirect()->route('login');
        }

        // 2. Super admin & system admin get bypass access
        if (in_array($user->role, ['super_admin', 'system_admin'])) {
            return $next($request);
        }

        // 3. Query RBAC permissions checking aims_user_roles, aims_roles, aims_modules, aims_menus, aims_permissions
        $hasPermission = \Cache::remember("user.{$user->id}.perms.{$moduleSlug}.{$menuSlug}.{$permissionType}", 300, function () use ($user, $moduleSlug, $menuSlug, $permissionType) {
            $query = \DB::table('aims_user_roles')
                ->join('aims_roles', 'aims_user_roles.role_id', '=', 'aims_roles.id')
                ->join('aims_modules', 'aims_roles.module_id', '=', 'aims_modules.id')
                ->join('aims_permissions', 'aims_roles.id', '=', 'aims_permissions.role_id')
                ->join('aims_menus', 'aims_permissions.menu_id', '=', 'aims_menus.id')
                ->where('aims_user_roles.user_id', $user->id)
                ->where('aims_modules.slug', $moduleSlug);

            if ($menuSlug) {
                $query->where('aims_menus.slug', $menuSlug);
            }

            // check column boolean e.g. can_view = 1
            $query->where("aims_permissions.{$permissionType}", 1);

            return $query->exists();
        });

        if (!$hasPermission) {
            abort(403, 'Unauthorized. Anda tidak memiliki akses untuk modul atau aksi ini.');
        }

        return $next($request);
    }
}
