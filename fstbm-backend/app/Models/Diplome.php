<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Diplome extends Model
{
    use HasFactory;

    protected $fillable = [
        'doctorant_id',
        'numero_diplome',
        'mention_fr',
        'mention_arb',
        'date_examen',
        'date_obtention',
        
    ];

    protected $casts = [
        'date_examen' => 'date',
        'date_obtention' => 'date',
        
    ];

    /**
     * Un diplôme appartient à un doctorant
     */
    public function doctorant()
    {
        return $this->belongsTo(Doctorant::class);
    }
}
