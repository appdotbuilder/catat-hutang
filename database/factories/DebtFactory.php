<?php

namespace Database\Factories;

use App\Models\Debt;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Debt>
 */
class DebtFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Debt>
     */
    protected $model = Debt::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $lenderNames = [
            'Bank BCA',
            'Bank Mandiri',
            'Toko Sumber Rejeki',
            'Ahmad Santoso',
            'Sari Wulandari',
            'CV Maju Jaya',
            'Koperasi Sejahtera',
            'Budi Hartono',
            'Warung Bu Yuni',
            'Indah Permata',
            'Toko Elektronik Jaya',
            'Credit Plus',
            'Mega Finance',
            'Adira Finance',
        ];

        $descriptions = [
            'Pinjaman untuk modal usaha',
            'Cicilan motor Honda Beat',
            'Hutang belanja bulanan',
            'Pinjaman untuk biaya sekolah anak',
            'Cicilan kulkas Samsung',
            'Hutang untuk renovasi rumah',
            'Pinjaman darurat medis',
            'Cicilan laptop Asus',
            'Hutang untuk modal jualan',
            'Pinjaman untuk biaya pernikahan',
            'Cicilan handphone iPhone',
            'Hutang kartu kredit',
            'Pinjaman untuk liburan keluarga',
            'Cicilan AC Sharp',
        ];

        return [
            'user_id' => User::factory(),
            'lender_name' => $this->faker->randomElement($lenderNames),
            'amount' => $this->faker->randomFloat(2, 100000, 50000000), // 100rb - 50jt
            'due_date' => $this->faker->dateTimeBetween('-3 months', '+6 months'),
            'status' => $this->faker->randomElement(['belum_lunas', 'lunas']),
            'description' => $this->faker->randomElement($descriptions),
        ];
    }

    /**
     * Indicate that the debt is unpaid.
     */
    public function unpaid(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'belum_lunas',
        ]);
    }

    /**
     * Indicate that the debt is paid.
     */
    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'lunas',
        ]);
    }

    /**
     * Indicate that the debt is overdue.
     */
    public function overdue(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'belum_lunas',
            'due_date' => $this->faker->dateTimeBetween('-2 months', '-1 day'),
        ]);
    }

    /**
     * Indicate that the debt is due soon.
     */
    public function dueSoon(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'belum_lunas',
            'due_date' => $this->faker->dateTimeBetween('now', '+7 days'),
        ]);
    }
}