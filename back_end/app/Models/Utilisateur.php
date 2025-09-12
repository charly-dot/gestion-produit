<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable; // 👈 changer ici
use Laravel\Sanctum\HasApiTokens;

class Utilisateur extends Authenticatable // 👈 extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $table = 'utilisateurs';

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'sexe',
        'motDePasse',
        'groupe',
        'contact',
        'lecture',
        'suppression',
        'modification',
        'creation',
        'activation',
        'colone',
        'colonee',
        'profil',
    ];

    protected $hidden = ['motDePasse'];
}
