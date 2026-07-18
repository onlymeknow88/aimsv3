<?php

namespace Tests\Feature;

use Tests\TestCase;

class AdminSessionIsolationTest extends TestCase
{
    public function test_admin_routes_use_separate_session_cookie_middleware(): void
    {
        $router = $this->app['router'];

        $adminLoginRoute = $router->getRoutes()->getByName('admin.login');
        $adminDashboardRoute = $router->getRoutes()->getByName('admin.dashboard');

        $this->assertNotNull($adminLoginRoute);
        $this->assertNotNull($adminDashboardRoute);

        $this->assertContains('admin.session', $adminLoginRoute->gatherMiddleware());
        $this->assertContains('admin.session', $adminDashboardRoute->gatherMiddleware());
    }
}
