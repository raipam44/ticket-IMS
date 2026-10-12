<?php

namespace App\Http\Requests;

use App\Models\Ticket;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'       => ['required', 'string', 'min:5', 'max:255'],
            'description' => ['required', 'string', 'min:10'],
            'priority'    => ['required', Rule::in(Ticket::PRIORITIES)],
            'status'      => ['required', Rule::in(Ticket::STATUSES)],
            'category'    => ['required', Rule::in(Ticket::CATEGORIES)],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'       => 'Enter a title for the ticket.',
            'title.min'            => 'The title needs at least 5 characters.',
            'title.max'            => 'The title can be at most 255 characters.',
            'description.required' => 'Describe the problem so it can be fixed.',
            'description.min'      => 'The description needs at least 10 characters.',
            'priority.required'    => 'Choose Low, Medium, High, or Urgent.',
            'priority.in'          => 'Choose Low, Medium, High, or Urgent.',
            'status.required'      => 'Choose Open, In Progress, Resolved, or Closed.',
            'status.in'            => 'Choose Open, In Progress, Resolved, or Closed.',
            'category.required'    => 'Choose a category.',
            'category.in'          => 'Choose one of the listed categories.',
        ];
    }
}
