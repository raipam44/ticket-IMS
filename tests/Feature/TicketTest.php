<?php

use App\Models\Ticket;
use App\Models\User;

// ── Guest redirects ───────────────────────────────────────────────────────────

test('guest is redirected to login on tickets index', function () {
    $this->get('/tickets')->assertRedirect('/login');
});

test('guest is redirected to login on ticket create', function () {
    $this->get('/tickets/create')->assertRedirect('/login');
});

test('guest is redirected to login on ticket show', function () {
    $ticket = Ticket::factory()->for(User::factory())->create();
    $this->get("/tickets/{$ticket->id}")->assertRedirect('/login');
});

// ── Index ─────────────────────────────────────────────────────────────────────

test('user sees only their own tickets on the index', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();

    $mine   = Ticket::factory()->for($owner)->create(['title' => 'My printer is broken']);
    $theirs = Ticket::factory()->for($other)->create(['title' => 'Their network is down']);

    $response = $this->actingAs($owner)->get('/tickets');

    $response->assertOk();
    $response->assertSee('My printer is broken');
    $response->assertDontSee('Their network is down');
});

test('index paginates at 10 tickets', function () {
    $user = User::factory()->create();
    Ticket::factory()->count(15)->for($user)->create();

    $this->actingAs($user)->get('/tickets')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Tickets/Index')
            ->where('tickets.total', 15)
            ->has('tickets.data', 10)
        );
});

// ── Create ────────────────────────────────────────────────────────────────────

test('authenticated user can view the create form', function () {
    $this->actingAs(User::factory()->create())
        ->get('/tickets/create')
        ->assertOk();
});

test('user can create a ticket with valid data', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post('/tickets', [
        'title'       => 'Printer jams on floor 2',
        'description' => 'The shared printer jams every morning on floor 2.',
        'priority'    => 'High',
        'status'      => 'Open',
        'category'    => 'Hardware',
    ])->assertRedirect('/tickets');

    $this->assertDatabaseHas('tickets', [
        'title'   => 'Printer jams on floor 2',
        'user_id' => $user->id,
    ]);
});

test('ticket creation fails when title is too short', function () {
    $this->actingAs(User::factory()->create())
        ->post('/tickets', [
            'title'       => 'Hi',
            'description' => 'This is a long enough description.',
            'priority'    => 'Low',
            'status'      => 'Open',
            'category'    => 'Software',
        ])->assertSessionHasErrors('title');
});

test('ticket creation fails when description is too short', function () {
    $this->actingAs(User::factory()->create())
        ->post('/tickets', [
            'title'       => 'Valid title here',
            'description' => 'Short',
            'priority'    => 'Low',
            'status'      => 'Open',
            'category'    => 'Software',
        ])->assertSessionHasErrors('description');
});

test('ticket creation fails with invalid priority', function () {
    $this->actingAs(User::factory()->create())
        ->post('/tickets', [
            'title'       => 'Valid title here',
            'description' => 'Long enough description here.',
            'priority'    => 'SuperUrgent',
            'status'      => 'Open',
            'category'    => 'Hardware',
        ])->assertSessionHasErrors('priority');
});

test('user_id cannot be overridden from request body', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();

    $this->actingAs($owner)->post('/tickets', [
        'title'       => 'Printer broken',
        'description' => 'Paper jam on floor 2 near the window.',
        'priority'    => 'High',
        'status'      => 'Open',
        'category'    => 'Hardware',
        'user_id'     => $other->id, // attacker injection attempt
    ]);

    $this->assertDatabaseHas('tickets', [
        'title'   => 'Printer broken',
        'user_id' => $owner->id, // must be the authenticated user
    ]);
    $this->assertDatabaseMissing('tickets', [
        'title'   => 'Printer broken',
        'user_id' => $other->id,
    ]);
});

// ── Show ──────────────────────────────────────────────────────────────────────

test('owner can view their own ticket', function () {
    $user   = User::factory()->create();
    $ticket = Ticket::factory()->for($user)->create(['title' => 'My network ticket']);

    $this->actingAs($user)
        ->get("/tickets/{$ticket->id}")
        ->assertOk()
        ->assertSee('My network ticket');
});

test('user cannot view another users ticket — returns 403', function () {
    $owner  = User::factory()->create();
    $other  = User::factory()->create();
    $ticket = Ticket::factory()->for($owner)->create();

    $this->actingAs($other)
        ->get("/tickets/{$ticket->id}")
        ->assertForbidden();
});

// ── Edit / Update ─────────────────────────────────────────────────────────────

test('owner can view the edit form', function () {
    $user   = User::factory()->create();
    $ticket = Ticket::factory()->for($user)->create();

    $this->actingAs($user)
        ->get("/tickets/{$ticket->id}/edit")
        ->assertOk();
});

test('other user cannot view edit form — returns 403', function () {
    $owner  = User::factory()->create();
    $other  = User::factory()->create();
    $ticket = Ticket::factory()->for($owner)->create();

    $this->actingAs($other)
        ->get("/tickets/{$ticket->id}/edit")
        ->assertForbidden();
});

test('owner can update their ticket', function () {
    $user   = User::factory()->create();
    $ticket = Ticket::factory()->for($user)->create(['status' => 'Open']);

    $this->actingAs($user)->put("/tickets/{$ticket->id}", [
        'title'       => $ticket->title,
        'description' => $ticket->description,
        'priority'    => $ticket->priority,
        'status'      => 'Resolved',
        'category'    => $ticket->category,
    ])->assertRedirect("/tickets/{$ticket->id}");

    expect($ticket->fresh()->status)->toBe('Resolved');
});

test('other user cannot update a ticket — returns 403', function () {
    $owner  = User::factory()->create();
    $other  = User::factory()->create();
    $ticket = Ticket::factory()->for($owner)->create(['status' => 'Open']);

    $this->actingAs($other)->put("/tickets/{$ticket->id}", [
        'title'       => $ticket->title,
        'description' => $ticket->description,
        'priority'    => $ticket->priority,
        'status'      => 'Closed',
        'category'    => $ticket->category,
    ])->assertForbidden();

    expect($ticket->fresh()->status)->toBe('Open'); // unchanged
});

// ── Delete ────────────────────────────────────────────────────────────────────

test('owner can delete their ticket', function () {
    $user   = User::factory()->create();
    $ticket = Ticket::factory()->for($user)->create();

    $this->actingAs($user)
        ->delete("/tickets/{$ticket->id}")
        ->assertRedirect('/tickets');

    $this->assertDatabaseMissing('tickets', ['id' => $ticket->id]);
});

test('other user cannot delete a ticket — returns 403', function () {
    $owner  = User::factory()->create();
    $other  = User::factory()->create();
    $ticket = Ticket::factory()->for($owner)->create();

    $this->actingAs($other)
        ->delete("/tickets/{$ticket->id}")
        ->assertForbidden();

    $this->assertDatabaseHas('tickets', ['id' => $ticket->id]); // still exists
});

// ── Flash messages ────────────────────────────────────────────────────────────

test('flash message is set after ticket creation', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post('/tickets', [
        'title'       => 'Flash test ticket',
        'description' => 'Testing that flash messages work correctly.',
        'priority'    => 'Low',
        'status'      => 'Open',
        'category'    => 'Other',
    ])->assertSessionHas('success', 'Ticket created.');
});

test('flash message is set after ticket update', function () {
    $user   = User::factory()->create();
    $ticket = Ticket::factory()->for($user)->create();

    $this->actingAs($user)->put("/tickets/{$ticket->id}", [
        'title'       => $ticket->title,
        'description' => $ticket->description,
        'priority'    => $ticket->priority,
        'status'      => $ticket->status,
        'category'    => $ticket->category,
    ])->assertSessionHas('success', 'Ticket updated.');
});

test('flash message is set after ticket deletion', function () {
    $user   = User::factory()->create();
    $ticket = Ticket::factory()->for($user)->create();

    $this->actingAs($user)
        ->delete("/tickets/{$ticket->id}")
        ->assertSessionHas('success', 'Ticket deleted.');
});
