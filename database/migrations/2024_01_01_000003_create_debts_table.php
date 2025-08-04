<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('debts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('lender_name')->comment('Nama pemberi pinjaman');
            $table->decimal('amount', 15, 2)->comment('Jumlah hutang');
            $table->date('due_date')->comment('Tanggal jatuh tempo');
            $table->enum('status', ['belum_lunas', 'lunas'])->default('belum_lunas')->comment('Status pembayaran hutang');
            $table->text('description')->nullable()->comment('Deskripsi singkat hutang');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('user_id');
            $table->index('status');
            $table->index('due_date');
            $table->index(['user_id', 'status']);
            $table->index(['user_id', 'due_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('debts');
    }
};