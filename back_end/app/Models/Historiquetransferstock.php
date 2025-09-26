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
        'created_at',
        'zone',
        'colone1',
        'colone2',
        'colone3',
        'colone4',
        'colone5',
    ];
    public function user()
    {
        return $this->belongsTo(User::class, 'colone5', 'id');
    }
    // public function casierFinalRel()
    // {
    //     return $this->belongsTo(Casier::class, 'casierFinal', 'id');
    // }
}
