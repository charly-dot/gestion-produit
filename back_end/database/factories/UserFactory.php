<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\User;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition()
    {
        $sexe = $this->faker->randomElement(['Homme', 'Femme']);

        return [
            'name' => $this->faker->lastName,
            'prenom' => $this->faker->firstName($sexe === 'Homme' ? 'male' : 'female'),
            'email' => $this->faker->unique()->safeEmail,
            'password' => bcrypt('password'), // mot de passe par défaut
            'sexe' => $sexe,
            'groupe' => $this->faker->randomElement(['admin', 'editeur', 'user']),
            'contact' => $this->faker->phoneNumber,

            // Permissions (1 = activé)
            'lecture' => 1,
            'suppression' => 1,
            'modification' => 1,
            'creation' => 1,
            'activation' => 1,

            'colone' => $this->faker->word,
            'colonee' => $this->faker->word,
            'colone3' => $this->faker->word,
            'colone4' => $this->faker->word,
            'colone5' => $this->faker->word,
            'profil' => $this->faker->randomElement(['superadmin', 'manager', 'staff']),

            'remember_token' => Str::random(10),
        ];
    }
}
