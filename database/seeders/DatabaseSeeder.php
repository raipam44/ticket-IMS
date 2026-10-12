<?php

namespace Database\Seeders;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $demo = User::firstOrCreate(
            ['email' => 'demo@helpdesk.test'],
            ['name' => 'Demo User', 'password' => Hash::make('Demo@12345')]
        );

        if ($demo->tickets()->count() === 0) {
            Ticket::factory()->count(15)->for($demo)->create();
        }
    }
}
