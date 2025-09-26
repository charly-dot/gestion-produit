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
            'name'       => $this->faker->lastName,
            'prenom'     => $this->faker->firstName($sexe === 'Homme' ? 'male' : 'female'),
            'email'      => $this->faker->unique()->safeEmail,
            'password'   => bcrypt('password'), // mot de passe par défaut
            'sexe'       => $sexe,

            // ✅ Groupe métier plus réaliste
            'groupe'     => $this->faker->randomElement(['fournisseur', 'consommateur', 'entité']),

            'contact'    => $this->faker->phoneNumber,

            // ✅ Permissions aléatoires
            'lecture'     => 1,
            'suppression' => 1,
            'modification' => 1,
            'creation'    => 1,
            'activation' => $this->faker->randomElement(['Activé', 'Désactivé']),

            // ✅ Colonnes factices (mais plus parlantes)
            'colone'   => 1,
            'colonee'  => 1,
            'colone3'  => 1,
            'colone4'  => 1,
            'colone5'  => 1,

            // ✅ Profil lié au groupe
            'profil'   => $this->faker->randomElement(['superadmin', 'manager', 'staff']),

            'remember_token' => Str::random(10),
        ];
    }
}
