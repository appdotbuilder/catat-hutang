<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDebtRequest;
use App\Http\Requests\UpdateDebtRequest;
use App\Models\Debt;
use Illuminate\Http\Request;
use Inertia\Inertia;


class DebtController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = auth()->user()->debts()->with('user');
        
        // Filter by month if provided
        if ($request->filled('month')) {
            $month = $request->get('month');
            $query->whereMonth('due_date', date('m', strtotime($month)))
                  ->whereYear('due_date', date('Y', strtotime($month)));
        }
        
        // Filter by status if provided
        if ($request->filled('status')) {
            $query->where('status', $request->get('status'));
        }
        
        $debts = $query->orderBy('due_date', 'asc')->paginate(10);
        
        // Calculate statistics
        $totalUnpaid = Debt::where('user_id', auth()->id())->unpaid()->sum('amount');
        $totalPaid = Debt::where('user_id', auth()->id())->paid()->sum('amount');
        $dueSoonCount = Debt::where('user_id', auth()->id())->dueSoon()->count();
        $overdueCount = Debt::where('user_id', auth()->id())
            ->where('due_date', '<', now())
            ->where('status', 'belum_lunas')
            ->count();
        
        return Inertia::render('debts/index', [
            'debts' => $debts,
            'filters' => $request->only(['month', 'status']),
            'statistics' => [
                'total_unpaid' => $totalUnpaid,
                'total_paid' => $totalPaid,
                'due_soon_count' => $dueSoonCount,
                'overdue_count' => $overdueCount,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('debts/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDebtRequest $request)
    {
        $debt = auth()->user()->debts()->create($request->validated());

        return redirect()->route('debts.index')
            ->with('success', 'Hutang berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Debt $debt)
    {
        if ($debt->user_id !== auth()->id()) {
            abort(403);
        }
        
        return Inertia::render('debts/show', [
            'debt' => $debt->load('user')
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Debt $debt)
    {
        if ($debt->user_id !== auth()->id()) {
            abort(403);
        }
        
        return Inertia::render('debts/edit', [
            'debt' => $debt
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDebtRequest $request, Debt $debt)
    {
        $debt->update($request->validated());

        return redirect()->route('debts.show', $debt)
            ->with('success', 'Hutang berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Debt $debt)
    {
        if ($debt->user_id !== auth()->id()) {
            abort(403);
        }
        
        $debt->delete();

        return redirect()->route('debts.index')
            ->with('success', 'Hutang berhasil dihapus.');
    }




}