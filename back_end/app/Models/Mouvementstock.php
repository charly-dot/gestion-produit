<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mouvementstock extends Model
{
    use HasFactory;
    protected $fillable = [
        'date',
        'idEntrepot',
        'entrepot',
        'idCasier',
        'casier',
        'idProduit',
        'produit',
        'stock',
        'action',
        'raison',
        'utilisateur',
        'zone',
        'stockCour',
        'stockFinal',
        'documentLier',
        'colone1',
        'colone2',
        'colone3',
        'colone4',
        'colone5',
    ];
    // Mouvementstock.php
    public function user()
    {
        return $this->belongsTo(User::class, 'colone5', 'id');
    }
}
