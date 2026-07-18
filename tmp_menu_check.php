<?php
require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$menus = DB::table('aims_menus')->where('slug', 'like', 'doc.%')->get();
if ($menus->isEmpty()) {
    echo "NO_DOC_MENUS\n";
    exit(0);
}
foreach ($menus as $m) {
    echo $m->id . ' | ' . $m->slug . ' | ' . $m->name . ' | module=' . $m->module_id . '\n';
}
