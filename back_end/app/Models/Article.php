<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;
    protected $fillable = [
        'nom',
        'prix',
        'zone',
        'fichier',
        'type_categorie',
        'categorie',
        'code_compta',
        'stock_minimum',
        'date_peremption',
        'colonne',
        'colonnes',
    ];
}
