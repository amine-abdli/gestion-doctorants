<?php
/**
 * Fix template.docx to properly display jury table
 * Creates a clean, simple table structure with jury placeholders
 */

$templatePath = 'storage/app/template.docx';

if (!file_exists($templatePath)) {
    echo "ERROR: Template not found at $templatePath\n";
    exit(1);
}

// Create backup
copy($templatePath, $templatePath . '.backup');
echo "✓ Backup created\n";

// Open template as ZIP
$zip = new ZipArchive();
if (!$zip->open($templatePath)) {
    echo "ERROR: Cannot open template.docx\n";
    exit(1);
}

$xml = $zip->getFromName('word/document.xml');

// Check if jury table already exists and remove it
if (strpos($xml, 'jury_nom_modifier') !== false) {
    // Find and remove the old jury table
    $pattern = '/<w:tbl>.*?jury_nom_modifier.*?<\/w:tbl>/s';
    $xml = preg_replace($pattern, '', $xml);
    echo "✓ Removed old jury table\n";
}

// Create simple jury table with proper structure for cloneRow
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
  <!-- Header row -->
  <w:tr>
    <w:trPr>
      <w:trHeight w:val="400" w:type="atLeast"/>
    </w:trPr>
    <w:tc>
      <w:tcPr>
        <w:tcW w:w="1200" w:type="auto"/>
        <w:shd w:fill="D3D3D3"/>
      </w:tcPr>
      <w:p>
        <w:pPr><w:jc w:val="center"/></w:pPr>
        <w:r><w:rPr><w:b/></w:rPr><w:t>الاسم</w:t></w:r>
      </w:p>
    </w:tc>
    <w:tc>
      <w:tcPr>
        <w:tcW w:w="1200" w:type="auto"/>
        <w:shd w:fill="D3D3D3"/>
      </w:tcPr>
      <w:p>
        <w:pPr><w:jc w:val="center"/></w:pPr>
        <w:r><w:rPr><w:b/></w:rPr><w:t>الدرجة</w:t></w:r>
      </w:p>
    </w:tc>
    <w:tc>
      <w:tcPr>
        <w:tcW w:w="1200" w:type="auto"/>
        <w:shd w:fill="D3D3D3"/>
      </w:tcPr>
      <w:p>
        <w:pPr><w:jc w:val="center"/></w:pPr>
        <w:r><w:rPr><w:b/></w:rPr><w:t>الدور</w:t></w:r>
      </w:p>
    </w:tc>
  </w:tr>
  <!-- Data row (will be cloned) -->
  <w:tr>
    <w:trPr>
      <w:trHeight w:val="350" w:type="atLeast"/>
    </w:trPr>
    <w:tc>
      <w:tcPr>
        <w:tcW w:w="1200" w:type="auto"/>
      </w:tcPr>
      <w:p>
        <w:r><w:t>${jury_nom_modifier}</w:t></w:r>
      </w:p>
    </w:tc>
    <w:tc>
      <w:tcPr>
        <w:tcW w:w="1200" w:type="auto"/>
      </w:tcPr>
      <w:p>
        <w:r><w:t>${jury_graderb}</w:t></w:r>
      </w:p>
    </w:tc>
    <w:tc>
      <w:tcPr>
        <w:tcW w:w="1200" w:type="auto"/>
      </w:tcPr>
      <w:p>
        <w:r><w:t>${jury_rolearb}</w:t></w:r>
      </w:p>
    </w:tc>
  </w:tr>
</w:tbl>
EOT;

// Insert before </w:body>
$bodyPos = strrpos($xml, '</w:body>');
if ($bodyPos === false) {
    echo "ERROR: Cannot find </w:body> in template\n";
    $zip->close();
    exit(1);
}

$newXml = substr_replace($xml, "\n" . $juryTableXml . "\n", $bodyPos, 0);

// Save updated XML
$zip->deleteName('word/document.xml');
$zip->addFromString('word/document.xml', $newXml);
$zip->close();

echo "✓ Template updated successfully\n";

// Verify
$zip = new ZipArchive();
$zip->open($templatePath);
$xml = $zip->getFromName('word/document.xml');
$zip->close();

echo "\nVerification:\n";
echo (strpos($xml, 'jury_nom_modifier') ? "✓ jury_nom_modifier: FOUND\n" : "✗ jury_nom_modifier: NOT FOUND\n");
echo (strpos($xml, 'jury_graderb') ? "✓ jury_graderb: FOUND\n" : "✗ jury_graderb: NOT FOUND\n");
echo (strpos($xml, 'jury_rolearb') ? "✓ jury_rolearb: FOUND\n" : "✗ jury_rolearb: NOT FOUND\n");

echo "\n✓ Done! Template is ready for use.\n";
