<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Utilisateur;

class UtilisateurSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $utilisateurs = [
            [
                'nom' => 'Rakoto',
                'prenom' => 'Jean',
                'email' => 'jean.rakoto@example.mg',
                'sexe' => 'Homme',
                'motDePasse' => '1234Rakoto',
                'groupe' => 'consommateur',
                'contact' => '0321234567',
                'profil' => null,
            ],
            [
                'nom' => 'Randria',
                'prenom' => 'Marie',
                'email' => 'marie.randria@example.mg',
                'sexe' => 'Femme',
                'motDePasse' => '1234Randria',
                'groupe' => 'fournisseur',
                'contact' => '0339876543',
                'profil' => null,
            ],
            [
                'nom' => 'Rasolonirina',
                'prenom' => 'Paul',
                'email' => 'paul.rasolonirina@example.mg',
                'sexe' => 'Homme',
                'motDePasse' => '1234Paul',
                'groupe' => 'fournisseur',
                'contact' => '0341122334',
                'profil' => null,
            ],
            [
                'nom' => 'Ravelo',
                'prenom' => 'Claudine',
                'email' => 'claudine.ravelo@example.mg',
                'sexe' => 'Femme',
                'motDePasse' => '1234Ravelo',
                'groupe' => 'consommateur',
                'contact' => '0329988776',
                'profil' => null,
            ],
        ];

        foreach ($utilisateurs as $data) {
            Utilisateur::create($data);
        }
    }
}
