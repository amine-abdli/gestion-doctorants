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
        Schema::dropIfExists('doctorants');
        Schema::create('doctorants', function (Blueprint $table) {
            $table->id();
      
            $table->string('nmb_inscription')->unique();
            $table->string('nomfr')->nullable();
            $table->string('nomarb')->nullable();
            $table->string('cin')->unique();
            $table->date('date_naissance')->nullable();
            $table->string('lieu_naissance_arb')->nullable();
            $table->string('discipline_fr')->nullable();
            $table->string('discipline_arb')->nullable();
            $table->string('specialite_fr')->nullable();
            $table->string('specialite_arb')->nullable();
            $table->string('sujet_fr')->nullable();
      
            $table->string('status')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctorants');
    }
};
