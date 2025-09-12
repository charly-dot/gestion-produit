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
            $table->string('idEntrepot')->nullable();
            $table->string('entrepotSource')->nullable();
            $table->string('entrepotFinal')->nullable();
            $table->string('idCasier')->nullable();
            $table->string('casierSource')->nullable();
            $table->string('casierFinal')->nullable();
            $table->string('idProduit')->nullable();
            $table->string('produit')->nullable();
            $table->string('stock')->nullable();
            $table->string('action')->nullable();
            $table->string('utilisateur')->nullable();
            $table->string('zone')->nullable();
            $table->string('colone1')->nullable();
            $table->string('colone2')->nullable();
            $table->string('colone3')->nullable();
            $table->string('colone4')->nullable();
            $table->string('colone5')->nullable();
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
