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
            $table->string('idFournisseur')->nullable();
            $table->string('idEntrepot')->nullable();
            $table->string('idUtilisateur')->nullable();
            $table->string('stock')->nullable();
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
        Schema::dropIfExists('casiers');
    }
};
