import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

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
    due_soon_count: number;
    overdue_count: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    debts: {
        data: Debt[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        month?: string;
        status?: string;
    };
    statistics: Statistics;
    [key: string]: unknown;
}

export default function DebtsIndex({ debts, filters, statistics }: Props) {
    const [filterMonth, setFilterMonth] = useState(filters.month || '');
    const [filterStatus, setFilterStatus] = useState(filters.status || '');

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

    const applyFilters = () => {
        const params: Record<string, string> = {};
        if (filterMonth) params.month = filterMonth;
        if (filterStatus) params.status = filterStatus;
        
        router.get('/debts', params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setFilterMonth('');
        setFilterStatus('');
        router.get('/debts', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const markAsPaid = (debtId: number) => {
        router.patch(`/debts/${debtId}`, { status: 'lunas' }, {
            preserveState: true,
            preserveScroll: true,
        });
    };



    return (
        <AppShell>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">📋 Daftar Hutang</h1>
                        <p className="text-gray-600">Kelola semua hutang pribadi Anda</p>
                    </div>
                    <div className="flex space-x-3">
                        <Link href="/debts/create">
                            <Button>
                                ➕ Tambah Hutang
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <div className="text-2xl">💸</div>
                                <div>
                                    <p className="text-sm text-gray-600">Belum Lunas</p>
                                    <p className="text-lg font-bold text-red-600">
                                        {formatCurrency(statistics.total_unpaid)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <div className="text-2xl">✅</div>
                                <div>
                                    <p className="text-sm text-gray-600">Sudah Lunas</p>
                                    <p className="text-lg font-bold text-green-600">
                                        {formatCurrency(statistics.total_paid)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <div className="text-2xl">⚠️</div>
                                <div>
                                    <p className="text-sm text-gray-600">Jatuh Tempo Segera</p>
                                    <p className="text-lg font-bold text-yellow-600">
                                        {statistics.due_soon_count} hutang
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <div className="text-2xl">🚨</div>
                                <div>
                                    <p className="text-sm text-gray-600">Terlambat</p>
                                    <p className="text-lg font-bold text-red-700">
                                        {statistics.overdue_count} hutang
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>🔍 Filter & Pencarian</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Filter per Bulan</label>
                                <Input
                                    type="month"
                                    value={filterMonth}
                                    onChange={(e) => setFilterMonth(e.target.value)}
                                    placeholder="Pilih bulan"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Status</label>
                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Semua Status</SelectItem>
                                        <SelectItem value="belum_lunas">Belum Lunas</SelectItem>
                                        <SelectItem value="lunas">Lunas</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-end space-x-2">
                                <Button onClick={applyFilters} className="flex-1">
                                    Terapkan Filter
                                </Button>
                                <Button onClick={clearFilters} variant="outline">
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Debts List */}
                <Card>
                    <CardHeader>
                        <CardTitle>📋 Daftar Hutang</CardTitle>
                        <CardDescription>
                            Menampilkan {debts.data.length} dari {debts.total} hutang
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {debts.data.length > 0 ? (
                            <div className="space-y-4">
                                {debts.data.map((debt) => (
                                    <div
                                        key={debt.id}
                                        className={`p-4 border rounded-lg ${
                                            debt.is_overdue
                                                ? 'border-red-200 bg-red-50'
                                                : debt.status === 'lunas'
                                                ? 'border-green-200 bg-green-50'
                                                : 'border-gray-200 bg-white'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3">
                                                    <h3 className="font-semibold text-lg">
                                                        {debt.lender_name}
                                                    </h3>
                                                    <Badge
                                                        variant={debt.status === 'lunas' ? 'default' : 'destructive'}
                                                    >
                                                        {debt.status === 'lunas' ? '✅ Lunas' : '❌ Belum Lunas'}
                                                    </Badge>
                                                    {debt.is_overdue && (
                                                        <Badge variant="destructive">
                                                            🚨 Terlambat
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-gray-600">Jumlah:</span>
                                                        <p className="font-bold text-lg">{debt.formatted_amount}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600">Jatuh Tempo:</span>
                                                        <p className="font-medium">{formatDate(debt.due_date)}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600">Deskripsi:</span>
                                                        <p>{debt.description || '-'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col space-y-2">
                                                <Link href={`/debts/${debt.id}`}>
                                                    <Button variant="outline" size="sm" className="w-full">
                                                        👁️ Detail
                                                    </Button>
                                                </Link>
                                                <Link href={`/debts/${debt.id}/edit`}>
                                                    <Button variant="outline" size="sm" className="w-full">
                                                        ✏️ Edit
                                                    </Button>
                                                </Link>
                                                {debt.status === 'belum_lunas' && (
                                                    <Button
                                                        onClick={() => markAsPaid(debt.id)}
                                                        size="sm"
                                                        className="w-full bg-green-600 hover:bg-green-700"
                                                    >
                                                        ✅ Tandai Lunas
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📋</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Belum ada hutang
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Mulai catat hutang pribadi Anda untuk pengelolaan keuangan yang lebih baik.
                                </p>
                                <Link href="/debts/create">
                                    <Button>
                                        ➕ Tambah Hutang Pertama
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                {debts.last_page > 1 && (
                    <div className="flex justify-center space-x-2">
                        {debts.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => {
                                    if (link.url) {
                                        router.visit(link.url, {
                                            preserveState: true,
                                            preserveScroll: true,
                                        });
                                    }
                                }}
                                disabled={!link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppShell>
    );
}