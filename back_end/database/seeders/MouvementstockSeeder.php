<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Mouvementstock;
use Illuminate\Support\Str;

class MouvementstockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 0; $i < 40; $i++) {
            Mouvementstock::create([
                'date' => now()->subDays(rand(0, 30)), // date aléatoire sur 30 jours
                'entrepot' => rand(1, 6),              // id entrepot
                'casier' => rand(1, 6),                // id casier
                'produit' => rand(1, 20),              // id produit
                'stock' => rand(20, 80),
                'raison' => 'Facture fournisseur',               // quantité stockée
                'stockCour' => rand(20, 60),           // stock en cours
                'documentLier' => 'FA' . rand(1000, 9999), // FA + 4 chiffres
                'action' => ['suppression', 'ajouter'][rand(0, 1)], // juste pour donner un sens
                'colone5' => rand(1, 10), // id user
            ]);
        }
    }
}
