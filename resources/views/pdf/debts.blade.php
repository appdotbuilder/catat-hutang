<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Hutang - {{ $user->name }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            margin: 0;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            color: #333;
            font-size: 24px;
        }
        .header p {
            margin: 5px 0;
            color: #666;
        }
        .summary {
            margin-bottom: 30px;
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
        }
        .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        .summary-row:last-child {
            margin-bottom: 0;
        }
        .summary-label {
            font-weight: bold;
        }
        .summary-value {
            text-align: right;
        }
        .filters {
            margin-bottom: 20px;
            padding: 10px;
            background-color: #e9ecef;
            border-radius: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        .status-lunas {
            color: #28a745;
            font-weight: bold;
        }
        .status-belum-lunas {
            color: #dc3545;
            font-weight: bold;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            color: #666;
            font-size: 10px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .amount {
            font-weight: bold;
        }
        .overdue {
            background-color: #ffe6e6;
        }
        .due-soon {
            background-color: #fff3cd;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📋 Laporan Hutang Pribadi</h1>
        <p><strong>{{ $user->name }}</strong></p>
        <p>{{ $user->email }}</p>
        <p>Dicetak pada: {{ $generatedAt->translatedFormat('d F Y H:i') }} WIB</p>
    </div>

    @if($filters['month'] || $filters['status'])
    <div class="filters">
        <strong>Filter yang Diterapkan:</strong>
        @if($filters['month'])
            <br>Bulan: {{ \Carbon\Carbon::parse($filters['month'])->translatedFormat('F Y') }}
        @endif
        @if($filters['status'])
            <br>Status: {{ $filters['status'] === 'lunas' ? 'Lunas' : 'Belum Lunas' }}
        @endif
    </div>
    @endif

    <div class="summary">
        <div class="summary-row">
            <span class="summary-label">Total Hutang Belum Lunas:</span>
            <span class="summary-value amount" style="color: #dc3545;">Rp {{ number_format($totalUnpaid, 0, ',', '.') }}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Total Hutang Lunas:</span>
            <span class="summary-value amount" style="color: #28a745;">Rp {{ number_format($totalPaid, 0, ',', '.') }}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Total Keseluruhan:</span>
            <span class="summary-value amount">Rp {{ number_format($totalUnpaid + $totalPaid, 0, ',', '.') }}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Jumlah Hutang:</span>
            <span class="summary-value">{{ $debts->count() }} hutang</span>
        </div>
    </div>

    @if($debts->count() > 0)
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Pemberi Pinjaman</th>
                <th>Jumlah</th>
                <th>Jatuh Tempo</th>
                <th>Status</th>
                <th>Deskripsi</th>
            </tr>
        </thead>
        <tbody>
            @foreach($debts as $index => $debt)
            <tr class="
                @if($debt->is_overdue) overdue 
                @elseif($debt->due_date->diffInDays(now()) <= 7 && $debt->status === 'belum_lunas') due-soon 
                @endif
            ">
                <td class="text-center">{{ $index + 1 }}</td>
                <td>{{ $debt->lender_name }}</td>
                <td class="text-right amount">Rp {{ number_format($debt->amount, 0, ',', '.') }}</td>
                <td class="text-center">
                    {{ $debt->due_date->translatedFormat('d M Y') }}
                    @if($debt->is_overdue)
                        <br><small style="color: #dc3545;">(Terlambat {{ $debt->due_date->diffInDays(now()) }} hari)</small>
                    @elseif($debt->due_date->diffInDays(now()) <= 7 && $debt->status === 'belum_lunas')
                        <br><small style="color: #ffc107;">({{ $debt->due_date->diffInDays(now()) }} hari lagi)</small>
                    @endif
                </td>
                <td class="text-center">
                    <span class="status-{{ $debt->status }}">
                        {{ $debt->status === 'lunas' ? 'Lunas' : 'Belum Lunas' }}
                    </span>
                </td>
                <td>{{ $debt->description ?: '-' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @else
    <div style="text-align: center; padding: 40px; color: #666;">
        <p>Tidak ada data hutang yang ditemukan.</p>
    </div>
    @endif

    <div class="footer">
        <p>Laporan ini dibuat secara otomatis oleh sistem pencatatan hutang pribadi.</p>
        <p>Harap simpan laporan ini dengan baik untuk referensi keuangan Anda.</p>
    </div>
</body>
</html>