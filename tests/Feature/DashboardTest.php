<?php

use App\Models\Ticket;
use App\Models\User;

test('guest is redirected to login from dashboard', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});

test('authenticated user can access dashboard', function () {
    $this->actingAs(User::factory()->create())
        ->get('/dashboard')
        ->assertOk();
});

test('dashboard shows correct status counts', function () {
    $user = User::factory()->create();

    Ticket::factory()->for($user)->count(3)->create(['status' => 'Open']);
    Ticket::factory()->for($user)->count(2)->create(['status' => 'In Progress']);
    Ticket::factory()->for($user)->count(1)->create(['status' => 'Resolved']);

    $this->actingAs($user)->get('/dashboard')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->where('counts.Open', 3)
            ->where('counts.In Progress', 2)
            ->where('counts.Resolved', 1)
        );
});

test('dashboard only counts the authenticated users tickets', function () {
    $user  = User::factory()->create();
    $other = User::factory()->create();

    Ticket::factory()->for($user)->count(2)->create(['status' => 'Open']);
    Ticket::factory()->for($other)->count(5)->create(['status' => 'Open']);

    $this->actingAs($user)->get('/dashboard')
        ->assertInertia(fn ($page) => $page
            ->where('counts.Open', 2) // not 7
        );
});

test('dashboard shows at most 5 recent tickets', function () {
    $user = User::factory()->create();
    Ticket::factory()->for($user)->count(10)->create();

    $this->actingAs($user)->get('/dashboard')
        ->assertInertia(fn ($page) => $page
            ->has('recent', 5)
        );
});
