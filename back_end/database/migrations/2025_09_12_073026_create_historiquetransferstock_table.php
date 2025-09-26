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
        Schema::create('historiquetransferstocks', function (Blueprint $table) {
            $table->id();
            $table->string('date')->nullable();
            $table->bigInteger('idEntrepot')->nullable();
            $table->bigInteger('entrepotSource')->nullable();
            $table->bigInteger('entrepotFinal')->nullable();
            $table->bigInteger('idCasier')->nullable();
            $table->bigInteger('casierSource')->nullable();
            $table->bigInteger('casierFinal')->nullable();
            $table->bigInteger('idProduit')->nullable();
            $table->bigInteger('produit')->nullable();
            $table->bigInteger('stock')->nullable();
            $table->string('action')->nullable();
            $table->bigInteger('utilisateur')->nullable();
            $table->string('zone')->nullable();
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
        Schema::dropIfExists('historiquetransferstocks');
    }
};
