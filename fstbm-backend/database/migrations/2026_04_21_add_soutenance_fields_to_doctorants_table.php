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
        Schema::table('doctorants', function (Blueprint $table) {
            $table->date('date_descution_jury')->nullable()->after('sujet_fr');
            $table->time('heure_soutenance')->nullable()->after('date_descution_jury');
            $table->string('local_soutenance')->nullable()->after('heure_soutenance');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('doctorants', function (Blueprint $table) {
            $table->dropColumn(['date_descution_jury', 'heure_soutenance', 'local_soutenance']);
        });
    }
};
