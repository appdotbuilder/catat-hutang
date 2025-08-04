import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputError } from '@/components/input-error';

interface Debt {
    id: number;
    lender_name: string;
    amount: number;
    due_date: string;
    status: 'lunas' | 'belum_lunas';
    description?: string;
}

interface Props {
    debt: Debt;
    [key: string]: unknown;
}

export default function EditDebt({ debt }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        lender_name: debt.lender_name,
        amount: debt.amount.toString(),
        due_date: debt.due_date,
        status: debt.status,
        description: debt.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/debts/${debt.id}`);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <AppShell>
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <div className="flex items-center space-x-4 mb-4">
                        <Link href={`/debts/${debt.id}`}>
                            <Button variant="outline" size="sm">
                                ← Kembali ke Detail
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">✏️ Edit Hutang</h1>
                            <p className="text-gray-600">Perbarui informasi hutang kepada {debt.lender_name}</p>
                        </div>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>📝 Form Edit Hutang</CardTitle>
                        <CardDescription>
                            Perbarui informasi hutang dengan data yang akurat
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Lender Name */}
                            <div>
                                <Label htmlFor="lender_name">
                                    👤 Nama Pemberi Pinjaman *
                                </Label>
                                <Input
                                    id="lender_name"
                                    type="text"
                                    value={data.lender_name}
                                    onChange={(e) => setData('lender_name', e.target.value)}
                                    placeholder="Contoh: Bank BCA, Ahmad Santoso, Toko Sumber Rejeki"
                                    className="mt-1"
                                />
                                <InputError message={errors.lender_name} className="mt-2" />
                            </div>

                            {/* Amount */}
                            <div>
                                <Label htmlFor="amount">
                                    💰 Jumlah Hutang (Rp) *
                                </Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    placeholder="0"
                                    className="mt-1"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Jumlah saat ini: Rp {new Intl.NumberFormat('id-ID').format(debt.amount)}
                                </p>
                                <InputError message={errors.amount} className="mt-2" />
                            </div>

                            {/* Due Date */}
                            <div>
                                <Label htmlFor="due_date">
                                    📅 Tanggal Jatuh Tempo *
                                </Label>
                                <Input
                                    id="due_date"
                                    type="date"
                                    value={data.due_date}
                                    onChange={(e) => setData('due_date', e.target.value)}
                                    className="mt-1"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Tanggal sebelumnya: {formatDate(debt.due_date)}
                                </p>
                                <InputError message={errors.due_date} className="mt-2" />
                            </div>

                            {/* Status */}
                            <div>
                                <Label htmlFor="status">
                                    📊 Status Pembayaran *
                                </Label>
                                <Select value={data.status} onValueChange={(value) => setData('status', value as 'lunas' | 'belum_lunas')}>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Pilih status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="belum_lunas">❌ Belum Lunas</SelectItem>
                                        <SelectItem value="lunas">✅ Lunas</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-sm text-gray-500 mt-1">
                                    Status saat ini: {debt.status === 'lunas' ? '✅ Lunas' : '❌ Belum Lunas'}
                                </p>
                                <InputError message={errors.status} className="mt-2" />
                            </div>

                            {/* Description */}
                            <div>
                                <Label htmlFor="description">
                                    📋 Deskripsi Hutang (Opsional)
                                </Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Contoh: Pinjaman untuk modal usaha, Cicilan motor Honda Beat, Hutang belanja bulanan"
                                    className="mt-1"
                                    rows={3}
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Catatan tambahan tentang hutang ini (maksimal 1000 karakter)
                                </p>
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            {/* Status Change Warning */}
                            {data.status !== debt.status && (
                                <div className={`p-4 rounded-lg border ${
                                    data.status === 'lunas' 
                                        ? 'bg-green-50 border-green-200' 
                                        : 'bg-yellow-50 border-yellow-200'
                                }`}>
                                    <div className="flex items-center space-x-2">
                                        <div className="text-2xl">
                                            {data.status === 'lunas' ? '✅' : '⚠️'}
                                        </div>
                                        <div>
                                            <h3 className={`font-medium ${
                                                data.status === 'lunas' ? 'text-green-800' : 'text-yellow-800'
                                            }`}>
                                                {data.status === 'lunas' 
                                                    ? 'Mengubah Status ke Lunas' 
                                                    : 'Mengubah Status ke Belum Lunas'
                                                }
                                            </h3>
                                            <p className={`text-sm ${
                                                data.status === 'lunas' ? 'text-green-600' : 'text-yellow-600'
                                            }`}>
                                                {data.status === 'lunas' 
                                                    ? 'Hutang akan ditandai sebagai sudah dibayar lunas.'
                                                    : 'Hutang akan ditandai kembali sebagai belum lunas.'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Preview */}
                            {data.lender_name && data.amount && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h3 className="font-medium text-blue-900 mb-2">👁️ Preview Perubahan</h3>
                                    <div className="text-sm space-y-1">
                                        <p><strong>Pemberi Pinjaman:</strong> {data.lender_name}</p>
                                        <p><strong>Jumlah:</strong> Rp {new Intl.NumberFormat('id-ID').format(parseFloat(data.amount) || 0)}</p>
                                        {data.due_date && (
                                            <p><strong>Jatuh Tempo:</strong> {new Date(data.due_date).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}</p>
                                        )}
                                        <p><strong>Status:</strong> {data.status === 'lunas' ? '✅ Lunas' : '❌ Belum Lunas'}</p>
                                        {data.description && (
                                            <p><strong>Deskripsi:</strong> {data.description}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="flex space-x-4 pt-4">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1"
                                >
                                    {processing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>💾 Simpan Perubahan</>
                                    )}
                                </Button>
                                <Link href={`/debts/${debt.id}`}>
                                    <Button type="button" variant="outline" className="px-6">
                                        ❌ Batal
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Help Card */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="text-lg">ℹ️ Informasi Penting</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start space-x-2">
                                <div className="text-lg">✏️</div>
                                <div>
                                    <p className="font-medium">Edit Hati-hati</p>
                                    <p className="text-gray-600">
                                        Pastikan data yang diubah sudah benar karena akan mempengaruhi laporan keuangan Anda.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-2">
                                <div className="text-lg">💾</div>
                                <div>
                                    <p className="font-medium">Riwayat Perubahan</p>
                                    <p className="text-gray-600">
                                        Sistem akan mencatat kapan terakhir kali hutang ini diperbarui.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-2">
                                <div className="text-lg">📊</div>
                                <div>
                                    <p className="font-medium">Status Pembayaran</p>
                                    <p className="text-gray-600">
                                        Mengubah status akan mempengaruhi statistik total hutang di dashboard.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}