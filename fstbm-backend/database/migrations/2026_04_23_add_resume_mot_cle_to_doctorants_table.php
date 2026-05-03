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
            $table->text('resume')->nullable()->after('local_soutenance');
            $table->text('mot_cle')->nullable()->after('resume');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('doctorants', function (Blueprint $table) {
            $table->dropColumn(['resume', 'mot_cle']);
        });
    }
};
