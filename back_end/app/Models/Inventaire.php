<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventaire extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'idEntrepot',
        'idCasier',
        'idProduit',
        'dateCreation',
        'reference',
        'colone1',
        'colone2',
        'colone3',
        'colone4',
        'colone5',
    ];
}
