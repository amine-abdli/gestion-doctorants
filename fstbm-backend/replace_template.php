<?php
// Script pour remplacer le template corrompu
$source = __DIR__ . '/storage/app/template_invitation_temp.docx';
$target = __DIR__ . '/storage/app/Prénom NOM (1).docx';

try {
    // Lire le contenu du fichier valide
    $content = file_get_contents($source);
    
    if ($content === false) {
        die("Erreur: Impossible de lire le fichier source\n");
    }
    
    // Écrire dans le fichier cible (remplace si existe)
    $bytes = file_put_contents($target, $content);
    
    if ($bytes === false) {
        die("Erreur: Impossible d'écrire dans le fichier cible\n");
    }
    
    echo "✓ Template remplacé avec succès!\n";
    echo "Fichier: " . $target . "\n";
    echo "Taille: " . $bytes . " bytes\n";
    
} catch (\Exception $e) {
    echo "Erreur: " . $e->getMessage() . "\n";
}
?>
