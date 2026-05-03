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
       Schema::create('doctorant_jury', function (Blueprint $table) {
    $table->id();

    $table->foreignId('doctorant_id')->constrained()->onDelete('cascade');
    $table->foreignId('jury_id')->constrained()->onDelete('cascade');

    $table->string('role');
    $table->string('grade');
    $table->string('local');
    $table->string('nom_modifier');

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctorant_jury');
    }
};
