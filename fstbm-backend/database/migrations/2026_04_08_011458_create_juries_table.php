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
        Schema::dropIfExists('juries');
        Schema::create('juries', function (Blueprint $table) {
            $table->id();
            $table->string('nom');           // Nom complet (français ou arabe)
            $table->string('specialite')->nullable(); // Spécialité
            $table->string('local')->nullable();      // Établissement/Lieu
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('juries');
    }
};
