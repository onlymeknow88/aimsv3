<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="csrf-token" content="{{ csrf_token() }}">
        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @php
            $component = $page['component'];
            $parts = explode('/', $component);
            $moduleName = $parts[0];
            $modulePath = base_path("Modules/{$moduleName}");
            if (count($parts) > 1 && file_exists($modulePath)) {
                $relativePath = implode('/', array_slice($parts, 1));
                $viteAsset = "Modules/{$moduleName}/resources/js/Pages/{$relativePath}.jsx";
            } else {
                $viteAsset = "resources/js/Pages/{$component}.jsx";
            }
        @endphp
        @vite([
            'resources/js/app.jsx',
            $viteAsset
        ])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
