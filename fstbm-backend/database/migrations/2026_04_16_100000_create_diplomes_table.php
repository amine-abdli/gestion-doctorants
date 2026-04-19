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
        Schema::create('diplomes', function (Blueprint $table) {
            $table->id();
            
            // Relation avec doctorant
            $table->foreignId('doctorant_id')->constrained()->onDelete('cascade');
            
            // Informations diplôme
            $table->string('numero_diplome')->nullable()->unique();
            $table->string('mention_fr')->nullable();
            $table->string('mention_arb')->nullable();
            $table->date('date_examen')->nullable();
            $table->date('date_obtention')->nullable();
            
            // Notes et appréciations
         
            
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('diplomes');
    }
};
