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
        // 1. Primary Demo User
        $demo = User::firstOrCreate(
            ['email' => 'demo@helpdesk.test'],
            [
                'name'              => 'Demo User',
                'password'          => Hash::make('Demo@12345'),
                'email_verified_at' => now(),
            ]
        );

        // 2. Secondary Demo User (for verifying authorization and cross-account isolation)
        $jane = User::firstOrCreate(
            ['email' => 'jane@helpdesk.test'],
            [
                'name'              => 'Jane Smith',
                'password'          => Hash::make('Demo@12345'),
                'email_verified_at' => now(),
            ]
        );

        // 3. Seed realistic tickets for Demo User
        if ($demo->tickets()->count() === 0) {
            $demoTickets = [
                [
                    'title'       => 'Dual monitor setup flickering via HDMI dock',
                    'description' => 'The secondary Dell 27-inch monitor intermittently turns black for 2-3 seconds every hour when connected through the CalDigit Thunderbolt dock.',
                    'category'    => 'Hardware',
                    'priority'    => 'Medium',
                    'status'      => 'Open',
                    'created_at'  => now()->subHours(3),
                    'updated_at'  => now()->subHours(3),
                ],
                [
                    'title'       => 'VPN connection repeatedly disconnects during Zoom calls',
                    'description' => 'GlobalProtect VPN drops connection every 20-30 minutes, interrupting team meetings. Tested on both Wi-Fi and ethernet.',
                    'category'    => 'Network',
                    'priority'    => 'Urgent',
                    'status'      => 'In Progress',
                    'created_at'  => now()->subHours(8),
                    'updated_at'  => now()->subHours(2),
                ],
                [
                    'title'       => 'Request access to staging Kubernetes cluster',
                    'description' => 'Need read-write kubectl credentials and kubeconfig for the us-east-1 staging cluster to verify payment gateway webhook fixes.',
                    'category'    => 'Account',
                    'priority'    => 'High',
                    'status'      => 'Open',
                    'created_at'  => now()->subDay(),
                    'updated_at'  => now()->subDay(),
                ],
                [
                    'title'       => 'PostgreSQL client SSL handshake error after cert rotation',
                    'description' => 'Cannot connect to production read-replica using TablePlus following yesterday maintenance window. Receiving error: SSL SYSCALL error: EOF detected.',
                    'category'    => 'Software',
                    'priority'    => 'High',
                    'status'      => 'In Progress',
                    'created_at'  => now()->subDays(2),
                    'updated_at'  => now()->subHours(5),
                ],
                [
                    'title'       => 'Floor 3 East Ricoh printer paper jam error 990',
                    'description' => 'Printer display shows recurring jam in tray 2 even after clearing visible sheets. Please dispatch technician or replace roller unit.',
                    'category'    => 'Hardware',
                    'priority'    => 'Low',
                    'status'      => 'Resolved',
                    'created_at'  => now()->subDays(3),
                    'updated_at'  => now()->subDay(),
                ],
                [
                    'title'       => 'Request JetBrains All Products Pack license renewal',
                    'description' => 'My PhpStorm floating license expires in 5 days. Requesting renewal or assignment to team subscription pool.',
                    'category'    => 'Account',
                    'priority'    => 'Medium',
                    'status'      => 'Resolved',
                    'created_at'  => now()->subDays(4),
                    'updated_at'  => now()->subDays(2),
                ],
                [
                    'title'       => 'Office Wi-Fi certificate expiring notification popup',
                    'description' => 'Device keeps displaying 802.1x RADIUS certificate warning prompt when roaming between 4th floor access points.',
                    'category'    => 'Network',
                    'priority'    => 'Medium',
                    'status'      => 'Closed',
                    'created_at'  => now()->subDays(5),
                    'updated_at'  => now()->subDays(3),
                ],
                [
                    'title'       => 'Docker Desktop engine hanging during startup on macOS',
                    'description' => 'Docker daemon fails to start with qemu initialization error after latest macOS Sequoia update. Resetting data did not resolve.',
                    'category'    => 'Software',
                    'priority'    => 'High',
                    'status'      => 'Open',
                    'created_at'  => now()->subDays(6),
                    'updated_at'  => now()->subDays(6),
                ],
                [
                    'title'       => 'Ergonomic keyboard spacebar squeaking and sticking',
                    'description' => 'Keychron mechanical keyboard spacebar key switch is sticking down and failing to register keypresses smoothly.',
                    'category'    => 'Hardware',
                    'priority'    => 'Low',
                    'status'      => 'Closed',
                    'created_at'  => now()->subDays(7),
                    'updated_at'  => now()->subDays(4),
                ],
                [
                    'title'       => 'Request GitHub organization 2FA reset for contractor account',
                    'description' => 'Lost authentication device after upgrading phone. Need recovery keys regenerated for contractor account dev-contractor-99.',
                    'category'    => 'Account',
                    'priority'    => 'Urgent',
                    'status'      => 'Resolved',
                    'created_at'  => now()->subDays(8),
                    'updated_at'  => now()->subDays(6),
                ],
                [
                    'title'       => 'Conference Room B Polycom audio unit no sound output',
                    'description' => 'Audio output is completely silent when joining Microsoft Teams rooms. HDMI arc input appears inactive.',
                    'category'    => 'Hardware',
                    'priority'    => 'High',
                    'status'      => 'In Progress',
                    'created_at'  => now()->subDays(9),
                    'updated_at'  => now()->subDays(1),
                ],
                [
                    'title'       => 'Guest Wi-Fi portal page redirects to 404',
                    'description' => 'Visiting clients are unable to accept terms of service on guest-wifi captive portal. URL returns Nginx 404 Not Found.',
                    'category'    => 'Network',
                    'priority'    => 'High',
                    'status'      => 'Closed',
                    'created_at'  => now()->subDays(10),
                    'updated_at'  => now()->subDays(7),
                ],
                [
                    'title'       => 'Slack desktop client high CPU usage (over 180%)',
                    'description' => 'Slack helper renderer process spikes CPU and drains MacBook battery in under 90 minutes. Clearing cache temporarily helps.',
                    'category'    => 'Software',
                    'priority'    => 'Medium',
                    'status'      => 'Open',
                    'created_at'  => now()->subDays(11),
                    'updated_at'  => now()->subDays(11),
                ],
                [
                    'title'       => 'Request standing desk power supply replacement',
                    'description' => 'Motor controller unit on desk #42 is clicking and displaying error code E08. Height adjustment is stuck in lowest position.',
                    'category'    => 'Other',
                    'priority'    => 'Low',
                    'status'      => 'Resolved',
                    'created_at'  => now()->subDays(12),
                    'updated_at'  => now()->subDays(8),
                ],
                [
                    'title'       => 'Internal wiki links failing with DNS resolution timeout',
                    'description' => 'Subdomain wiki.internal.company cannot be resolved on local DHCP DNS server 10.0.0.2.',
                    'category'    => 'Network',
                    'priority'    => 'Medium',
                    'status'      => 'Closed',
                    'created_at'  => now()->subDays(14),
                    'updated_at'  => now()->subDays(10),
                ],
            ];

            foreach ($demoTickets as $ticket) {
                $demo->tickets()->create($ticket);
            }
        }

        // 4. Seed realistic tickets for Secondary User (Jane)
        if ($jane->tickets()->count() === 0) {
            $janeTickets = [
                [
                    'title'       => 'New employee onboarding hardware provisioning',
                    'description' => 'Please configure MacBook Pro M3, YubiKey 5C, and 4K display for junior engineer starting next Monday.',
                    'category'    => 'Hardware',
                    'priority'    => 'High',
                    'status'      => 'Open',
                    'created_at'  => now()->subHours(5),
                    'updated_at'  => now()->subHours(5),
                ],
                [
                    'title'       => 'Figma Enterprise workspace editor seat allocation',
                    'description' => 'Need editor permission assigned to product design intern on the Design System workspace.',
                    'category'    => 'Account',
                    'priority'    => 'Medium',
                    'status'      => 'In Progress',
                    'created_at'  => now()->subDays(1),
                    'updated_at'  => now()->subHours(12),
                ],
                [
                    'title'       => 'Badge reader not recognizing keycard at parking gate B',
                    'description' => 'RFID card sensor beeps red at South gate entrance. Access control database may need synchronization.',
                    'category'    => 'Other',
                    'priority'    => 'Low',
                    'status'      => 'Resolved',
                    'created_at'  => now()->subDays(3),
                    'updated_at'  => now()->subDays(1),
                ],
            ];

            foreach ($janeTickets as $ticket) {
                $jane->tickets()->create($ticket);
            }
        }
    }
}
