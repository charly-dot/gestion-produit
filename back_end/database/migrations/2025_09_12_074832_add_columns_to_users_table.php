<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('prenom')->nullable()->after('name');
            $table->string('sexe')->nullable()->after('prenom');
            $table->string('groupe')->nullable()->after('sexe');
            $table->string('contact')->nullable()->after('groupe');
            $table->boolean('lecture')->default(1)->after('contact');
            $table->boolean('suppression')->default(1)->after('lecture');
            $table->boolean('modification')->default(1)->after('suppression');
            $table->boolean('creation')->default(1)->after('modification');
            $table->boolean('activation')->default(1)->after('creation');
            $table->string('colone')->nullable()->after('activation');
            $table->string('colonee')->nullable()->after('colone');
            $table->string('colone3')->nullable()->after('colonee');
            $table->string('colone4')->nullable()->after('colone3');
            $table->string('colone5')->nullable()->after('colone4');
            $table->string('profil')->nullable()->after('colone5');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'prenom',
                'sexe',
                'groupe',
                'contact',
                'lecture',
                'suppression',
                'modification',
                'creation',
                'activation',
                'colone',
                'colonee',
                'colone3',
                'colone4',
                'colone5',
                'profil',
            ]);
        });
    }
};
