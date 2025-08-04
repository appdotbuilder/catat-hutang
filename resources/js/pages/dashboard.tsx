import React from 'react';
import { Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Debt {
    id: number;
    lender_name: string;
    amount: number;
    due_date: string;
    status: 'lunas' | 'belum_lunas';
    description?: string;
    formatted_amount: string;
    is_overdue: boolean;
}

interface Statistics {
    total_unpaid: number;
    total_paid: number;
    total_debts: number;
    unpaid_count: number;
}

interface MonthlyStats {
    month: string;
    month_name: string;
    unpaid_amount: number;
    paid_amount: number;
}

interface Props {
    statistics: Statistics;
    recentDebts: Debt[];
    upcomingDebts: Debt[];
    overdueDebts: Debt[];
    monthlyStats: MonthlyStats[];
    [key: string]: unknown;
}

export default function Dashboard({ 
    statistics, 
    recentDebts, 
    upcomingDebts, 
    overdueDebts,
    monthlyStats 
}: Props) {
    const formatCurrency = (amount: number) => {
        return `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">📊 Dashboard Hutang</h1>
                        <p className="text-gray-600">Ringkasan lengkap hutang pribadi Anda</p>
                    </div>
                    <div className="flex space-x-3">
                        <Link href="/debts/create">
                            <Button>
                                ➕ Tambah Hutang
                            </Button>
                        </Link>
                        <Link href="/debts">
                            <Button variant="outline">
                                📋 Lihat Semua
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Belum Lunas</CardTitle>
                            <div className="text-2xl">💸</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {formatCurrency(statistics.total_unpaid)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {statistics.unpaid_count} hutang aktif
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Lunas</CardTitle>
                            <div className="text-2xl">✅</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {formatCurrency(statistics.total_paid)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {statistics.total_debts - statistics.unpaid_count} hutang lunas
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Jatuh Tempo Segera</CardTitle>
                            <div className="text-2xl">⚠️</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">
                                {upcomingDebts.length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Dalam 7 hari ke depan
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Terlambat</CardTitle>
                            <div className="text-2xl">🚨</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-700">
                                {overdueDebts.length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Lewat jatuh tempo
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Alerts for Overdue and Upcoming */}
                {overdueDebts.length > 0 && (
                    <Card className="border-red-200 bg-red-50">
                        <CardHeader>
                            <CardTitle className="text-red-800 flex items-center">
                                🚨 Hutang Terlambat
                            </CardTitle>
                            <CardDescription className="text-red-600">
                                Anda memiliki {overdueDebts.length} hutang yang sudah lewat jatuh tempo
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {overdueDebts.slice(0, 3).map((debt) => (
                                    <div key={debt.id} className="flex justify-between items-center text-sm">
                                        <span>{debt.lender_name}</span>
                                        <span className="font-medium">{debt.formatted_amount}</span>
                                        <span className="text-red-600">{formatDate(debt.due_date)}</span>
                                    </div>
                                ))}
                            </div>
                            {overdueDebts.length > 3 && (
                                <p className="text-sm text-red-600 mt-2">
                                    dan {overdueDebts.length - 3} hutang lainnya...
                                </p>
                            )}
                        </CardContent>
                    </Card>
                )}

                {upcomingDebts.length > 0 && (
                    <Card className="border-yellow-200 bg-yellow-50">
                        <CardHeader>
                            <CardTitle className="text-yellow-800 flex items-center">
                                ⚠️ Jatuh Tempo Segera
                            </CardTitle>
                            <CardDescription className="text-yellow-600">
                                {upcomingDebts.length} hutang akan jatuh tempo dalam 7 hari ke depan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {upcomingDebts.slice(0, 3).map((debt) => (
                                    <div key={debt.id} className="flex justify-between items-center text-sm">
                                        <span>{debt.lender_name}</span>
                                        <span className="font-medium">{debt.formatted_amount}</span>
                                        <span className="text-yellow-600">{formatDate(debt.due_date)}</span>
                                    </div>
                                ))}
                            </div>
                            {upcomingDebts.length > 3 && (
                                <p className="text-sm text-yellow-600 mt-2">
                                    dan {upcomingDebts.length - 3} hutang lainnya...
                                </p>
                            )}
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Debts */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                📝 Hutang Terbaru
                            </CardTitle>
                            <CardDescription>
                                5 hutang yang baru saja ditambahkan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recentDebts.length > 0 ? (
                                <div className="space-y-3">
                                    {recentDebts.map((debt) => (
                                        <div key={debt.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium">{debt.lender_name}</p>
                                                <p className="text-sm text-gray-600">{formatDate(debt.due_date)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold">{debt.formatted_amount}</p>
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                    debt.status === 'lunas' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {debt.status === 'lunas' ? '✅ Lunas' : '❌ Belum Lunas'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">
                                    Belum ada hutang yang dicatat
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Monthly Statistics */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                📈 Statistik Bulanan
                            </CardTitle>
                            <CardDescription>
                                Tren hutang 6 bulan terakhir
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {monthlyStats.map((stat) => (
                                    <div key={stat.month} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">{stat.month_name}</span>
                                            <span className="text-sm text-gray-500">
                                                Total: {formatCurrency(stat.unpaid_amount + stat.paid_amount)}
                                            </span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <div className="flex-1 bg-red-100 rounded-full h-2">
                                                <div 
                                                    className="bg-red-500 h-2 rounded-full" 
                                                    style={{
                                                        width: `${
                                                            stat.unpaid_amount + stat.paid_amount > 0 
                                                                ? (stat.unpaid_amount / (stat.unpaid_amount + stat.paid_amount)) * 100 
                                                                : 0
                                                        }%`
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="flex-1 bg-green-100 rounded-full h-2">
                                                <div 
                                                    className="bg-green-500 h-2 rounded-full" 
                                                    style={{
                                                        width: `${
                                                            stat.unpaid_amount + stat.paid_amount > 0 
                                                                ? (stat.paid_amount / (stat.unpaid_amount + stat.paid_amount)) * 100 
                                                                : 0
                                                        }%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>Belum: {formatCurrency(stat.unpaid_amount)}</span>
                                            <span>Lunas: {formatCurrency(stat.paid_amount)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>🚀 Aksi Cepat</CardTitle>
                        <CardDescription>
                            Akses fitur utama dengan mudah
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Link href="/debts/create">
                                <Button variant="outline" className="w-full h-20 flex flex-col">
                                    <div className="text-2xl mb-1">➕</div>
                                    <span>Tambah Hutang</span>
                                </Button>
                            </Link>
                            <Link href="/debts?status=belum_lunas">
                                <Button variant="outline" className="w-full h-20 flex flex-col">
                                    <div className="text-2xl mb-1">❌</div>
                                    <span>Belum Lunas</span>
                                </Button>
                            </Link>
                            <Link href="/debts?status=lunas">
                                <Button variant="outline" className="w-full h-20 flex flex-col">
                                    <div className="text-2xl mb-1">✅</div>
                                    <span>Sudah Lunas</span>
                                </Button>
                            </Link>
                            <Link href="/debts">
                                <Button variant="outline" className="w-full h-20 flex flex-col">
                                    <div className="text-2xl mb-1">📋</div>
                                    <span>Kelola Hutang</span>
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}