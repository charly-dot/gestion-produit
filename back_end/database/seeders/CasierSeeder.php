<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Casier;

class CasierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $noms = ['Casier 1', 'Casier 2', 'Casier 3', 'Casier 4', 'Casier 5', 'Casier 6', 'Casier 7', 'Casier 8', 'Casier 9', 'Casier 10'];
        for ($i = 0; $i < 0; $i++) {
            Casier::create([
                'nom'       => $noms[array_rand($noms)],          // nom simple
                'etat'      => rand(0, 2) ? 'activer' : 'desactiver',
                'idEntrepot' => rand(1, 2),
                'stock' => rand(1, 5),
                'colone5'   => rand(1, 2),
            ]);
        }
    }
}
