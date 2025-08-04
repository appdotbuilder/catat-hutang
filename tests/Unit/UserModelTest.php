<?php

namespace Tests\Unit;

use App\Models\Debt;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_has_many_debts(): void
    {
        $user = User::factory()->create();
        
        Debt::factory()->count(3)->create(['user_id' => $user->id]);
        
        $this->assertCount(3, $user->debts);
        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Collection::class, $user->debts);
        $this->assertTrue($user->debts->every(fn($debt) => $debt instanceof Debt));
    }

    public function test_user_debts_relationship_returns_correct_debts(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        
        $debt1 = Debt::factory()->create(['user_id' => $user1->id]);
        $debt2 = Debt::factory()->create(['user_id' => $user1->id]);
        $debt3 = Debt::factory()->create(['user_id' => $user2->id]);
        
        $user1Debts = $user1->debts;
        
        $this->assertCount(2, $user1Debts);
        $this->assertTrue($user1Debts->contains($debt1));
        $this->assertTrue($user1Debts->contains($debt2));
        $this->assertFalse($user1Debts->contains($debt3));
    }
}