<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Doctorant;
use Illuminate\Http\Request;
use PhpOffice\PhpWord\TemplateProcessor;
use Carbon\Carbon;

class DocumentController extends Controller
{
    public function generateWord(Request $request)
    {
        try {
            $doctorant = Doctorant::with(['juries', 'diplomes'])
                ->findOrFail($request->doctorantId);

            $templatePath = storage_path('app/template.docx');

            if (!file_exists($templatePath)) {
                return response()->json([
                    'message' => 'Template file not found',
                    'path'    => $templatePath
                ], 404);
            }

            $template = new TemplateProcessor($templatePath);

            $template->setValue('nom',             $this->safe($doctorant->nomarb));
            $template->setValue('nomfr',           $this->safe($doctorant->nomfr));
            $template->setValue('cin',             $this->safe($doctorant->cin));
            $template->setValue('lieu',            $this->safe($doctorant->lieu_naissance_arb));
            $template->setValue('date_naissance',  $this->formatDate($doctorant->date_naissance));
            $template->setValue('nmb_inscription', $this->safe($doctorant->nmb_inscription));
            $template->setValue('discipline',      $this->safe($doctorant->discipline_arb));
            $template->setValue('specialite',      $this->safe($doctorant->specialite_arb));
            $template->setValue('disciplinefr',    $this->safe($doctorant->discipline_fr));
            $template->setValue('specialitefr',    $this->safe($doctorant->specialite_fr));
            $template->setValue('sujet',           $this->safe($doctorant->sujet_fr));

            $diplomes = $doctorant->diplomes;
            if ($diplomes->count() > 0) {
                $template->cloneRow('numero', $diplomes->count());
                foreach ($diplomes as $index => $diplome) {
                    $i = $index + 1;
                    $template->setValue("numero#$i",         $this->safe($diplome->numero_diplome));
                    $template->setValue("mention_fr#$i",     $this->safe($diplome->mention_fr));
                    $template->setValue("mention_arb#$i",    $this->safe($diplome->mention_arb));
                    $template->setValue("date_exam#$i",      $this->formatDate($diplome->date_examen));
                    $template->setValue("date_obtention#$i", $this->formatDate($diplome->date_obtention));
                }
            } else {
                foreach (['numero', 'mention_fr', 'mention_arb', 'date_exam', 'date_obtention'] as $key) {
                    $template->setValue($key, '');
                }
            }

            $juries = $doctorant->juries;
            if ($juries->count() > 0) {
                $template->cloneRow('jury_nom', $juries->count());
                foreach ($juries as $index => $jury) {
                    $i = $index + 1;
                    $template->setValue("jury_nom#$i",   $this->safe($jury->nom));
                    $template->setValue("jury_role#$i",  $this->safe($jury->pivot->role));
                    $template->setValue("jury_grade#$i", $this->safe($jury->pivot->grade));
                }
            } else {
                foreach (['jury_nom', 'jury_role', 'jury_grade'] as $key) {
                    $template->setValue($key, '');
                }
            }

            $outputPath = storage_path('app/rapport_' . $doctorant->id . '.docx');
            $template->saveAs($outputPath);

            return response()->download($outputPath, 'rapport.docx')
                ->deleteFileAfterSend(true);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Doctorant not found'], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error generating document',
                'error'   => $e->getMessage(),
                'line'    => $e->getLine(),
                'file'    => $e->getFile(),
            ], 500);
        }
    }

    private function safe($value): string
    {
        return (string) ($value ?? '');
    }

    private function formatDate($value): string
    {
        if (empty($value)) {
            return '';
        }
        if ($value instanceof \DateTimeInterface) {
            return $value->format('d/m/Y');
        }
        try {
            return Carbon::parse((string) $value)->format('d/m/Y');
        } catch (\Exception $e) {
            return (string) $value;
        }
    }
}