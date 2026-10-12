<?php

namespace App\Providers;

use App\Models\Ticket;
use App\Policies\TicketPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Force HTTPS scheme in production (needed for Railway/proxy deployments)
        if (app()->environment('production')) {
            URL::forceScheme('https');
        }

        // Explicitly register the policy (auto-discovery fallback)
        Gate::policy(Ticket::class, TicketPolicy::class);
    }
}
