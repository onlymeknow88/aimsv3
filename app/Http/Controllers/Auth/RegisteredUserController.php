<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use App\Traits\SendsEmail;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class RegisteredUserController extends Controller
{
    use SendsEmail;

    /**
     * Display the registration view.
     */
    public function create(): InertiaResponse
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_active' => false,
        ]);

        event(new Registered($user));

        // Generate signed URLs for admin approval
        $approveUrl = URL::temporarySignedRoute(
            'registration.approve',
            now()->addHours(72),
            ['id' => $user->id]
        );

        $rejectUrl = URL::temporarySignedRoute(
            'registration.reject',
            now()->addHours(72),
            ['id' => $user->id]
        );

        // Log the URLs in local development for easy access
        if (config('app.env') === 'local') {
            \Log::info("Local Dev - Tautan Registrasi Baru ({$user->name}):\n" .
                       "Setujui: {$approveUrl}\n" .
                       "Tolak: {$rejectUrl}");
        }

        // Send email notification to Super Admin
        $adminEmails = User::where('role', 'super_admin')
            ->where('is_active', true)
            ->pluck('email')
            ->toArray();

        if (!empty($adminEmails)) {
            $this->sendEmailWithTemplate(
                'emails.registration-pending',
                [
                    'user' => $user,
                    'approveUrl' => $approveUrl,
                    'rejectUrl' => $rejectUrl,
                ],
                $adminEmails,
                '[AIMS] Registrasi Baru Menunggu Persetujuan'
            );
        } else {
            \Log::warning('Registration pending email not sent: No active super_admin found.');
        }

        return Inertia::render('Auth/PendingApproval', [
            'message' => 'Akun Anda berhasil didaftarkan dan sedang menunggu persetujuan administrator. Anda akan menerima email pemberitahuan setelah akun disetujui.',
        ]);
    }
}
