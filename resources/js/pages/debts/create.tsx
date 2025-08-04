import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { InputError } from '@/components/input-error';



export default function CreateDebt(): React.JSX.Element {
    const { data, setData, post, processing, errors } = useForm({
        lender_name: '',
        amount: '',
        due_date: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/debts');
    };

    return (
        <AppShell>
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <div className="flex items-center space-x-4 mb-4">
                        <Link href="/debts">
                            <Button variant="outline" size="sm">
                                ← Kembali
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">➕ Tambah Hutang Baru</h1>
                            <p className="text-gray-600">Catat hutang pribadi dengan detail lengkap</p>
                        </div>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>📝 Form Hutang Baru</CardTitle>
                        <CardDescription>
                            Isi semua informasi hutang dengan lengkap dan akurat
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
                                    Masukkan jumlah dalam rupiah (tanpa titik atau koma)
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
                                    min={new Date().toISOString().split('T')[0]}
                                    className="mt-1"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Pilih tanggal ketika hutang harus dibayar
                                </p>
                                <InputError message={errors.due_date} className="mt-2" />
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

                            {/* Preview */}
                            {data.lender_name && data.amount && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h3 className="font-medium text-blue-900 mb-2">👁️ Preview Hutang</h3>
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
                                        <>💾 Simpan Hutang</>
                                    )}
                                </Button>
                                <Link href="/debts">
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
                        <CardTitle className="text-lg">💡 Tips Mengelola Hutang</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <h4 className="font-medium mb-2">📝 Pencatatan yang Baik:</h4>
                                <ul className="space-y-1 text-gray-600">
                                    <li>• Catat semua detail dengan lengkap</li>
                                    <li>• Simpan bukti pinjaman jika ada</li>
                                    <li>• Update status secara berkala</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2">⏰ Manajemen Waktu:</h4>
                                <ul className="space-y-1 text-gray-600">
                                    <li>• Set reminder untuk jatuh tempo</li>
                                    <li>• Prioritaskan hutang dengan bunga tinggi</li>
                                    <li>• Bayar lebih awal jika memungkinkan</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}