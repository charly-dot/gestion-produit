<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    use HasFactory;


    protected $fillable = [
        'nomProduit',
        'idProduit',
        'entrepot',
        'casier',
        'colonne',
        'colonnes',
    ];

    public function produit()
    {
        return $this->belongsTo(Produit::class, 'idProduit');
    }
}
