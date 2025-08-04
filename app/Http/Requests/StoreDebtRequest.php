<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDebtRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'lender_name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0.01|max:999999999999.99',
            'due_date' => 'required|date|after_or_equal:today',
            'description' => 'nullable|string|max:1000',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'lender_name.required' => 'Nama pemberi pinjaman wajib diisi.',
            'lender_name.max' => 'Nama pemberi pinjaman maksimal 255 karakter.',
            'amount.required' => 'Jumlah hutang wajib diisi.',
            'amount.numeric' => 'Jumlah hutang harus berupa angka.',
            'amount.min' => 'Jumlah hutang minimal Rp 0,01.',
            'amount.max' => 'Jumlah hutang terlalu besar.',
            'due_date.required' => 'Tanggal jatuh tempo wajib diisi.',
            'due_date.date' => 'Format tanggal jatuh tempo tidak valid.',
            'due_date.after_or_equal' => 'Tanggal jatuh tempo tidak boleh di masa lalu.',
            'description.max' => 'Deskripsi maksimal 1000 karakter.',
        ];
    }
}