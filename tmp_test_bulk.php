<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$controller = new App\Http\Controllers\RolePermissionController();
$req = Illuminate\Http\Request::create('/admin/role-permissions/bulk-update','POST',[
    'changes' => [
        [
            'role_id' => 4,
            'menu_id' => 5,
            'field' => 'can_view',
            'value' => true
        ]
    ]
]);
$res = $controller->bulkUpdate($req);
if (is_object($res) && method_exists($res,'getStatusCode')) {
    echo $res->getStatusCode() . "\n";
    echo $res->getContent() . "\n";
} else {
    var_dump($res);
}
