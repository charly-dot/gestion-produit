<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        // Crée 10 utilisateurs aléatoires
        User::factory()->count(10)->create();

        // Crée un utilisateur fixe pour démonstration
        User::create([
            'name' => 'Admin',
            'prenom' => 'Super',
            'email' => 'admin@example.com',
            'password' => bcrypt('admin123'),
            'sexe' => 'Homme',
            'groupe' => 'admin',
            'contact' => '034 12 345 67',
            'lecture' => 1,
            'suppression' => 1,
            'modification' => 1,
            'creation' => 1,
            'activation' => 1,
            'colone'   => 1,
            'colonee'  => 1,
            'colone3'  => 1,
            'colone4'  => 1,
            'colone5'  => 1,
            'profil' => 'superadmin',
        ]);
    }
}
