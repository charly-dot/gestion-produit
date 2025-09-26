<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    use HasFactory;


    protected $fillable = [
        'nomProduit',
        'nom',
        'entrepot',
        'casier',
        'colone1',
        'colone2',
        'colone3',
        'colone4',
        'colone5',
    ];

    public function produit()
    {
        return $this->belongsTo(Produit::class, 'idProduit');
    }
    // public function casier()
    // {
    //     return $this->belongsTo(Casier::class, 'casier', 'id');
    // }
}
