<?php

require 'vendor/autoload.php';

use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\Shared\Pt;

// Créer un nouveau document Word
$phpWord = new PhpWord();

// Ajouter une section
$section = $phpWord->addSection();

// Ajouter le contenu de l'invitation avec les variables template
$style = array('size' => 11, 'font' => 'Calibri');

$section->addText('Monsieur le Professeur ${nomjury}', $style);
$section->addText('Faculté des Sciences et Techniques');
$section->addText('Université Sultan Moulay Slimane');
$section->addText('Béni Mellal');

$section->addText(' ');

$section->addText('Objet : Soutenance de Thèse de Doctorat de ${nomdoctor}', array('bold' => true, 'size' => 11));

$section->addText(' ');

$section->addText('Cher Collègue,', $style);

$section->addText(' ');

$section->addText('J\'ai l\'honneur de vous inviter à présider le jury de soutenance de Doctorat de ${nomdoctor}', $style);

$section->addText('Cette soutenance publique aura lieu le ${datsotno} à ${horer} à ${local} de la Faculté des Sciences et Techniques de Béni Mellal.', $style);

$section->addText(' ');

$section->addText('En attendant, je vous prie de recevoir, cher collègue, l\'expression de mes sincères salutations.', $style);

// Sauvegarder le document
$filename = 'Prénom NOM (1).docx';
$path = __DIR__ . '/storage/app/' . $filename;
$phpWord->save($path);

echo "Template d'invitation créé avec succès!\n";
echo "Fichier: " . $path . "\n";
echo "Variables template: \${nomjury}, \${nomdoctor}, \${datsotno}, \${horer}, \${local}\n";
?>

