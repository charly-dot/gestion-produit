<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tier;

class TiersTableSeeder extends Seeder
{
    public function run()
    {
        // Crée 10 tiers aléatoires
        Tier::factory()->count(5)->create();

        // Crée un tier fixe pour démonstration
        Tier::create([
            'nomTier' => 'TierDemo',
            'zone' => 'Antananarivo',
            'type' => 'Client',
            'motDePasse' => bcrypt('tier123'),
            'email' => 'tier@example.com',
            'contact' => '034 12 345 67',
            'nif' => '123456789',
            'stat' => '98765432',
            'rcs' => '12345678',
            'commercial' => 'Francky',
            'colonne' => 'val1',
            'colonnes' => 'val2',
        ]);
    }
}
