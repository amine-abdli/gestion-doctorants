<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jury extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'nomarb',
        'specialite',
        'local',
        'F',
    ];

    protected $casts = [
        'F' => 'boolean',
    ];

    /**
     * Un jury peut participer à plusieurs soutenances (doctorants)
     */
    public function doctorants()
    {
        return $this->belongsToMany(Doctorant::class, 'doctorant_jury')
            ->withPivot('role', 'grade', 'rolearb', 'graderb', 'nom_modifier', 'local')
            ->withTimestamps();
    }
}