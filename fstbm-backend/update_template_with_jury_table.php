<?php
/**
 * Update template.docx with jury table
 * Adds variables: ${jury_nom_modifier}, ${jury_graderb}, ${jury_rolearb}
 * This creates a proper table structure in the Word document for jury information
 */

$templatePath = 'storage/app/template.docx';

if (!file_exists($templatePath)) {
    echo "ERROR: Template file not found at: $templatePath\n";
    exit(1);
}

// Create backup
$backupPath = $templatePath . '.backup';
if (!file_exists($backupPath)) {
    copy($templatePath, $backupPath);
    echo "Backup created: $backupPath\n";
}

// Open as ZIP
$zip = new ZipArchive();
if ($zip->open($templatePath) !== true) {
    echo "ERROR: Cannot open template.docx as ZIP\n";
    exit(1);
}

// Extract document.xml
$xml = $zip->getFromName('word/document.xml');

// Check if jury table already exists
if (strpos($xml, 'jury_nom_modifier') !== false) {
    echo "Jury table already exists in template. Skipping table creation.\n";
    $zip->close();
    exit(0);
}

// Find the place to insert the jury table (before the diplomes table or at end of document body)
// We'll look for a marker or add it before the closing </w:body> tag

// Create the jury table XML structure
$juryTableXml = <<<'EOT'
<w:tbl>
    <w:tblPr>
        <w:tblW w:w="5000" w:type="auto"/>
        <w:tblBorders>
            <w:top w:val="single" w:sz="12" w:space="0" w:color="000000"/>
            <w:left w:val="single" w:sz="12" w:space="0" w:color="000000"/>
            <w:bottom w:val="single" w:sz="12" w:space="0" w:color="000000"/>
            <w:right w:val="single" w:sz="12" w:space="0" w:color="000000"/>
            <w:insideH w:val="single" w:sz="12" w:space="0" w:color="000000"/>
            <w:insideV w:val="single" w:sz="12" w:space="0" w:color="000000"/>
        </w:tblBorders>
    </w:tblPr>
    <w:tr>
        <w:trPr>
            <w:trHeight w:val="300" w:type="atLeast"/>
        </w:trPr>
        <w:tc>
            <w:tcPr>
                <w:tcW w:w="1000" w:type="auto"/>
                <w:shd w:fill="CCCCCC"/>
            </w:tcPr>
            <w:p>
                <w:pPr>
                    <w:jc w:val="center"/>
                </w:pPr>
                <w:r>
                    <w:rPr>
                        <w:b/>
                    </w:rPr>
                    <w:t>الاسم</w:t>
                </w:r>
            </w:p>
        </w:tc>
        <w:tc>
            <w:tcPr>
                <w:tcW w:w="1000" w:type="auto"/>
                <w:shd w:fill="CCCCCC"/>
            </w:tcPr>
            <w:p>
                <w:pPr>
                    <w:jc w:val="center"/>
                </w:pPr>
                <w:r>
                    <w:rPr>
                        <w:b/>
                    </w:rPr>
                    <w:t>الدرجة</w:t>
                </w:r>
            </w:p>
        </w:tc>
        <w:tc>
            <w:tcPr>
                <w:tcW w:w="1000" w:type="auto"/>
                <w:shd w:fill="CCCCCC"/>
            </w:tcPr>
            <w:p>
                <w:pPr>
                    <w:jc w:val="center"/>
                </w:pPr>
                <w:r>
                    <w:rPr>
                        <w:b/>
                    </w:rPr>
                    <w:t>الدور</w:t>
                </w:r>
            </w:p>
        </w:tc>
    </w:tr>
    <w:tr>
        <w:trPr>
            <w:trHeight w:val="300" w:type="atLeast"/>
        </w:trPr>
        <w:tc>
            <w:tcPr>
                <w:tcW w:w="1000" w:type="auto"/>
            </w:tcPr>
            <w:p>
                <w:r>
                    <w:t>{</w:t>
                </w:r>
                <w:r>
                    <w:t>jury_nom_modifier</w:t>
                </w:r>
                <w:r>
                    <w:t>}</w:t>
                </w:r>
            </w:p>
        </w:tc>
        <w:tc>
            <w:tcPr>
                <w:tcW w:w="1000" w:type="auto"/>
            </w:tcPr>
            <w:p>
                <w:r>
                    <w:t>{</w:t>
                </w:r>
                <w:r>
                    <w:t>jury_graderb</w:t>
                </w:r>
                <w:r>
                    <w:t>}</w:t>
                </w:r>
            </w:p>
        </w:tc>
        <w:tc>
            <w:tcPr>
                <w:tcW w:w="1000" w:type="auto"/>
            </w:tcPr>
            <w:p>
                <w:r>
                    <w:t>{</w:t>
                </w:r>
                <w:r>
                    <w:t>jury_rolearb</w:t>
                </w:r>
                <w:r>
                    <w:t>}</w:t>
                </w:r>
            </w:p>
        </w:tc>
    </w:tr>
</w:tbl>
EOT;

// Find insertion point - before closing </w:body>
$insertPos = strrpos($xml, '</w:body>');
if ($insertPos === false) {
    echo "ERROR: Cannot find </w:body> tag\n";
    $zip->close();
    exit(1);
}

// Insert the table XML before </w:body>
$newXml = substr_replace($xml, $juryTableXml . "\n", $insertPos, 0);

// Update the ZIP
$zip->deleteName('word/document.xml');
$zip->addFromString('word/document.xml', $newXml);
$zip->close();

echo "✓ Template updated successfully!\n";
echo "✓ Added jury table with variables: jury_nom_modifier, jury_graderb, jury_rolearb\n";

// Verify
$zip = new ZipArchive();
$zip->open($templatePath);
$xml = $zip->getFromName('word/document.xml');
$zip->close();

echo "\nVerification:\n";
echo (strpos($xml, 'jury_nom_modifier') ? '✓ jury_nom_modifier: FOUND' : '✗ jury_nom_modifier: NOT FOUND') . "\n";
echo (strpos($xml, 'jury_graderb') ? '✓ jury_graderb: FOUND' : '✗ jury_graderb: NOT FOUND') . "\n";
echo (strpos($xml, 'jury_rolearb') ? '✓ jury_rolearb: FOUND' : '✗ jury_rolearb: NOT FOUND') . "\n";
echo "\nDone!\n";
