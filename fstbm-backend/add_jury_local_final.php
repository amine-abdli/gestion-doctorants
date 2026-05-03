<?php
/**
 * Copy and modify existing template
 */

$source = 'storage/app/template.docx';
$dest = 'storage/app/template_updated.docx';

if (!file_exists($source)) {
    echo "Source template not found\n";
    exit(1);
}

// Copy first
copy($source, $dest);
echo "Copied template to template_updated.docx\n";

// Open and modify
$zip = new ZipArchive();
if (!$zip->open($dest)) {
    echo "Could not open template_updated.docx\n";
    exit(1);
}

$xml = $zip->getFromName('word/document.xml');

// Add jury_local if not present
if (strpos($xml, 'jury_local') === false) {
    // Find the last cell with jury_grade and add jury_local after it
    // Pattern: find all occurrences of jury_grade and add jury_local column
    
    // Build the jury_local columns for all rows (jury_grade#1 through jury_grade#5)
    for ($i = 5; $i >= 1; $i--) {
        $searchText = 'jury_grade#' . $i;
        
        // Find this text and add jury_local after it
        $pos = strpos($xml, $searchText);
        if ($pos !== false) {
            // Find the closing </w:tc> after this position
            $closePos = strpos($xml, '</w:tc>', $pos);
            if ($closePos !== false) {
                $newCell = '<w:tc><w:tcPr><w:tcW w:w="2000" w:type="dxa"/></w:tcPr><w:p><w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/></w:rPr><w:t>jury_local#' . $i . '</w:t></w:r></w:p></w:tc>';
                
                // Insert after the current cell
                $xml = substr_replace($xml, $newCell, $closePos + 8, 0); // 8 = strlen('</w:tc>')
                echo "Added jury_local#$i\n";
            }
        }
    }
}

// Update the ZIP
$zip->deleteName('word/document.xml');
$zip->addFromString('word/document.xml', $xml);
$zip->close();

echo "Updated template_updated.docx\n";

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
