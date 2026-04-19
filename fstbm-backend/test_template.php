<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$app->boot();

$doctorantId = 4;
$doctorant = App\Models\Doctorant::with(['juries', 'diplomes'])->find($doctorantId);

if (!$doctorant) echo "No doctorant\n";
echo "Diplomes count: " . $doctorant->diplomes->count() . "\n";

$template = new PhpOffice\PhpWord\TemplateProcessor(storage_path('app/template.docx'));
$diplomes = $doctorant->diplomes;

try {
    $template->cloneRow('numero_diplome', $diplomes->count());
    echo "Cloned numero_diplome\n";
} catch (\Exception $e) {
    echo "Exception cloneRow: " . $e->getMessage() . "\n";
}

foreach ($diplomes as $index => $diplome) {
    $i = $index + 1;
    $template->setValue("numero_diplome#$i", "TEST_NUM_DIPLOME_$i");
    $template->setValue("mention_fr#$i", "TEST_MENTION_FR_$i");
    $template->setValue("mention_arb#$i", "TEST_MENTION_ARB_$i");
    $template->setValue("dateExam#$i", "TEST_DATE_EXAM_$i");
    $template->setValue("dateObt#$i", "TEST_DATE_OBT_$i");
}

$template->saveAs(storage_path('app/test_output.docx'));
echo "Done\n";
