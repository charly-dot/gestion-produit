<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StockSeeder extends Seeder
{
    public function run(): void
    {
        $noms = ['Stock A', 'Stock B', 'Stock C', 'Stock D', 'Stock E', 'Stock F', 'Stock G', 'Stock H', 'Stock I', 'Stock J'];

        for ($i = 1; $i <= 10; $i++) {
            DB::table('stocks')->insert([
                'nom'       => $noms[array_rand($noms)],
                'entrepot'  => rand(1, 8),
                'casier'    => rand(1, 8),
                'colone5'   => rand(1, 8),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
