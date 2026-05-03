<?php
/**
 * Add jury_local column to existing template
 * The placeholders use format: <w:t>{</w:t></w:r>...<w:r><w:t>jury_grade</w:t></w:r>...<w:r><w:t>}</w:t>
 */

$source = 'storage/app/template.docx';
$dest = 'storage/app/template_updated.docx';

// Copy first
if (file_exists($dest)) {
    unlink($dest);
}
copy($source, $dest);
echo "Copied template\n";

$zip = new ZipArchive();
$zip->open($dest);
$xml = $zip->getFromName('word/document.xml');

// Add jury_local columns after jury_grade columns
// Pattern: find </w:tr></w:tbl> after jury_grade and add jury_local cell before </w:tr>

// The key is that after jury_grade}, there's </w:tc></w:tr></w:tbl>
// We want to insert a new <w:tc>..jury_local..</w:tc> before </w:tr>

// Let's find the pattern: jury_grade}</w:r></w:p></w:tc></w:tr>
$search = 'jury_grade}</w:r></w:p></w:tc></w:tr>';

if (strpos($xml, $search) === false) {
    echo "Pattern not found, trying with actual XML...\n";
    
    // Show what we're looking for
    $pos = strpos($xml, 'jury_grade');
    if ($pos) {
        $context = substr($xml, $pos, 200);
        echo "Found at: " . htmlspecialchars($context) . "\n";
    }
    exit(1);
}

// Now let's add jury_local before each </w:tr>
// We'll replace: jury_grade}</w:r></w:p></w:tc></w:tr>
// With: jury_grade}</w:r></w:p></w:tc><w:tc><w:p><w:r><w:t>{</w:t></w:r><w:r><w:t>jury_local</w:t></w:r><w:r><w:t>}</w:t></w:r></w:p></w:tc></w:tr>

$replacement = 'jury_grade}</w:r></w:p></w:tc><w:tc><w:p><w:r><w:t>{</w:t></w:r><w:r><w:t>jury_local</w:t></w:r><w:r><w:t>}</w:t></w:r></w:p></w:tc></w:tr>';

$newXml = str_replace($search, $replacement, $xml);

if ($newXml !== $xml) {
    echo "Pattern found and replaced\n";
    $count = substr_count($xml, $search) - substr_count($newXml, $search);
    echo "Replacements made: $count\n";
    
    $zip->deleteName('word/document.xml');
    $zip->addFromString('word/document.xml', $newXml);
    $zip->close();
    
    echo "SUCCESS!\n";
} else {
    echo "ERROR: No replacements made\n";
    $zip->close();
    exit(1);
}

// Verify
$zip = new ZipArchive();
$zip->open($dest);
$xml = $zip->getFromName('word/document.xml');
$zip->close();

echo "\nVerification:\n";
echo (strpos($xml, 'jury_local') ? 'jury_local: FOUND' : 'jury_local: NOT FOUND') . "\n";
echo (strpos($xml, 'jury_grade') ? 'jury_grade: FOUND' : 'jury_grade: NOT FOUND') . "\n";
echo (strpos($xml, 'jury_role') ? 'jury_role: FOUND' : 'jury_role: NOT FOUND') . "\n";
echo (strpos($xml, 'jury_nom_modifier') ? 'jury_nom_modifier: FOUND' : 'jury_nom_modifier: NOT FOUND') . "\n";
