<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Tier;

class TierFactory extends Factory
{
    protected $model = Tier::class;

    public function definition()
    {
        return [
            'nomTier' => $this->faker->company,
            'zone' => $this->faker->city,
            'type' => $this->faker->randomElement(['Client', 'Fournisseur']),
            'motDePasse' => bcrypt('password'), // mot de passe par défaut
            'email' => $this->faker->unique()->safeEmail,
            'contact' => $this->faker->phoneNumber,
            'nif' => $this->faker->numerify('#########'),
            'stat' => $this->faker->numerify('########'),
            'rcs' => $this->faker->numerify('########'),
            'commercial' => $this->faker->name,
            'colonne' => $this->faker->word,
            'colonnes' => $this->faker->word,
        ];
    }
}
