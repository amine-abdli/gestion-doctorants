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
            $table->string('nom');   
            $table->string('nomarb')->nullable();   
            $table->string('specialite')->nullable();
            $table->string('local')->nullable();     
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
