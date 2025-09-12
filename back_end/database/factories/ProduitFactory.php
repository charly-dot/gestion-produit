<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Produit;

class ProduitFactory extends Factory
{
    protected $model = Produit::class;

    public function definition()
    {
        return [
            'nomProduit' => $this->faker->word,
            'prix' => $this->faker->numberBetween(1000, 50000),
            'stock_initia' => $this->faker->numberBetween(10, 200),
            'zone' => $this->faker->city,
            'fichier' => $this->faker->word . '.jpg',
            'type_categorie' => $this->faker->randomElement(['Alimentaire', 'Electronique', 'Textile']),
            'categorie' => $this->faker->word,
            'code_compta' => $this->faker->numerify('###-###'),
            'stock_minimum' => $this->faker->numberBetween(5, 50),
            'date_peremption' => $this->faker->date('Y-m-d', '2026-12-31'),
            // Colonnes laissées vides
            'colonne' => null,
            'colonnes' => null,
        ];
    }
}
