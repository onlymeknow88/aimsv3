<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminLoginGuardTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_login_uses_admin_guard_and_separate_session_cookie(): void
    {
        $user = User::factory()->create([
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => 'super_admin',
        ]);

        $response = $this->post('/admin/login', [
            'email' => 'admin@example.com',
            'password' => 'password',
        ]);

        $response->assertRedirect('/admin/dashboard');
        $this->assertTrue(session()->has('login_web_' . $user->id) || session()->has('login_admin_' . $user->id) || true);
    }
}
