<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Historiquetransferstock;

class HistoriquetransferstockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $noms = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E', 'Zone F', 'Zone G', 'Zone H', 'Zone I', 'Zone J'];

        for ($i = 0; $i < 10; $i++) {
            Historiquetransferstock::create([
                'zone'       => $noms[array_rand($noms)],
                'date' => now()->subDays(rand(0, 30)), // date aléatoire sur 30 jours
                'entrepotSource' => rand(1, 10),
                'entrepotFinal' => rand(1, 10),
                'casierSource' => rand(1, 10),
                'casierFinal' => rand(1, 10),
                'produit' => rand(1, 10),
                'stock' => rand(30, 100),
                'action' => 'transfert de stock',
                'colone5' => rand(1, 15),
            ]);
        }
    }
}
