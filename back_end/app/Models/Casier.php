<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Casier extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'type',
        'etat',
        'idFournisseur',
        'idEntrepot',
        'idUtilisateur',
        'stock',
        'colone1',
        'colone2',
        'colone3',
        'colone4',
        'colone5',
    ];
    // public function stocks()
    // {
    //     return $this->hasMany(Stock::class, 'casier', 'nom')
    //         ->select(['id', 'nomProduit', 'casier']);
    // }

    // public function transferts()
    // {
    //     return $this->hasMany(Historiquetransferstock::class, 'casierFinal', 'nom')
    //         ->select(['id', 'produit', 'stock', 'casierFinal']);
    // }
}
