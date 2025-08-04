import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface Props {
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
        };
    };
    [key: string]: unknown;
}

export default function Welcome({ auth }: Props) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <div className="text-2xl font-bold text-indigo-600">💳 DebtTracker</div>
                        </div>
                        <nav className="flex space-x-4">
                            {auth?.user ? (
                                <Link
                                    href="/dashboard"
                                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                        <span className="block">📋 Pencatatan Hutang</span>
                        <span className="block text-indigo-600">Pribadi yang Mudah</span>
                    </h1>
                    <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                        Kelola semua hutang pribadi Anda dengan mudah. Catat, pantau, dan lacak pembayaran 
                        hutang dengan fitur lengkap dan laporan PDF.
                    </p>
                    <div className="mt-8 flex justify-center space-x-4">
                        {auth?.user ? (
                            <Link href="/dashboard">
                                <Button size="lg" className="text-lg px-8 py-3">
                                    🏠 Buka Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/register">
                                    <Button size="lg" className="text-lg px-8 py-3">
                                        🚀 Mulai Gratis
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                                        👤 Masuk Akun
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mt-20">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {/* Feature 1 */}
                        <div className="bg-white rounded-lg shadow-md p-6 text-center">
                            <div className="text-4xl mb-4">📝</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Catat Hutang Mudah
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Simpan detail hutang lengkap: nama pemberi pinjaman, jumlah, 
                                tanggal jatuh tempo, dan deskripsi.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white rounded-lg shadow-md p-6 text-center">
                            <div className="text-4xl mb-4">✅</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Status Pembayaran
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Tandai hutang sebagai lunas atau belum lunas. 
                                Pantau total hutang yang masih aktif.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white rounded-lg shadow-md p-6 text-center">
                            <div className="text-4xl mb-4">🗓️</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Filter per Bulan
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Filter dan lihat hutang berdasarkan tanggal jatuh tempo 
                                per bulan untuk perencanaan keuangan.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-white rounded-lg shadow-md p-6 text-center">
                            <div className="text-4xl mb-4">📄</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Laporan PDF
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Ekspor laporan hutang lengkap dalam format PDF 
                                untuk dokumentasi dan arsip.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Dashboard Preview */}
                <div className="mt-20">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                        📊 Dashboard yang Informatif
                    </h2>
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-center">
                                    <div className="text-2xl mr-3">💸</div>
                                    <div>
                                        <p className="text-sm text-red-600 font-medium">Total Belum Lunas</p>
                                        <p className="text-xl font-bold text-red-700">Rp 15.750.000</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center">
                                    <div className="text-2xl mr-3">✅</div>
                                    <div>
                                        <p className="text-sm text-green-600 font-medium">Total Lunas</p>
                                        <p className="text-xl font-bold text-green-700">Rp 8.500.000</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex items-center">
                                    <div className="text-2xl mr-3">⚠️</div>
                                    <div>
                                        <p className="text-sm text-yellow-600 font-medium">Jatuh Tempo Segera</p>
                                        <p className="text-xl font-bold text-yellow-700">3 Hutang</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="text-center text-gray-500">
                            <p className="mb-4">📈 Grafik statistik bulanan dan notifikasi jatuh tempo</p>
                            <p>🔔 Peringatan otomatis untuk hutang yang akan jatuh tempo</p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-20 bg-indigo-700 rounded-lg shadow-xl">
                    <div className="px-6 py-12 sm:px-12 sm:py-16 lg:px-16">
                        <div className="text-center">
                            <h2 className="text-3xl font-extrabold text-white">
                                💪 Mulai Kelola Hutang Anda Hari Ini
                            </h2>
                            <p className="mt-4 text-lg text-indigo-200">
                                Gratis, mudah digunakan, dan membantu Anda mengatur keuangan dengan lebih baik.
                            </p>
                            <div className="mt-8">
                                {auth?.user ? (
                                    <Link href="/dashboard">
                                        <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                                            🏠 Ke Dashboard
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href="/register">
                                        <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                                            🚀 Daftar Sekarang - Gratis!
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center text-gray-500">
                        <p>&copy; 2024 DebtTracker. Aplikasi pencatatan hutang pribadi yang aman dan mudah.</p>
                        <p className="mt-2 text-sm">🔒 Data Anda aman • 📱 Responsive • 🇮🇩 Interface Bahasa Indonesia</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}