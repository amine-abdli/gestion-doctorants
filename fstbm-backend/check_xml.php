<?php
$zip = new ZipArchive;
if ($zip->open('storage/app/template.docx') === TRUE) {
    $content = $zip->getFromName('word/document.xml');
    
    // remove some noisy tags for easier reading
    $clean = strip_tags(str_replace(['<w:p>', '</w:p>', '<w:tr>', '</w:tr>'], ["\n<w:p>\n", "\n</w:p>\n", "\n<w:tr>\n", "\n</w:tr>\n"], $content), '<w:p><w:tr>');
    
    $lines = explode("\n", $clean);
    $inTr = false;
    foreach ($lines as $line) {
        if (strpos($line, '<w:tr>') !== false) $inTr = true;
        if (strpos($line, '</w:tr>') !== false) $inTr = false;
        
        if (strpos($line, 'numero_diplome') !== false) {
            echo "Found numero_diplome! Inside TR? " . ($inTr ? "YES" : "NO") . "\n";
            echo rtrim($line) . "\n";
        }
    }
    
    $zip->close();
} else {
    echo "Failed to open document.\n";
}
