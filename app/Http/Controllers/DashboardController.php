<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $counts = $request->user()->tickets()
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $recent = $request->user()->tickets()
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard', [
            'counts' => $counts,
            'recent' => $recent,
        ]);
    }
}
