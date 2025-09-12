<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Produit;

class ProduitsTableSeeder extends Seeder
{
    public function run()
    {
        // Crée 10 produits aléatoires
        Produit::factory()->count(10)->create();

        // Produit fixe pour démonstration
        Produit::create([
            'nomProduit' => 'ProduitDemo',
            'prix' => 15000,
            'stock_initia' => 50,
            'zone' => 'Antananarivo',
            'fichier' => 'demo.jpg',
            'type_categorie' => 'Alimentaire',
            'categorie' => 'Snack',
            'code_compta' => '001-002',
            'stock_minimum' => 10,
            'date_peremption' => '2025-12-31',
            'colonne' => null,
            'colonnes' => null,
        ]);
    }
}
