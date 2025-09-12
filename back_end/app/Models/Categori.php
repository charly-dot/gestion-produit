<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categori extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'type',
        'visibiliter',
        'etat',
        'fichier',
        'colonne',
        'colonnes',
    ];
}
