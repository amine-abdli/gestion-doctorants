<?php
require __DIR__ . '/vendor/autoload.php';

use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\IOFactory;

try {
    // Créer un nouveau document Word avec une meilleure structure
    $phpWord = new PhpWord();
    
    // Configurer les styles
    $phpWord->setDefaultFontName('Calibri');
    $phpWord->setDefaultFontSize(11);
    
    // Ajouter une section
    $section = $phpWord->addSection();
    
    // Créer le document avec les variables template
    $section->addText('à Béni Mellal, Le ');
    $section->addText('N° :');
    $section->addText('');
    $section->addText('Le Doyen');
    $section->addText('A');
    $section->addText('');
    
    $section->addText('Monsieur le Professeur ${nomjury}');
    $section->addText('Faculté des Sciences et Techniques');
    $section->addText('Université Sultan Moulay Slimane');
    $section->addText('Béni Mellal');
    $section->addText('');
    
    $section->addText('Objet : Soutenance de Thèse de Doctorat de ${nomdoctor}', array('bold' => true));
    $section->addText('');
    
    $section->addText('Cher Collègue,');
    $section->addText('');
    
    $section->addText('J\'ai l\'honneur de vous inviter à présider le jury de soutenance de Doctorat de ${nomdoctor}');
    $section->addText('');
    
    $section->addText('Cette soutenance publique aura lieu le ${datsotno} à ${horer} à ${local} de la Faculté des Sciences et Techniques de Béni Mellal.');
    $section->addText('');
    
    $section->addText('En attendant, je vous prie de recevoir, cher collègue, l\'expression de mes sincères salutations.');
    
    // Ajouter des espaces
    for ($i = 0; $i < 7; $i++) {
        $section->addText('');
    }
    
    // Sauvegarder temporairement
    $tempPath = __DIR__ . '/storage/app/template_invitation_temp.docx';
    $phpWord->save($tempPath);
    
    echo "✓ Template temporaire créé\n";
    
} catch (\Exception $e) {
    echo "Erreur: " . $e->getMessage() . "\n";
}
?>
