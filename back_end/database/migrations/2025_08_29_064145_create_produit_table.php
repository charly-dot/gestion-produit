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
        Schema::create('produits', function (Blueprint $table) {
            $table->id();
            $table->string('nomProduit');
            $table->string('prix')->nullable();
            $table->string('stock_initia')->nullable();
            $table->string('zone')->nullable();
            $table->string('fichier')->nullable();
            $table->string('type_categorie')->nullable();
            $table->string('categorie')->nullable();
            $table->string('code_compta')->nullable();
            $table->string('stock_minimum')->nullable();
            $table->string('date_peremption')->nullable();
            $table->string('colonne')->nullable();
            $table->string('colonnes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produits');
    }
};
