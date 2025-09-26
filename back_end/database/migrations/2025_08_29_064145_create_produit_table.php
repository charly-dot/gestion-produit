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
            $table->bigInteger('prix')->nullable();
            $table->bigInteger('stock_initia')->nullable();
            $table->bigInteger('stock_Encours1')->nullable();
            $table->bigInteger('stock_Encours2')->nullable();
            $table->string('zone')->nullable();
            $table->string('fichier')->nullable();
            $table->string('etat')->nullable();
            $table->string('type_categorie')->nullable();
            $table->string('categorie')->nullable();
            $table->string('code_compta')->nullable();
            $table->bigInteger('stock_minimum')->nullable();
            $table->bigInteger('idStockage')->nullable();
            $table->string('date_peremption')->nullable();
            $table->string('colone1')->nullable();
            $table->string('colone2')->nullable();
            $table->bigInteger('colone3')->nullable();
            $table->bigInteger('colone4')->nullable();
            $table->bigInteger('colone5')->nullable();
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
