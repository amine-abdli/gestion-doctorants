<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jury extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'specialite',
        'local',
    ];

    /**
     * Un jury peut participer à plusieurs soutenances (doctorants)
     */
    public function doctorants()
    {
        return $this->belongsToMany(Doctorant::class, 'doctorant_jury')
            ->withPivot('role', 'grade', 'local')
            ->withTimestamps();
    }
}