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
        Schema::table('juries', function (Blueprint $table) {
            if (!Schema::hasColumn('juries', 'F')) {
                $table->boolean('F')->default(false)->after('local');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('juries', function (Blueprint $table) {
            if (Schema::hasColumn('juries', 'F')) {
                $table->dropColumn('F');
            }
        });
    }
};
