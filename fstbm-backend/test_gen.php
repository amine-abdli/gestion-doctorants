<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$app->boot();

try {
    $doctorantId = 4;
    $doctorant = App\Models\Doctorant::with(['juries', 'diplomes'])->findOrFail($doctorantId);

    echo "Found doctorant: " . $doctorant->nomfr . "\n";
    echo "Juries count: " . $doctorant->juries->count() . "\n";
    echo "Diplomes count: " . $doctorant->diplomes->count() . "\n";

    $templatePath = storage_path('app/template.docx');
    echo "Template path: $templatePath\n";
    echo "Template exists: " . (file_exists($templatePath) ? 'YES' : 'NO') . "\n";

    if (!file_exists($templatePath)) {
        echo "ERROR: Template not found!\n";
        exit(1);
    }

    $template = new PhpOffice\PhpWord\TemplateProcessor($templatePath);
    echo "Template loaded OK\n";

    // Test setValue
    $template->setValue('nom', $doctorant->nomarb ?? '');
    $template->setValue('nomfr', $doctorant->nomfr ?? '');

    echo "setValues OK\n";

    // Test juries
    if ($doctorant->juries->count() > 0) {
        $template->cloneRow('jury_nom', $doctorant->juries->count());
        echo "cloneRow jury_nom OK\n";

        foreach ($doctorant->juries as $index => $jury) {
            $i = $index + 1;
            $template->setValue("jury_nom#$i", $jury->nom ?? '');
            $template->setValue("jury_nom_modifier#$i", $jury->pivot->nom_modifier ?? '');
            $template->setValue("jury_role#$i", $jury->pivot->role ?? '');
            $template->setValue("jury_grade#$i", $jury->pivot->grade ?? '');
            $template->setValue("jury_local#$i", $jury->pivot->local ?? '');
        }
        echo "jury rows filled OK\n";
    } else {
        echo "No juries - skipping cloneRow\n";
    }

    // Test diplomes
    if ($doctorant->diplomes->count() > 0) {
        $template->cloneRow('numero', $doctorant->diplomes->count());
        echo "cloneRow numero OK\n";

        foreach ($doctorant->diplomes as $index => $diplome) {
            $i = $index + 1;
            $template->setValue("numero#$i", $diplome->numero_diplome ?? '');
            $template->setValue("mention_fr#$i", $diplome->mention_fr ?? '');
            $template->setValue("mention_arb#$i", $diplome->mention_arb ?? '');
            $template->setValue("date_exam#$i", $diplome->date_examen ?? '');
            $template->setValue("date_optienue#$i", $diplome->date_obtention ?? '');
        }
        echo "diplome rows filled OK\n";
    } else {
        echo "No diplomes - skipping cloneRow\n";
    }

    $outPath = storage_path('app/test_output.docx');
    $template->saveAs($outPath);
    echo "Saved to: $outPath\n";
    echo "SUCCESS!\n";

} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
    echo "Trace:\n" . $e->getTraceAsString() . "\n";
}
