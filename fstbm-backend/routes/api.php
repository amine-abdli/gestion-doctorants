<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\DoctorantController;
use App\Http\Controllers\Api\JuryController;
use App\Http\Controllers\Api\DiplomeController;

use Illuminate\Http\Request;
use App\Models\Doctorant;
use App\Models\Jury;
use PhpOffice\PhpWord\TemplateProcessor;


Route::get('/doctorants',          [DoctorantController::class, 'index']);
Route::post('/doctorants',         [DoctorantController::class, 'store']);
Route::get('/doctorants/{id}',     [DoctorantController::class, 'show']);
Route::put('/doctorants/{id}',     [DoctorantController::class, 'update']);
Route::delete('/doctorants/{id}',  [DoctorantController::class, 'destroy']);


Route::get('/juries',                        [JuryController::class, 'index']);
Route::post('/juries',                       [JuryController::class, 'store']);
Route::get('/juries/{id}',                   [JuryController::class, 'show']);
Route::put('/juries/{id}',                   [JuryController::class, 'update']);
Route::delete('/juries/{id}',                [JuryController::class, 'destroy']);
Route::post('/juries/{id}/attach',           [JuryController::class, 'attachDoctorant']);


Route::get('/diplomes',                      [DiplomeController::class, 'index']);
Route::post('/diplomes',                     [DiplomeController::class, 'store']);
Route::get('/diplomes/{id}',                 [DiplomeController::class, 'show']);
Route::put('/diplomes/{id}',                 [DiplomeController::class, 'update']);
Route::delete('/diplomes/{id}',              [DiplomeController::class, 'destroy']);
Route::get('/diplomes/doctorant/{doctorantId}', [DiplomeController::class, 'byDoctorant']);




$convertToArabicDigits = function($number) {
    $western = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    $arabic = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return str_replace($western, $arabic, $number);
};


$convertDateToArabic = function($date, $useArabicNumerals = false) use ($convertToArabicDigits) {
    if (!$date) return '........................';
    
    $arabicMonths = [
          'يناير',    
        'فبراير',   
        ' مارس',     
        'أبريل',   
        'مايو',     
        'يونيو',   
        'يوليو',  
        'أغسطس',     
        'سبتمبر' ,   
        'أكتوبر',  
        'نوفمبر',  
        'ديسمبر'   
    ];
    
    try {
        $carbon = \Carbon\Carbon::parse($date);
        $day = $carbon->format('d');
        $monthIndex = (int)$carbon->format('m') - 1;
        $year = $carbon->format('Y');
        

        if ($useArabicNumerals) {
            $day = $convertToArabicDigits($day);
            $year = $convertToArabicDigits($year);
        }
        
        $monthName = $arabicMonths[$monthIndex] ?? '';
        
        return $year  . " "  . $monthName . " " .  $day ;
    } catch (\Exception $e) {
        return '........................';
    }
};
$reverselenom = function($nom) {
    if (!$nom) return '';
    $parts = explode(' ', $nom);
    return implode(' ', array_reverse($parts));
};

$convertDateToFrench = function($date) {
    if (!$date) return '........................';
    
    $mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    $carbon = \Carbon\Carbon::parse($date);
    $day = $carbon->format('d');
    $monthIndex = (int)$carbon->format('m') - 1;
    $year = $carbon->format('Y');
    
    return " " . $day  . "   "  . $mois[$monthIndex] . "   " .  $year ;
};

Route::get('/generate-avis-soutenance', function (Request $request) use ($convertDateToFrench) {
    try {
        $doctorant = Doctorant::with('juries')->findOrFail($request->doctorantId);
        
        $templatePath = storage_path('app/Avis_Soutenance_ Exemple.docx');

        if (!file_exists($templatePath)) {
            return response()->json([
                'message' => 'Template file not found',
                'path' => $templatePath
            ], 404);
        }

        $template = new TemplateProcessor($templatePath);

        $template->setValue('nomfr', $doctorant->nomfr ?? '');
        $template->setValue('sujet', $doctorant->sujet_fr ?? '');
        $template->setValue('date', $convertDateToFrench($doctorant->date_descution_jury));
        $template->setValue('heure', $doctorant->heure_soutenance ?? '');
        $template->setValue('local', $doctorant->local_soutenance ?? '');
        $template->setValue('resume', $doctorant->resume ?? '');
        $template->setValue('mot_cle', $doctorant->mot_cle ?? '');


        $juries = $doctorant->juries;
        $groupedJuries = [];
        
        foreach ($juries as $jury) {
            $nom = $jury->nom ?? '';
            if (!isset($groupedJuries[$nom])) {
                $groupedJuries[$nom] = [
                    'id'=>$jury->id,
                    'nom' => $nom ,
                    'grade' => $jury->pivot->grade ?? '',
                    'local' => $jury->pivot->local ?? '',
                    'roles' => [],
                    'F' => (bool) $jury->F
                ];
            }
            $role = $jury->pivot->role ?? '';
            if (!in_array($role, $groupedJuries[$nom]['roles']) && $role !== '') {
                $groupedJuries[$nom]['roles'][] = $role;
            }
        }

$priority = [
    // Masculine
    'Président' => 1,
    'Rapporteur' => 2,
    'Examinateur' => 3,
    'Co-directeur de thèse' => 4,
    'Directeur de thèse' => 5,
    'Co-encadrant' => 6,
    'Encadrant' => 7,
    'Invité' => 8,
    'Membre' => 9,
    // Feminine
    'Présidente' => 1,
    'Rapporteuse' => 2,
    'Examinatrice' => 3,
    'Co-Directrice de thèse' => 4,
    'Directrice de thèse' => 5,
    'Co-encadrante' => 6,
    'Encadrante' => 7,
    'Invitée' => 8,
];

usort($groupedJuries, function ($a, $b) use ($priority) {
    $rolesA = $a['roles'] ?? [];
    $rolesB = $b['roles'] ?? [];
    $minA = 99;
    foreach ($rolesA as $r) {
        $minA = min($minA, $priority[$r] ?? 99);
    }
    $minB = 99;
    foreach ($rolesB as $r) {
        $minB = min($minB, $priority[$r] ?? 99);
    }
    return $minA <=> $minB;
});

// Remplir le tableau du jury avec cloneRow
$groupedJuriesArray = array_values($groupedJuries);
$juryCount = count($groupedJuriesArray);

if ($juryCount > 0) {
    try {
        $template->cloneRow('id', $juryCount);

        foreach ($groupedJuriesArray as $index => $jury) {
            $i = $index + 1;
            $roles = $jury['roles'] ?? [];

            usort($roles, function ($a, $b) use ($priority) {
                return ($priority[$a] ?? 99) <=> ($priority[$b] ?? 99);
            });

            $rolesStr = implode(', ', $roles);

            $gradadd = function($gr) use ($jury) {
                if ($gr == 'Professeur de l\'enseignement superieur' || $gr == 'Professeure de l\'enseignement superieur') {
                    return $jury['F'] ? 'Professeure' : 'Professeur';
                }
                return $gr;
            };

            $titre = $jury['F'] ? 'Madame' : 'Monsieur';
            $template->setValue("id#$i", $jury['id']);

            $template->setValue("jury_nom#$i", $titre . ' ' . $jury['nom']);
            $template->setValue("jury_grade#$i", $gradadd($jury['grade']));
            $template->setValue("jury_local#$i", $jury['local']);
            $template->setValue("jury_roles#$i", $rolesStr);
        }
    } catch (\Exception $e) {
        // Fallback: utiliser jury_liste en texte si le tableau n'existe pas dans le template
        $juriesText = '';
        foreach ($groupedJuriesArray as $jury) {
            $roles = $jury['roles'] ?? [];
            usort($roles, function ($a, $b) use ($priority) {
                return ($priority[$a] ?? 99) <=> ($priority[$b] ?? 99);
            });
            $rolesStr = implode(', ', $roles);

            if ($jury['F']) {
                $juriesText .= "• Madame {$jury['nom']} : {$jury['grade']}, {$jury['local']}, {$rolesStr} ;\n";
            } else {
                $juriesText .= "• Monsieur {$jury['nom']} : {$jury['grade']}, {$jury['local']}, {$rolesStr} ;\n";
            }
        }
        $template->setValue('jury_liste', trim($juriesText));
    }
}

        $fileName = 'avis_soutenance_' . $doctorant->nom . '_' . time() . '.docx';
        $path = storage_path('app/' . $fileName);
        $template->saveAs($path);

        return response()->download($path)->deleteFileAfterSend(true);

    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        return response()->json(['message' => 'Doctorant non trouvé'], 404);
    } catch (\Exception $e) {
        return response()->json([
            'message' => $e->getMessage(),
            'file'    => $e->getFile(),
            'line'    => $e->getLine()
        ], 500);
    }
});

// $tabloudejury = function($juries) {
//     $groupedJuries = [];
    
    
//        if ($jury->rolearb->contains('رئيسا')) {
//           $nom = $jury->nom_modifier ?? '';
//           if (!isset($groupedJuries[$nom])) {
//               $groupedJuries[$nom] = [
//                   'nom' => $nom,
//                   'grade' => $jury->graderb ?? '',
//                   'local' => $jury->local ?? '',
//                   'roles' => 
//               ];
//           }
//         } 
    
    
//     return array_values($groupedJuries);5
// };
Route::get('/generate-word', function (Request $request) use ($convertDateToArabic, $reverselenom, $convertDateToFrench) {
    try { 
        $doctorant = Doctorant::with(['juries', 'diplomes'])
            ->findOrFail($request->doctorantId);

        $templatePath = storage_path('app/template.docx');

        if (!file_exists($templatePath)) {
            return response()->json([
                'message' => 'Template file not found',
                'path' => $templatePath
            ], 404);
        }
         
        $template = new TemplateProcessor($templatePath);

        $template->setValue('nom', $doctorant->nomarb ?? '');
        $template->setValue('date_naissance', $convertDateToArabic($doctorant->date_naissance));
        $template->setValue('nmb_inscription', $doctorant->nmb_inscription ?? '');
        $template->setValue('lieu', $doctorant->lieu_naissance_arb ?? '');
        $template->setValue('discipline', $doctorant->discipline_arb ?? '');
        $template->setValue('specialite', $doctorant->specialite_arb ?? '');
        $template->setValue('cin', $doctorant->cin ?? '');
        $template->setValue('nomfr', $doctorant->nomfr ?? '');
        $template->setValue('disciplinefr', $doctorant->discipline_fr ?? '');
        $template->setValue('specialitefr', $doctorant->specialite_fr ?? '');
        $template->setValue('sujet', $doctorant->sujet_fr ?? '');

        $juries = $doctorant->juries;
        
        if ($juries->count() > 0) {
             $juries = $juries->sortByDesc(function ($jury) {
        return $jury->pivot->rolearb === 'رئيسا';
    });
            try {
                $template->cloneRow('jury_nom_modifier', $juries->count());
                
                $index = 1;
                foreach ($juries as $jury) {
                    $template->setValue("jury_nom_modifier#$index", $reverselenom($jury->pivot->nom_modifier ?? ''));

                    $template->setValue("jury_graderb#$index", $jury->pivot->graderb ?? '');
                    $template->setValue("jury_rolearb#$index", $jury->pivot->rolearb ?? '');
                    $index++;
                }
            } catch (\Exception $e) {
                $juriesText = '';
                foreach ($juries as $jury) {
                    $juriesText .= "{$jury->pivot->nom_modifier}: {$jury->pivot->graderb}, {$jury->pivot->rolearb}\n";
                }
                $template->setValue('jury_liste', trim($juriesText));
            }
        }

        $diplomes = $doctorant->diplomes;
        if ($diplomes->count() > 0) {
            try {
                $template->cloneRow('numero_diplome', $diplomes->count());
                foreach ($diplomes as $index => $diplome) {
                    $i = $index + 1;
                    $template->setValue("numero_diplome#$i", $diplome->numero_diplome ?? '');
                    $template->setValue("mention_fr#$i", $diplome->mention_fr ?? '');
                    $template->setValue("mention_arb#$i", $diplome->mention_arb ?? '');

                    $template->setValue("dateExam#$i", $convertDateToArabic($diplome->date_examen));
                    $template->setValue("dateObt#$i", $convertDateToArabic($diplome->date_obtention));
                }
            } catch (\Exception $e) {
                $diplome = $diplomes->first();
                $template->setValue("numero_diplome", $diplome->numero_diplome ?? '');
                $template->setValue("mention_fr", $diplome->mention_fr ?? '');
                $template->setValue("mention_arb", $diplome->mention_arb ?? '');
                
                $template->setValue("dateExam", $convertDateToArabic($diplome->date_examen));
                $template->setValue("dateObt", $convertDateToArabic($diplome->date_obtention));
            }
        }

        $fileName = 'rapport_' . $doctorant->id . '_' . time() . '.docx';
        $path = storage_path('app/' . $fileName);

        $template->saveAs($path);

        return response()->download($path)->deleteFileAfterSend(true);

    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        return response()->json(['message' => 'Doctorant non trouvé'], 404);
    } catch (\Exception $e) {
        return response()->json([
            'message' => $e->getMessage(),
            'file'    => $e->getFile(),
            'line'    => $e->getLine()
        ], 500);
    }
});

$convertDateToFrenchForInvitation = function($date) {
    if (!$date) return '........................';
    
    $mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    $carbon = \Carbon\Carbon::parse($date);
    $day = $carbon->format('d');
    $monthIndex = (int)$carbon->format('m') - 1;
    $year = $carbon->format('Y');
    
    return " " . $day  . "   "  . $mois[$monthIndex] . "   " .  $year ;
};

Route::get('/generate-attestation', function (Request $request) use ($convertDateToArabic ,$convertDateToFrenchForInvitation ) {
    try {
        $doctorant = Doctorant::findOrFail($request->doctorantId);
        $juryId = $request->juryId;
        $nomJury = $request->nomJury;
        $roleJury = $request->roleJury;

        $templatePath = storage_path('app/attaestation_menber_jury.docx');

        if (!file_exists($templatePath)) {
            return response()->json([
                'message' => 'Template attestation not found',
                'path' => $templatePath
            ], 404);
        }

        $template = new TemplateProcessor($templatePath);
        $jury = Jury::findOrFail($juryId);
        $isFeminin = (bool) $jury->F;

        $template->setValue('nom_jury', $nomJury ?? '');
        $template->setValue('role_jury', $roleJury ?? '');
        $template->setValue('genre', $isFeminin ? 'la Professeure' : 'le Professeur');
        $template->setValue('nom_doctor', $doctorant->nomfr ?? '');
        $template->setValue('date', $convertDateToFrenchForInvitation($doctorant->date_descution_jury ?? ''));
        $template->setValue('sujet', $doctorant->sujet_fr ?? '');

        // Générer le fichier
        $fileName = 'attestation_' . $juryId . '_' . time() . '.docx';
        $path = storage_path('app/' . $fileName);

        $template->saveAs($path);

        return response()->download($path)->deleteFileAfterSend(true);

    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        return response()->json(['message' => 'Doctorant non trouvé'], 404);
    } catch (\Exception $e) {
        return response()->json([
            'message' => $e->getMessage(),
            'file'    => $e->getFile(),
            'line'    => $e->getLine()
        ], 500);
    }
});



$phraseDepresed = function($role, $nomdoctor, $isFeminin = false) {
    $titre = $isFeminin ? 'Madame' : 'Monsieur';
    if ($role === 'Président' || $role === 'Présidente') {
        return "J'ai l'honneur de vous inviter à présider le jury de soutenance de Doctorat de $nomdoctor";
    } else {
        return "J'ai l'honneur de vous inviter à faire partie du jury de soutenance de Doctorat de $nomdoctor";
    }
};

Route::get('/generate-invitation', function (Request $request) use ($convertDateToFrenchForInvitation, $phraseDepresed) {
    try {
        $doctorant = Doctorant::findOrFail($request->doctorantId);
        $juryId = $request->juryId;
        $nomJury = $request->nomJury;
        $roleJury = $request->roleJury;

        $templatePath = storage_path('app/invitation_template.docx');

        if (!file_exists($templatePath)) {
            return response()->json([
                'message' => 'Template invitation not found',
                'path' => $templatePath
            ], 404);
        }
    
        $template = new TemplateProcessor($templatePath);

        $jury = Jury::findOrFail($juryId);
        $isFeminin = (bool) $jury->F;

        $template->setValue('nomdoctor', $doctorant->nomfr ?? '');
        $template->setValue('phrase', $phraseDepresed($roleJury, $doctorant->nomfr ?? '', $isFeminin));
        $template->setValue('datsotno', $convertDateToFrenchForInvitation($doctorant->date_descution_jury));
        $template->setValue('horer', $doctorant->heure_soutenance ?? '');
        $template->setValue('local', $doctorant->local_soutenance ?? '');
        $template->setValue('genre', $isFeminin ? 'Madame la Professeure' : 'Monsieur le Professeur');
        $template->setValue('nomjury', $nomJury ?? '');
      
        $fileName = 'invitation_' . $juryId . '_' . time() . '.docx';
        $path = storage_path('app/' . $fileName);

        $template->saveAs($path);

        return response()->download($path)->deleteFileAfterSend(true);

    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        return response()->json(['message' => 'Doctorant non trouvé'], 404);
    } catch (\Exception $e) {
        return response()->json([
            'message' => $e->getMessage(),
            'file'    => $e->getFile(),
            'line'    => $e->getLine()
        ], 500);
    }
});