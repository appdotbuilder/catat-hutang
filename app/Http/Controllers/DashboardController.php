<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Debt;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index()
    {
        $user = auth()->user();
        
        // Get recent debts
        $recentDebts = $user->debts()
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
        
        // Get upcoming due dates (next 7 days)
        $upcomingDebts = $user->debts()
            ->where('due_date', '>=', now())
            ->where('due_date', '<=', now()->addDays(7))
            ->where('status', 'belum_lunas')
            ->orderBy('due_date', 'asc')
            ->limit(5)
            ->get();
        
        // Get overdue debts
        $overdueDebts = $user->debts()
            ->where('due_date', '<', now())
            ->where('status', 'belum_lunas')
            ->orderBy('due_date', 'asc')
            ->limit(5)
            ->get();
        
        // Calculate statistics
        $totalUnpaid = Debt::where('user_id', $user->id)->unpaid()->sum('amount');
        $totalPaid = Debt::where('user_id', $user->id)->paid()->sum('amount');
        $totalDebts = $user->debts()->count();
        $unpaidCount = Debt::where('user_id', $user->id)->unpaid()->count();
        
        // Monthly statistics for chart
        $monthlyStats = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $month = $date->format('Y-m');
            $monthName = $date->translatedFormat('M Y');
            
            $unpaidAmount = Debt::where('user_id', $user->id)
                ->whereMonth('due_date', $date->month)
                ->whereYear('due_date', $date->year)
                ->unpaid()
                ->sum('amount');
                
            $paidAmount = Debt::where('user_id', $user->id)
                ->whereMonth('due_date', $date->month)
                ->whereYear('due_date', $date->year)
                ->paid()
                ->sum('amount');
            
            $monthlyStats[] = [
                'month' => $month,
                'month_name' => $monthName,
                'unpaid_amount' => $unpaidAmount,
                'paid_amount' => $paidAmount,
            ];
        }
        
        return Inertia::render('dashboard', [
            'statistics' => [
                'total_unpaid' => $totalUnpaid,
                'total_paid' => $totalPaid,
                'total_debts' => $totalDebts,
                'unpaid_count' => $unpaidCount,
            ],
            'recentDebts' => $recentDebts,
            'upcomingDebts' => $upcomingDebts,
            'overdueDebts' => $overdueDebts,
            'monthlyStats' => $monthlyStats,
        ]);
    }
}