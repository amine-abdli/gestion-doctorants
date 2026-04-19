<?php
$zip = new ZipArchive;
if ($zip->open('storage/app/template.docx') === TRUE) {
    $content = $zip->getFromName('word/document.xml');
    
    // PHPWord looks for tags in the format ${tag_name}
    // We remove all XML tags to make sure we don't break tags that span multiple XML nodes 
    $plainText = strip_tags($content);
    
    preg_match_all('/\$\{([^\}]+)\}/', $plainText, $matches);
    
    echo "========= TEMPLATE TAGS =========\n";
    print_r(array_unique($matches[1]));
    echo "=================================\n";
    $zip->close();
} else {
    echo 'Failed to open docx';
}
