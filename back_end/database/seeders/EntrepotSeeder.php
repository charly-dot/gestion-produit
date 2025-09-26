<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Entrepot;

class EntrepotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $zones = ['Analamanga', 'Vakinankaratra', 'Alaotra-Mangoro', 'Itasy', 'Bongolava', 'Diana', 'Sava', 'Anosy'];
        $noms = ['Entrepot A', 'Entrepot B', 'Entrepot C', 'Entrepot D', 'Entrepot E', 'Entrepot F', 'Entrepot G', 'Entrepot H', 'Entrepot I', 'Entrepot J'];

        for ($i = 0; $i < 15; $i++) {
            Entrepot::create([
                'nom'       => $noms[array_rand($noms)],          // nom simple
                'etat'      => rand(0, 1) ? 'activer' : 'desactiver',
                'zone'      => $zones[array_rand($zones)],        // une région de Madagascar
                'idCasier'  => rand(1, 10),
                'idProduit' => rand(1, 10),
                'colone5'   => rand(1, 10),
            ]);
        }
    }
}
