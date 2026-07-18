<?php
require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\DB;

$email = 'fadjri.wivindi@alamtri.com';
$user = User::where('email', $email)->first();

if (! $user) {
    echo "NO_USER\n";
    exit(0);
}

echo "USER_ID=" . $user->id . "\n";
$roles = DB::table('aims_user_roles')->where('user_id', $user->id)->pluck('role_id')->toArray();
echo "ROLE_IDS=" . implode(',', $roles) . "\n";
foreach ($roles as $rid) {
    $role = DB::table('aims_roles')->find($rid);
    echo "ROLE=" . ($role ? $role->slug : '?') . " (id=" . $rid . ")\n";
}

$menu = DB::table('aims_menus')->where('slug', 'doc.dashboard')->first();
if (! $menu) {
    echo "NO_MENU\n";
    exit(0);
}

echo "MENU_ID=" . $menu->id . "\n";
foreach ($roles as $rid) {
    $perm = DB::table('aims_permissions')->where('role_id', $rid)->where('menu_id', $menu->id)->first();
    echo "PERM for role " . $rid . ": " . json_encode($perm) . "\n";
}
