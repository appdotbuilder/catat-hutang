<?php

namespace Database\Seeders;

use App\Models\Debt;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DebtSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Create a test user if none exists
        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password'),
            ]
        );

        // Create sample debts for the test user
        Debt::factory(5)->unpaid()->create(['user_id' => $user->id]);
        Debt::factory(3)->paid()->create(['user_id' => $user->id]);
        Debt::factory(2)->overdue()->create(['user_id' => $user->id]);
        Debt::factory(2)->dueSoon()->create(['user_id' => $user->id]);
    }
}