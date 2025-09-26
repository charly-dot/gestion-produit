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
        Schema::create('entrepots', function (Blueprint $table) {
            $table->id();
            $table->string('nom')->nullable();
            $table->bigInteger('idCasier')->nullable();
            $table->string('etat')->nullable();
            $table->string('zone')->nullable();
            $table->bigInteger('stock')->nullable();
            $table->bigInteger('stockTotal')->nullable();
            $table->bigInteger('idUtilisateur')->nullable();
            $table->bigInteger('idProduit')->nullable();
            $table->string('action')->nullable();
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
        Schema::dropIfExists('entrepots');
    }
};
