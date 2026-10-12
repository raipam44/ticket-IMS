<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory;

    public const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
    public const STATUSES   = ['Open', 'In Progress', 'Resolved', 'Closed'];
    public const CATEGORIES = ['Hardware', 'Software', 'Network', 'Account', 'Other'];

    /**
     * user_id is intentionally NOT fillable — set via relationship.
     */
    protected $fillable = ['title', 'description', 'priority', 'status', 'category'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
