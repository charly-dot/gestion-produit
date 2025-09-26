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
        Schema::create('mouvementstocks', function (Blueprint $table) {
            $table->id();
            $table->string('date')->nullable();
            $table->bigInteger('idEntrepot')->nullable();
            $table->bigInteger('entrepot')->nullable();
            $table->bigInteger('idCasier')->nullable();
            $table->bigInteger('casier')->nullable();
            $table->bigInteger('idProduit')->nullable();
            $table->bigInteger('produit')->nullable();
            $table->bigInteger('stock')->nullable();
            $table->string('action')->nullable();
            $table->bigInteger('utilisateur')->nullable();
            $table->string('zone')->nullable();
            $table->bigInteger('stockCour')->nullable();
            $table->bigInteger('stockFinal')->nullable();
            $table->string('documentLier')->nullable();
            $table->string('raison')->nullable();
            $table->string('colone1')->nullable();
            $table->string('colone2')->nullable();
            $table->string('colone3')->nullable();
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
        Schema::dropIfExists('mouvementstocks');
    }
};
