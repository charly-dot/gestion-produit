<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{
    use HasFactory;
    protected $fillable = [
        'nomProduit',
        'prix',
        'stock_initia',
        'zone',
        'etat',
        'idStockage',
        'stock_Encours1',
        'stock_Encours2',
        'fichier',
        'type_categorie',
        'categorie',
        'code_compta',
        'stock_minimum',
        'date_peremption',
        'colonne',
        'colonnes',
    ];
    public function stocks()
    {
        return $this->hasMany(Stock::class, 'idProduit');
    }
}
