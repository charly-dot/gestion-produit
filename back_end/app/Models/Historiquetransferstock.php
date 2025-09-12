<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Historiquetransferstock extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'idEntrepot',
        'entrepotSource',
        'entrepotFinal',
        'idCasier',
        'casierSource',
        'casierFinal',
        'idProduit',
        'produit',
        'stock',
        'action',
        'utilisateur',
        'zone',
        'colone1',
        'colone2',
        'colone3',
        'colone4',
        'colone5',
    ];
}
