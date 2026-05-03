<?php
require 'vendor/autoload.php';

use PhpOffice\PhpWord\TemplateProcessor;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\IOFactory;

try {
    // Create a basic template document
    $phpWord = new PhpWord();
    $section = $phpWord->addSection();
    
    // Add information section
    $section->addTextBlock(
        [
            [
                'text' => 'Nom: ${nom}', 'bold' => false
            ],
            [
                'text' => 'Nom (FR): ${nomfr}', 'bold' => false
            ],
            [
                'text' => 'CIN: ${cin}', 'bold' => false
            ],
            [
                'text' => 'Date de naissance: ${date_naissance}', 'bold' => false
            ],
            [
                'text' => 'Lieu: ${lieu}', 'bold' => false
            ],
            [
                'text' => 'Discipline: ${discipline}', 'bold' => false
            ],
            [
                'text' => 'Discipline (FR): ${disciplinefr}', 'bold' => false
            ],
            [
                'text' => 'Spécialité: ${specialite}', 'bold' => false
            ],
            [
                'text' => 'Spécialité (FR): ${specialitefr}', 'bold' => false
            ],
            [
                'text' => 'Sujet: ${sujet}', 'bold' => false
            ],
            [
                'text' => 'Numéro inscription: ${nmb_inscription}', 'bold' => false
            ],
        ]
    );
    
    // Add jury table with cloneable row
    $section->addHeading('Juries', 2);
    $table = $section->addTable();
    $table->addRow();
    $table->addCell(1500)->addText('Nom');
    $table->addCell(1500)->addText('Nom Modifié');
    $table->addCell(1500)->addText('Rôle');
    $table->addCell(1500)->addText('Grade');
    $table->addCell(1500)->addText('Local');
    
    // Add cloneable row with placeholder
    $table->addRow();
    $table->addCell(1500)->addText('${jury_nom}');
    $table->addCell(1500)->addText('${jury_nom_modifier}');
    $table->addCell(1500)->addText('${jury_role}');
    $table->addCell(1500)->addText('${jury_grade}');
    $table->addCell(1500)->addText('${jury_local}');
    
    // Add diplomes table with cloneable row
    $section->addHeading('Diplômes', 2);
    $table2 = $section->addTable();
    $table2->addRow();
    $table2->addCell(1500)->addText('Numéro');
    $table2->addCell(1500)->addText('Mention (FR)');
    $table2->addCell(1500)->addText('Mention (ARB)');
    $table2->addCell(1500)->addText('Date Examen');
    $table2->addCell(1500)->addText('Date Obtention');
    
    // Add cloneable row for diplomes
    $table2->addRow();
    $table2->addCell(1500)->addText('${numero}');
    $table2->addCell(1500)->addText('${mention_fr}');
    $table2->addCell(1500)->addText('${mention_arb}');
    $table2->addCell(1500)->addText('${date_exam}');
    $table2->addCell(1500)->addText('${date_optienue}');
    
    // Save as template
    $objWriter = IOFactory::createWriter($phpWord, 'Word2007');
    $objWriter->save('storage/app/template.docx');
    
    echo "Template created successfully!\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
