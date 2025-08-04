<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Debt
 *
 * @property int $id
 * @property int $user_id
 * @property string $lender_name
 * @property string $amount
 * @property \Illuminate\Support\Carbon $due_date
 * @property string $status
 * @property string|null $description
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Debt newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Debt newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Debt query()
 * @method static \Illuminate\Database\Eloquent\Builder|Debt whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Debt whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Debt whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Debt whereDueDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Debt whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Debt whereLenderName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Debt whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Debt whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Debt whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Debt unpaid()
 * @method static \Illuminate\Database\Eloquent\Builder|Debt paid()
 * @method static \Illuminate\Database\Eloquent\Builder|Debt dueSoon()
 * @method static \Database\Factories\DebtFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Debt extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'lender_name',
        'amount',
        'due_date',
        'status',
        'description',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'decimal:2',
        'due_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the debt.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include unpaid debts.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeUnpaid($query)
    {
        return $query->where('status', 'belum_lunas');
    }

    /**
     * Scope a query to only include paid debts.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePaid($query)
    {
        return $query->where('status', 'lunas');
    }

    /**
     * Scope a query to only include debts due soon (within 7 days).
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeDueSoon($query)
    {
        return $query->where('due_date', '<=', now()->addDays(7))
                    ->where('status', 'belum_lunas');
    }

    /**
     * Get formatted amount with currency.
     *
     * @return string
     */
    public function getFormattedAmountAttribute(): string
    {
        return 'Rp ' . number_format((float)$this->amount, 0, ',', '.');
    }

    /**
     * Check if debt is overdue.
     *
     * @return bool
     */
    public function getIsOverdueAttribute(): bool
    {
        return $this->due_date->isPast() && $this->status === 'belum_lunas';
    }
}