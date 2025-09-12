<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('utilisateurs', function (Blueprint $table) {
            $table->id(); // id auto-incrément
            $table->string('nom');
            $table->string('prenom');
            $table->string('sexe');
            $table->string('motDePasse'); // tu peux renommer en password
            $table->string('groupe'); // rôle
            $table->string('contact')->nullable();
            $table->string('profil')->nullable(); // chemin image
            $table->string('email')->unique(); // email unique
            $table->boolean('lecture')->default(false);
            $table->boolean('suppression')->default(false);
            $table->boolean('modification')->default(false);
            $table->boolean('creation')->default(false);
            $table->boolean('activation')->default(false);
            $table->boolean('colone')->default(false);
            $table->boolean('colonee')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('utilisateurs');
    }
};
