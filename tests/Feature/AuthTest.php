<?php

use App\Models\User;

// ── Registration ─────────────────────────────────────────────────────────────

test('registration page is accessible to guests', function () {
    $this->get('/register')->assertOk();
});

test('user can register with valid data', function () {
    $this->post('/register', [
        'name'                  => 'Alice Smith',
        'email'                 => 'alice@example.com',
        'password'              => 'Password1!',
        'password_confirmation' => 'Password1!',
    ])->assertRedirect('/dashboard');

    $this->assertDatabaseHas('users', ['email' => 'alice@example.com']);
});

test('registration fails with duplicate email', function () {
    User::factory()->create(['email' => 'alice@example.com']);

    $this->post('/register', [
        'name'                  => 'Alice Clone',
        'email'                 => 'alice@example.com',
        'password'              => 'Password1!',
        'password_confirmation' => 'Password1!',
    ])->assertSessionHasErrors('email');
});

test('registration fails with mismatched passwords', function () {
    $this->post('/register', [
        'name'                  => 'Bob',
        'email'                 => 'bob@example.com',
        'password'              => 'Password1!',
        'password_confirmation' => 'different',
    ])->assertSessionHasErrors('password');
});

test('password is stored hashed not plaintext', function () {
    $this->post('/register', [
        'name'                  => 'Charlie',
        'email'                 => 'charlie@example.com',
        'password'              => 'Password1!',
        'password_confirmation' => 'Password1!',
    ]);

    $user = User::where('email', 'charlie@example.com')->first();
    expect($user->password)->not->toBe('Password1!');
    expect(password_verify('Password1!', $user->password))->toBeTrue();
});

// ── Login ─────────────────────────────────────────────────────────────────────

test('login page is accessible to guests', function () {
    $this->get('/login')->assertOk();
});

test('user can log in with valid credentials', function () {
    $user = User::factory()->create();

    $this->post('/login', [
        'email'    => $user->email,
        'password' => 'password', // UserFactory default
    ])->assertRedirect('/dashboard');

    $this->assertAuthenticatedAs($user);
});

test('login fails with wrong password', function () {
    $user = User::factory()->create();

    $this->post('/login', [
        'email'    => $user->email,
        'password' => 'wrong-password',
    ])->assertSessionHasErrors('email');
});

test('user can log out', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/logout')
        ->assertRedirect('/');

    $this->assertGuest();
});
