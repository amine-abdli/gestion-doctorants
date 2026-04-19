<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\DoctorantController;
use App\Http\Controllers\Api\JuryController;
use App\Http\Controllers\Api\DiplomeController;
use App\Http\Controllers\Api\DocumentController;

use Illuminate\Http\Request;
use App\Models\Doctorant;
use PhpOffice\PhpWord\TemplateProcessor;


// =================== DOCTORANTS ===================
Route::get('/doctorants',          [DoctorantController::class, 'index']);
Route::post('/doctorants',         [DoctorantController::class, 'store']);
Route::get('/doctorants/{id}',     [DoctorantController::class, 'show']);
Route::put('/doctorants/{id}',     [DoctorantController::class, 'update']);
Route::delete('/doctorants/{id}',  [DoctorantController::class, 'destroy']);

// =================== JURIES ===================
Route::get('/juries',                        [JuryController::class, 'index']);
Route::post('/juries',                       [JuryController::class, 'store']);
Route::get('/juries/{id}',                   [JuryController::class, 'show']);
Route::put('/juries/{id}',                   [JuryController::class, 'update']);
Route::delete('/juries/{id}',                [JuryController::class, 'destroy']);
Route::post('/juries/{id}/attach',           [JuryController::class, 'attachDoctorant']);

// =================== DIPLÔMES ===================
Route::get('/diplomes',                      [DiplomeController::class, 'index']);
Route::post('/diplomes',                     [DiplomeController::class, 'store']);
Route::get('/diplomes/{id}',                 [DiplomeController::class, 'show']);
Route::put('/diplomes/{id}',                 [DiplomeController::class, 'update']);
Route::delete('/diplomes/{id}',              [DiplomeController::class, 'destroy']);
Route::get('/diplomes/doctorant/{doctorantId}', [DiplomeController::class, 'byDoctorant']);


// =================== GÉNÉRATION DE DOCUMENTS ===================

Route::get('/generate-word', function (Request $request) {
    try { 
        // Vérifier le doctorant
        $doctorant = Doctorant::with(['juries', 'diplomes'])
            ->findOrFail($request->doctorantId);

        $templatePath = storage_path('app/template.docx');

        // Vérifier que le template existe
        if (!file_exists($templatePath)) {
            return response()->json([
                'message' => 'Template file not found',
                'path' => $templatePath
            ], 404);
        }
         
        $template = new TemplateProcessor($templatePath);

        // Infos doctorant
        $template->setValue('nom', $doctorant->nomarb ?? '');
        $template->setValue('date_naissance', $doctorant->date_naissance ?? '');
        $template->setValue('nmb_inscription', $doctorant->nmb_inscription ?? '');
        $template->setValue('lieu', $doctorant->lieu_naissance_arb ?? '');
        $template->setValue('discipline', $doctorant->discipline_arb ?? '');
        $template->setValue('specialite', $doctorant->specialite_arb ?? '');
        $template->setValue('cin', $doctorant->cin ?? '');
        $template->setValue('nomfr', $doctorant->nomfr ?? '');
        $template->setValue('disciplinefr', $doctorant->discipline_fr ?? '');
        $template->setValue('specialitefr', $doctorant->specialite_fr ?? '');
        $template->setValue('sujet', $doctorant->sujet_fr ?? '');

        // JURIES
        $juries = $doctorant->juries;
        if ($juries->count() > 0) {
            try {
                $template->cloneRow('jury_nom', $juries->count());
                foreach ($juries as $index => $jury) {
                    $i = $index + 1;
                    $template->setValue("jury_nom#$i", $jury->nom ?? '');
                    $template->setValue("jury_role#$i", $jury->pivot->role ?? '');
                    $template->setValue("jury_grade#$i", $jury->pivot->grade ?? '');
                    $template->setValue("jury_local#$i", $jury->pivot->local ?? '');
                }
            } catch (\Exception $e) {
                // Le tag jury_nom n'existe pas dans le template — on continue sans crash
            }
        }

        // DIPLOMES — les dates sont castées en Carbon, il faut les formater en string
        $diplomes = $doctorant->diplomes;
        if ($diplomes->count() > 0) {
            try {
                $template->cloneRow('numero_diplome', $diplomes->count());
                foreach ($diplomes as $index => $diplome) {
                    $i = $index + 1;
                    $template->setValue("numero_diplome#$i", $diplome->numero_diplome ?? '');
                    $template->setValue("mention_fr#$i", $diplome->mention_fr ?? '');
                    $template->setValue("mention_arb#$i", $diplome->mention_arb ?? '');

                    $dateExam = $diplome->date_examen
                        ? \Carbon\Carbon::parse($diplome->date_examen)->format('d/m/Y')
                        : '';
                    $dateObt = $diplome->date_obtention
                        ? \Carbon\Carbon::parse($diplome->date_obtention)->format('d/m/Y')
                        : '';

                    $template->setValue("dateExam#$i", $dateExam);
                    $template->setValue("dateObt#$i", $dateObt);
                }
            } catch (\Exception $e) {
                // Le tag numero n'existe pas ou n'est PAS dans un Tableau (Table Row).
                // On remplace le premier diplome statiquement comme solution de secours.
                $diplome = $diplomes->first();
                $template->setValue("numero_diplome", $diplome->numero_diplome ?? '');
                $template->setValue("mention_fr", $diplome->mention_fr ?? '');
                $template->setValue("mention_arb", $diplome->mention_arb ?? '');
                
                $dateExam = $diplome->date_examen ? \Carbon\Carbon::parse($diplome->date_examen)->format('d/m/Y') : '';
                $dateObt = $diplome->date_obtention ? \Carbon\Carbon::parse($diplome->date_obtention)->format('d/m/Y') : '';
                
                $template->setValue("dateExam", $dateExam);
                $template->setValue("dateObt", $dateObt);
            }
        }

        // Fichier de sortie unique pour éviter les conflits
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