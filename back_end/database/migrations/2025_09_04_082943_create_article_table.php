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
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('prix');
            $table->string('zone');
            $table->string('fichier');
            $table->string('type_categorie');
            $table->string('categorie');
            $table->string('code_compta');
            $table->string('stock_minimum');
            $table->string('date_peremption');
            $table->string('colonne');
            $table->string('colonnes');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
