<?php
$zip = new ZipArchive;
if ($zip->open('storage/app/template.docx') === TRUE) {
    $content = $zip->getFromName('word/document.xml');
    
    preg_match_all('/<w:tr( |>).*?<\/w:tr>/s', $content, $rows);
    foreach ($rows[0] as $i => $row) {
        $plainText = strip_tags($row);
        if (strpos($plainText, 'numero_diplome') !== false) {
            echo "Row " . $i . " found containing numero_diplome:\n";
            preg_match_all('/\$\{([^\}]+)\}/', $plainText, $matches);
            print_r(array_unique($matches[1]));
        }
    }
    $zip->close();
} else {
    echo "Failed to open document.\n";
}
