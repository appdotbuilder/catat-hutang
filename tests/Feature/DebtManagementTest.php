<?php

namespace Tests\Feature;

use App\Models\Debt;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DebtManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_authenticated_user_can_view_debts_index(): void
    {
        $this->actingAs($this->user)
            ->get('/debts')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('debts/index'));
    }

    public function test_authenticated_user_can_create_debt(): void
    {
        $debtData = [
            'lender_name' => 'Bank BCA',
            'amount' => 5000000,
            'due_date' => now()->addMonth()->format('Y-m-d'),
            'description' => 'Pinjaman untuk modal usaha',
        ];

        $this->actingAs($this->user)
            ->post('/debts', $debtData)
            ->assertRedirect('/debts')
            ->assertSessionHas('success');

        $this->assertDatabaseHas('debts', [
            'lender_name' => $debtData['lender_name'],
            'amount' => $debtData['amount'],
            'description' => $debtData['description'],
            'user_id' => $this->user->id,
            'status' => 'belum_lunas',
        ]);
    }

    public function test_authenticated_user_can_view_own_debt(): void
    {
        $debt = Debt::factory()->create(['user_id' => $this->user->id]);

        $this->actingAs($this->user)
            ->get("/debts/{$debt->id}")
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('debts/show')
                ->has('debt')
            );
    }

    public function test_authenticated_user_cannot_view_others_debt(): void
    {
        $otherUser = User::factory()->create();
        $debt = Debt::factory()->create(['user_id' => $otherUser->id]);

        $this->actingAs($this->user)
            ->get("/debts/{$debt->id}")
            ->assertForbidden();
    }

    public function test_authenticated_user_can_update_own_debt(): void
    {
        $debt = Debt::factory()->create(['user_id' => $this->user->id]);
        
        $updateData = [
            'lender_name' => 'Updated Lender',
            'amount' => 10000000,
            'due_date' => now()->addMonths(2)->format('Y-m-d'),
            'status' => 'lunas',
            'description' => 'Updated description',
        ];

        $this->actingAs($this->user)
            ->put("/debts/{$debt->id}", $updateData)
            ->assertRedirect("/debts/{$debt->id}")
            ->assertSessionHas('success');

        $this->assertDatabaseHas('debts', [
            'id' => $debt->id,
            'lender_name' => $updateData['lender_name'],
            'amount' => $updateData['amount'],
            'status' => $updateData['status'],
            'description' => $updateData['description'],
            'user_id' => $this->user->id,
        ]);
    }

    public function test_authenticated_user_can_mark_debt_as_paid(): void
    {
        $debt = Debt::factory()->unpaid()->create(['user_id' => $this->user->id]);

        $updateData = [
            'lender_name' => $debt->lender_name,
            'amount' => $debt->amount,
            'due_date' => $debt->due_date->format('Y-m-d'),
            'status' => 'lunas',
            'description' => $debt->description,
        ];

        $this->actingAs($this->user)
            ->patch("/debts/{$debt->id}", $updateData)
            ->assertRedirect()
            ->assertSessionHas('success');

        $this->assertDatabaseHas('debts', [
            'id' => $debt->id,
            'status' => 'lunas',
        ]);
    }

    public function test_authenticated_user_can_delete_own_debt(): void
    {
        $debt = Debt::factory()->create(['user_id' => $this->user->id]);

        $this->actingAs($this->user)
            ->delete("/debts/{$debt->id}")
            ->assertRedirect('/debts')
            ->assertSessionHas('success');

        $this->assertDatabaseMissing('debts', [
            'id' => $debt->id,
        ]);
    }

    public function test_debt_validation_rules(): void
    {
        $this->actingAs($this->user)
            ->post('/debts', [])
            ->assertSessionHasErrors(['lender_name', 'amount', 'due_date']);
    }

    public function test_debt_amount_must_be_positive(): void
    {
        $this->actingAs($this->user)
            ->post('/debts', [
                'lender_name' => 'Test Lender',
                'amount' => -1000,
                'due_date' => now()->addMonth()->format('Y-m-d'),
            ])
            ->assertSessionHasErrors(['amount']);
    }

    public function test_due_date_cannot_be_in_past(): void
    {
        $this->actingAs($this->user)
            ->post('/debts', [
                'lender_name' => 'Test Lender',
                'amount' => 1000000,
                'due_date' => now()->subDay()->format('Y-m-d'),
            ])
            ->assertSessionHasErrors(['due_date']);
    }

    public function test_dashboard_shows_debt_statistics(): void
    {
        // Create test debts
        Debt::factory()->unpaid()->create(['user_id' => $this->user->id, 'amount' => 1000000]);
        Debt::factory()->paid()->create(['user_id' => $this->user->id, 'amount' => 500000]);
        Debt::factory()->overdue()->create(['user_id' => $this->user->id]);

        $this->actingAs($this->user)
            ->get('/dashboard')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('dashboard')
                ->has('statistics')
                ->has('recentDebts')
                ->has('upcomingDebts')
                ->has('overdueDebts')
            );
    }

    public function test_debts_can_be_filtered_by_month(): void
    {
        $debt1 = Debt::factory()->create([
            'user_id' => $this->user->id,
            'due_date' => '2024-01-15',
        ]);
        
        $debt2 = Debt::factory()->create([
            'user_id' => $this->user->id,
            'due_date' => '2024-02-15',
        ]);

        $this->actingAs($this->user)
            ->get('/debts?month=2024-01')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('debts/index')
                ->has('debts.data', 1)
            );
    }

    public function test_debts_can_be_filtered_by_status(): void
    {
        Debt::factory()->unpaid()->create(['user_id' => $this->user->id]);
        Debt::factory()->paid()->create(['user_id' => $this->user->id]);

        $this->actingAs($this->user)
            ->get('/debts?status=belum_lunas')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('debts/index')
                ->has('debts.data', 1)
            );
    }

    public function test_guest_cannot_access_debt_routes(): void
    {
        $debt = Debt::factory()->create();

        $this->get('/debts')->assertRedirect('/login');
        $this->get('/debts/create')->assertRedirect('/login');
        $this->get("/debts/{$debt->id}")->assertRedirect('/login');
        $this->post('/debts', [])->assertRedirect('/login');
    }
}