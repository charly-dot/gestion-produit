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
        Schema::create('tiers', function (Blueprint $table) {
            $table->id();
            $table->string('nomTier');
            $table->string('zone');
            $table->string('type');
            $table->string('motDePasse');
            $table->string('email');
            $table->string('contact');
            $table->string('nif');
            $table->string('stat');
            $table->string('rcs');
            $table->string('commercial');
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
        Schema::dropIfExists('tiers');
    }
};
