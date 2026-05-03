<?php
require 'vendor/autoload.php';

$path = __DIR__ . '/storage/app/invitation_template.docx';

echo "File exists: " . (file_exists($path) ? 'YES' : 'NO') . "\n";
echo "File size: " . filesize($path) . "\n";

// Check format
$f = fopen($path, 'rb');
$header = fread($f, 4);
fclose($f);
echo "Format: " . (substr($header, 0, 2) === "PK" ? "Valid .docx (ZIP)" : "Not .docx") . "\n";

try {
    $tp = new \PhpOffice\PhpWord\TemplateProcessor($path);
    $vars = $tp->getVariables();
    echo "Variables found: " . implode(', ', $vars) . "\n";
    echo "Count: " . count($vars) . "\n";
    echo "Template loaded successfully!\n";
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
