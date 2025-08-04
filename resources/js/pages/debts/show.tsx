import React from 'react';
import { Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    created_at: string;
    updated_at: string;
}

interface Props {
    debt: Debt;
    [key: string]: unknown;
}

export default function ShowDebt({ debt }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const markAsPaid = () => {
        router.patch(`/debts/${debt.id}`, { status: 'lunas' }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const deleteDebt = () => {
        if (confirm('Apakah Anda yakin ingin menghapus hutang ini? Data yang dihapus tidak dapat dikembalikan.')) {
            router.delete(`/debts/${debt.id}`);
        }
    };

    const getDaysUntilDue = () => {
        const today = new Date();
        const dueDate = new Date(debt.due_date);
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const daysUntilDue = getDaysUntilDue();

    return (
        <AppShell>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                            <Link href="/debts">
                                <Button variant="outline" size="sm">
                                    ← Kembali ke Daftar
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">👁️ Detail Hutang</h1>
                                <p className="text-gray-600">Informasi lengkap hutang kepada {debt.lender_name}</p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            {debt.status === 'belum_lunas' && (
                                <Button onClick={markAsPaid} className="bg-green-600 hover:bg-green-700">
                                    ✅ Tandai Lunas
                                </Button>
                            )}
                            <Link href={`/debts/${debt.id}/edit`}>
                                <Button variant="outline">
                                    ✏️ Edit
                                </Button>
                            </Link>
                            <Button onClick={deleteDebt} variant="destructive">
                                🗑️ Hapus
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>📋 Informasi Hutang</span>
                                    <Badge
                                        variant={debt.status === 'lunas' ? 'default' : 'destructive'}
                                        className="text-sm"
                                    >
                                        {debt.status === 'lunas' ? '✅ Lunas' : '❌ Belum Lunas'}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">👤 Pemberi Pinjaman</label>
                                        <p className="text-lg font-semibold mt-1">{debt.lender_name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">💰 Jumlah Hutang</label>
                                        <p className="text-2xl font-bold text-blue-600 mt-1">{debt.formatted_amount}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">📅 Tanggal Jatuh Tempo</label>
                                        <p className="text-lg font-medium mt-1">{formatDate(debt.due_date)}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">📊 Status Pembayaran</label>
                                        <div className="mt-1">
                                            <Badge
                                                variant={debt.status === 'lunas' ? 'default' : 'destructive'}
                                                className="text-sm"
                                            >
                                                {debt.status === 'lunas' ? '✅ Sudah Lunas' : '❌ Belum Lunas'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {debt.description && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">📝 Deskripsi</label>
                                        <p className="mt-1 p-3 bg-gray-50 rounded-lg">{debt.description}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle>🕒 Riwayat Waktu</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="text-2xl">📝</div>
                                        <div>
                                            <p className="font-medium">Hutang Dicatat</p>
                                            <p className="text-sm text-gray-600">{formatDateTime(debt.created_at)}</p>
                                        </div>
                                    </div>
                                    {debt.created_at !== debt.updated_at && (
                                        <div className="flex items-start space-x-3">
                                            <div className="text-2xl">✏️</div>
                                            <div>
                                                <p className="font-medium">Terakhir Diperbarui</p>
                                                <p className="text-sm text-gray-600">{formatDateTime(debt.updated_at)}</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-start space-x-3">
                                        <div className="text-2xl">⏰</div>
                                        <div>
                                            <p className="font-medium">Jatuh Tempo</p>
                                            <p className="text-sm text-gray-600">{formatDate(debt.due_date)}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status Alert */}
                        {debt.status === 'belum_lunas' && (
                            <Card className={`${
                                debt.is_overdue 
                                    ? 'border-red-200 bg-red-50' 
                                    : daysUntilDue <= 7 
                                    ? 'border-yellow-200 bg-yellow-50'
                                    : 'border-blue-200 bg-blue-50'
                            }`}>
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <div className="text-2xl">
                                            {debt.is_overdue ? '🚨' : daysUntilDue <= 7 ? '⚠️' : 'ℹ️'}
                                        </div>
                                        <h3 className={`font-medium ${
                                            debt.is_overdue 
                                                ? 'text-red-800' 
                                                : daysUntilDue <= 7 
                                                ? 'text-yellow-800'
                                                : 'text-blue-800'
                                        }`}>
                                            {debt.is_overdue 
                                                ? 'Hutang Terlambat' 
                                                : daysUntilDue <= 7 
                                                ? 'Jatuh Tempo Segera'
                                                : 'Status Normal'
                                            }
                                        </h3>
                                    </div>
                                    <p className={`text-sm ${
                                        debt.is_overdue 
                                            ? 'text-red-600' 
                                            : daysUntilDue <= 7 
                                            ? 'text-yellow-600'
                                            : 'text-blue-600'
                                    }`}>
                                        {debt.is_overdue 
                                            ? `Sudah terlambat ${Math.abs(daysUntilDue)} hari dari jatuh tempo`
                                            : daysUntilDue === 0
                                            ? 'Jatuh tempo hari ini!'
                                            : daysUntilDue === 1
                                            ? 'Jatuh tempo besok'
                                            : daysUntilDue <= 7
                                            ? `Jatuh tempo dalam ${daysUntilDue} hari`
                                            : `${daysUntilDue} hari lagi hingga jatuh tempo`
                                        }
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {debt.status === 'lunas' && (
                            <Card className="border-green-200 bg-green-50">
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <div className="text-2xl">✅</div>
                                        <h3 className="font-medium text-green-800">Hutang Lunas</h3>
                                    </div>
                                    <p className="text-sm text-green-600">
                                        Hutang ini sudah diselesaikan dengan baik.
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">🚀 Aksi Cepat</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {debt.status === 'belum_lunas' && (
                                    <Button onClick={markAsPaid} className="w-full bg-green-600 hover:bg-green-700">
                                        ✅ Tandai Sebagai Lunas
                                    </Button>
                                )}
                                <Link href={`/debts/${debt.id}/edit`}>
                                    <Button variant="outline" className="w-full">
                                        ✏️ Edit Hutang
                                    </Button>
                                </Link>

                                <Button onClick={deleteDebt} variant="destructive" className="w-full">
                                    🗑️ Hapus Hutang
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Tips */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">💡 Tips</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <p className="font-medium">📞 Komunikasi</p>
                                        <p className="text-gray-600">Jaga komunikasi yang baik dengan pemberi pinjaman</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">📋 Dokumentasi</p>
                                        <p className="text-gray-600">Simpan bukti pembayaran dan kesepakatan</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">⏰ Tepat Waktu</p>
                                        <p className="text-gray-600">Bayar tepat waktu untuk menjaga kepercayaan</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}