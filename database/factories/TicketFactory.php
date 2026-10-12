<?php

namespace Database\Factories;

use App\Models\Ticket;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Ticket>
 */
class TicketFactory extends Factory
{
    protected $model = Ticket::class;

    public function definition(): array
    {
        $faker = $this->faker;

        return [
            'title'       => $faker ? substr($faker->sentence(6), 0, 255) : 'Sample ticket ' . uniqid(),
            'description' => $faker ? $faker->paragraph(3) : 'Sample ticket description for demonstration.',
            'priority'    => $faker ? $faker->randomElement(Ticket::PRIORITIES) : Ticket::PRIORITIES[array_rand(Ticket::PRIORITIES)],
            'status'      => $faker ? $faker->randomElement(Ticket::STATUSES) : Ticket::STATUSES[array_rand(Ticket::STATUSES)],
            'category'    => $faker ? $faker->randomElement(Ticket::CATEGORIES) : Ticket::CATEGORIES[array_rand(Ticket::CATEGORIES)],
        ];
    }
}
