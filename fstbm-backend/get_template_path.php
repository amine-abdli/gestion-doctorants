<?php
// Copier le template valide vers un chemin alternatif avec timestamp
$source = __DIR__ . '/storage/app/template_invitation_temp.docx';
$target = __DIR__ . '/storage/app/invitation_template_' . date('Y_m_d_H_i_s') . '.docx';

try {
    $content = file_get_contents($source);
    if ($content === false) {
        die("Erreur: Impossible de lire le fichier source\n");
    }
    
    $bytes = file_put_contents($target, $content);
    if ($bytes === false) {
        die("Erreur: Impossible d'écrire dans le fichier cible\n");
    }
    
    echo $target;
    
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
