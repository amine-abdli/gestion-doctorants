<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Doctorant extends Model
{
    use HasFactory;

    protected $fillable = [
     
        'nmb_inscription',
        'nomfr',
        'nomarb',
        'cin',
        'date_naissance',
        'lieu_naissance_arb',
        'discipline_fr',
        'discipline_arb',
        'specialite_fr',
        'specialite_arb',
        'sujet_fr',
        
        'status',
    ];

    /**
     * Un doctorant a plusieurs membres de jury via la table pivot
     */
    public function juries()
    {
        return $this->belongsToMany(Jury::class, 'doctorant_jury')
            ->withPivot('role', 'grade', 'local')
            ->withTimestamps();
    }

    /**
     * Un doctorant peut avoir plusieurs diplômes
     */
    public function diplomes()
    {
        return $this->hasMany(Diplome::class);
    }
}
