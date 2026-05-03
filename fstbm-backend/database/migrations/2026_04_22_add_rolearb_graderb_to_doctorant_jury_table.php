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
        Schema::table('doctorant_jury', function (Blueprint $table) {
            $table->string('rolearb')->nullable()->after('role');
            $table->string('graderb')->nullable()->after('grade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('doctorant_jury', function (Blueprint $table) {
            $table->dropColumn(['rolearb', 'graderb']);
        });
    }
};
