<?php

namespace Tests\Unit;

use App\Models\Debt;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DebtModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_debt_belongs_to_user(): void
    {
        $user = User::factory()->create();
        $debt = Debt::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $debt->user);
        $this->assertEquals($user->id, $debt->user->id);
    }

    public function test_unpaid_scope_filters_unpaid_debts(): void
    {
        $user = User::factory()->create();
        
        Debt::factory()->unpaid()->create(['user_id' => $user->id]);
        Debt::factory()->unpaid()->create(['user_id' => $user->id]);
        Debt::factory()->paid()->create(['user_id' => $user->id]);

        $unpaidDebts = Debt::unpaid()->get();
        
        $this->assertCount(2, $unpaidDebts);
        $this->assertTrue($unpaidDebts->every(fn($debt) => $debt->status === 'belum_lunas'));
    }

    public function test_paid_scope_filters_paid_debts(): void
    {
        $user = User::factory()->create();
        
        Debt::factory()->paid()->create(['user_id' => $user->id]);
        Debt::factory()->paid()->create(['user_id' => $user->id]);
        Debt::factory()->unpaid()->create(['user_id' => $user->id]);

        $paidDebts = Debt::paid()->get();
        
        $this->assertCount(2, $paidDebts);
        $this->assertTrue($paidDebts->every(fn($debt) => $debt->status === 'lunas'));
    }

    public function test_due_soon_scope_filters_debts_due_within_seven_days(): void
    {
        $user = User::factory()->create();
        
        // Debt due in 3 days (should be included)
        Debt::factory()->unpaid()->create([
            'user_id' => $user->id,
            'due_date' => now()->addDays(3),
        ]);
        
        // Debt due in 10 days (should not be included)
        Debt::factory()->unpaid()->create([
            'user_id' => $user->id,
            'due_date' => now()->addDays(10),
        ]);
        
        // Paid debt due in 2 days (should not be included)
        Debt::factory()->paid()->create([
            'user_id' => $user->id,
            'due_date' => now()->addDays(2),
        ]);

        $dueSoonDebts = Debt::dueSoon()->get();
        
        $this->assertCount(1, $dueSoonDebts);
    }

    public function test_formatted_amount_attribute(): void
    {
        $debt = Debt::factory()->make(['amount' => 1500000]);
        
        $this->assertEquals('Rp 1.500.000', $debt->formatted_amount);
    }

    public function test_is_overdue_attribute_for_overdue_unpaid_debt(): void
    {
        $debt = Debt::factory()->make([
            'due_date' => now()->subDays(5),
            'status' => 'belum_lunas',
        ]);
        
        $this->assertTrue($debt->is_overdue);
    }

    public function test_is_overdue_attribute_for_paid_debt(): void
    {
        $debt = Debt::factory()->make([
            'due_date' => now()->subDays(5),
            'status' => 'lunas',
        ]);
        
        $this->assertFalse($debt->is_overdue);
    }

    public function test_is_overdue_attribute_for_future_debt(): void
    {
        $debt = Debt::factory()->make([
            'due_date' => now()->addDays(5),
            'status' => 'belum_lunas',
        ]);
        
        $this->assertFalse($debt->is_overdue);
    }

    public function test_amount_is_cast_to_decimal(): void
    {
        $debt = Debt::factory()->create(['amount' => 1000000]);
        
        $this->assertIsString($debt->amount);
        $this->assertEquals('1000000.00', $debt->amount);
    }

    public function test_due_date_is_cast_to_date(): void
    {
        $debt = Debt::factory()->create(['due_date' => '2024-12-25']);
        
        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $debt->due_date);
        $this->assertEquals('2024-12-25', $debt->due_date->format('Y-m-d'));
    }
}