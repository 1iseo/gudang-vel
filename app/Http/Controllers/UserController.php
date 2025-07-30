<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends \Illuminate\Routing\Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;

    public function __construct()
    {
        $this->authorizeResource(User::class, 'user');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('user/index', [
            'users' => User::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            // 'email' => 'required|string|email|max:255|unique:users',
            'username' => 'required|string|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => ['required', Rule::in(['admin', 'pegawai'])],
        ]);

        if (auth()->user()->role === 'admin' && $validated['role'] === 'admin') {
            abort(403);
        }

        User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            // 'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return redirect()->route('users.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        // Not used
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        // Handled by frontend modal
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => ['required', 'string', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role' => ['required', Rule::in(['admin', 'pegawai'])],
            'password' => 'nullable|string|min:8',
        ]);

        if (auth()->user()->role === 'admin' && $validated['role'] === 'admin') {
            abort(4.3);
        }

        $user->name = $validated['name'];
        $user->username = $validated['username'];
        // $user->email = $validated['email'];
        $user->role = $validated['role'];

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return redirect()->route('users.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Don't delete current logged 
        if ($user->email === auth()->user()->email) {
            return redirect()->route('users.index')->with('error', 'Cannot delete the currently logged-in user.');
        }

        $user->delete();

        return redirect()->route('users.index');
    }
}
