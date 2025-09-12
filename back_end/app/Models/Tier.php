<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tier extends Model
{
    use HasFactory;

    protected $fillable = [
        'nomTier',
        'zone',
        'type',
        'motDePasse',
        'email',
        'contact',
        'nif',
        'stat',
        'rcs',
        'commercial',
        'colonne',
        'colonnes',
    ];
}
