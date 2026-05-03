<?php
/**
 * Add jury_local - simpler approach
 */

$source = 'storage/app/template.docx';
$dest = 'storage/app/template_updated.docx';

if (file_exists($dest)) {
    unlink($dest);
}
copy($source, $dest);
echo "Copied template\n";

$zip = new ZipArchive();
$zip->open($dest);
$xml = $zip->getFromName('word/document.xml');

// Find the pattern more carefully
// After jury_grade</w:t>, there are several more <w:r> tags before </w:tc></w:tr>
// Let's use a regex to find and replace

$pattern = '/jury_grade<\/w:t>.*?<\/w:tc><\/w:tr>/s';
$found = 0;

while (preg_match($pattern, $xml, $matches, PREG_OFFSET_CAPTURE)) {
    $fullMatch = $matches[0][0];
    $pos = $matches[0][1];
    
    // Add jury_local cell before </w:tr>
    $newCell = '<w:tc><w:tcPr><w:tcW w:w="2000" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>{</w:t></w:r><w:r><w:t>jury_local</w:t></w:r><w:r><w:t>}</w:t></w:r></w:p></w:tc>';
    $replacement = str_replace('</w:tr>', $newCell . '</w:tr>', $fullMatch);
    
    // Replace in the original string
    $xml = substr_replace($xml, $replacement, $pos, strlen($fullMatch));
    $found++;
    
    // For safety, stop after 10 replacements
    if ($found >= 10) break;
}

echo "Replacements made: $found\n";

if ($found > 0) {
    $zip->deleteName('word/document.xml');
    $zip->addFromString('word/document.xml', $xml);
    $zip->close();
    echo "Updated!\n";
} else {
    $zip->close();
    echo "No patterns found\n";
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
