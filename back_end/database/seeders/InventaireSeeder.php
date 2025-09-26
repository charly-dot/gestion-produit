<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Inventaire;

class InventaireSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Préfixes possibles pour la référence (tu peux ajouter les 3 lettres que tu veux)
        $prefixes = ['FEV', 'OCT', 'MAR', 'JAN', 'AOU']; // exemple

        // Date de départ pour dateCreation (tu peux modifier)
        $startDate = strtotime('2025-09-01');

        for ($i = 1; $i <= 20; $i++) {
            // choisir un préfixe aléatoire et un nombre à 4 chiffres
            $prefix = $prefixes[array_rand($prefixes)];
            $number = str_pad(mt_rand(0, 9999), 4, '0', STR_PAD_LEFT);
            $reference = $prefix . $number;

            Inventaire::create([
                'date'         => null, // champ "date" vide comme demandé
                'idEntrepot'   => mt_rand(1, 10),
                'idCasier'     => mt_rand(1, 8),
                'idProduit'    => mt_rand(1, 8),
                'dateCreation' => date('Y-m-d', strtotime("+" . ($i - 1) . " days", $startDate)),
                'reference'    => $reference,
                'colone1'      => 'Item ' . $i,
                'colone2'      => null,
                'colone3'      => null,
                'colone4'      => null,
                'colone5'      => mt_rand(1, 8),
            ]);
        }
    }
}
