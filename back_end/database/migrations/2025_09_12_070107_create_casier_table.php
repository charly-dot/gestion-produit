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
        Schema::create('casiers', function (Blueprint $table) {
            $table->id();
            $table->string('nom')->nullable();
            $table->string('type')->nullable();
            $table->string('etat')->nullable();
            $table->bigInteger('idFournisseur')->nullable();
            $table->bigInteger('idEntrepot')->nullable();
            $table->string('idUtilisateur')->nullable();
            $table->bigInteger('stock')->nullable();
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
        Schema::dropIfExists('casiers');
    }
};
