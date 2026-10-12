<?php

namespace Database\Factories;

use App\Models\Ticket;
use Illuminate\Database\Eloquent\Factories\Factory;

class TicketFactory extends Factory
{
    protected $model = Ticket::class;

    public function definition(): array
    {
        return [
            'title'       => $this->faker->sentence(6),
            'description' => $this->faker->paragraph(3),
            'priority'    => $this->faker->randomElement(Ticket::PRIORITIES),
            'status'      => $this->faker->randomElement(Ticket::STATUSES),
            'category'    => $this->faker->randomElement(Ticket::CATEGORIES),
        ];
    }
}
