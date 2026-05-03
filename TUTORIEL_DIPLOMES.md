# 🎥 Guide Étape par Étape - Module Diplômes

**Version:** 1.0  
**Cible:** Nouveaux utilisateurs du module Diplômes  
**Durée estimée:** 5-10 minutes

---

## 📌 Vue d'ensemble

Le module Diplômes permet de :
- 📋 **Consulter** la liste complète des diplômes
- 🔍 **Rechercher** par doctorant, CIN ou numéro
- ➕ **Créer** des nouveaux diplômes liés à un doctorant
- 👁️ **Visualiser** les détails complets
- 🗑️ **Supprimer** si nécessaire

---

## 🎬 TUTORIEL VIDÉO - Créer un Diplôme

### 📍 Étape 1 : Accéder au Module

**Temps : 10 secondes**

```
1. Ouvrez votre navigateur
   └─ Allez à: http://localhost:5174

2. Vous voyez la page d'accueil

3. Cliquez sur "Diplômes" dans le menu

4. Vous êtes maintenant sur /diplomes
```

**Résultat attendu :**
```
┌────────────────────────────────────────────────────────┐
│  FST BM - Gestion Doctorants                 [Menu ≡]  │
│                                                        │
│  🎓 Gestion des Diplômes                              │
│  ┌─────────────────────────────────────────────────┐ │
│  │ ➕ Nouveau Diplôme    🔍 [Rechercher...]       │ │
│  ├─────────────────────────────────────────────────┤ │
│  │ N°      │ Doctorant   │ CIN     │ Mention      │ │
│  │ Diplôme │             │         │              │ │
│  ├─────────────────────────────────────────────────┤ │
│  │ D001    │ Ahmed Ben   │ Y12345  │ Très Bien    │ │
│  │ D002    │ Fatima Zahra│ Y23456  │ Bien         │ │
│  │ D003    │ Mohammed    │ Y34567  │ Assez Bien   │ │
│  └─────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

---

### 📍 Étape 2 : Cliquer sur "Nouveau Diplôme"

**Temps : 5 secondes**

```
1. Localisez le bouton "➕ Nouveau Diplôme" (en haut à droite)

2. Cliquez dessus

3. Attendez 1-2 secondes le chargement
```

**Résultat attendu :**
```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  📋 SÉLECTIONNER UN DOCTORANT                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │ ❌ X  (Fermer)                                   │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ 🔍 Chercher : [_____________________]            │  │
│  │                                                  │  │
│  │ Résultats : 12 doctorants trouvés               │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ Nom      │ CIN     │ Spécialité      │ Actions │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ Ahmed    │ Y12345  │ Informatique    │ [✓]    │  │
│  │ Fatima   │ Y23456  │ Mathématiques   │ [✓]    │  │
│  │ Mohammed │ Y34567  │ Physique        │ [✓]    │  │
│  │ Aïcha    │ Y45678  │ Chimie          │ [✓]    │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**La Modal "Sélectionner un Doctorant" s'ouvre**

---

### 📍 Étape 3 : Chercher le Doctorant

**Temps : 15-30 secondes**

**Scénario 1 : Recherche par Nom**
```
1. Dans la barre de recherche, tapez le nom
   Exemple: "Ahmed"

2. La liste se filtre en temps réel
   ├─ Résultats : 2 doctorants trouvés
   ├─ Ahmed Ben Brahim    (Y12345)
   └─ Ahmed Ben Khalid    (Y23456)

3. Localisez le bon doctorant

4. IMPORTANT: Vérifiez le CIN pour être sûr
```

**Scénario 2 : Recherche par CIN**
```
1. Tapez le CIN exactement
   Exemple: "Y12345"

2. Un seul résultat apparaît
   └─ Ahmed Ben Brahim    (Y12345)
```

**Scénario 3 : Recherche par Spécialité**
```
1. Tapez la spécialité
   Exemple: "Informatique"

2. Tous les doctorants en Informatique s'affichent
```

**Conseil :** 💡 La recherche est **insensible à la casse** et filtre sur :
- Nom Français
- Nom Arabe
- CIN
- Spécialité
- Discipline

---

### 📍 Étape 4 : Sélectionner le Doctorant

**Temps : 5 secondes**

```
1. Une fois le bon doctorant trouvé

2. Cliquez sur le bouton "✓ Sélectionner"
   (à la fin de la ligne du doctorant)

3. La modal se referme automatiquement

4. Attendez 1-2 secondes
```

**Résultat attendu :**

La deuxième modal s'ouvre : "📝 Formulaire Diplôme"

---

### 📍 Étape 5 : Remplir la Section 1 (LECTURE SEULE)

**Temps : 5 secondes (juste observer)**

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  📝 CRÉER DIPLÔME                                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │ ❌ X  (Fermer)                                   │  │
│  ├──────────────────────────────────────────────────┤  │
│  │                                                  │  │
│  │ 📌 SECTION 1 : INFORMATIONS DOCTORANT (FIXE)   │  │
│  │ ────────────────────────────────────────────    │  │
│  │                                                  │  │
│  │ Nom Français:        Ahmed Ben Brahim           │  │
│  │ Nom Arabe:           أحمد بن ابراهيم            │  │
│  │ CIN:                 Y12345                      │  │
│  │ N° Inscription:      2024-001                   │  │
│  │ Spécialité:          Informatique               │  │
│  │ Discipline:          Systèmes Distribués        │  │
│  │                                                  │  │
│  │ ═════════════════════════════════════════════   │  │
│  │                                                  │  │
│  │ ✏️ SECTION 2 : INFORMATIONS DIPLÔME (À REMPLIR)│  │
│  │ ────────────────────────────────────────────    │  │
│  │                                                  │  │
```

**À faire :** ✅ Vérifiez que les infos du doctorant sont **correctes**

---

### 📍 Étape 6 : Remplir la Section 2 - Champ 1

**Temps : 30 secondes**

**Champ : N° Diplôme***

```
1. Cliquez dans le champ "N° Diplôme"

2. Tapez un numéro UNIQUE
   
   💡 Formats recommandés:
   ├─ FSTBM-2026-001
   ├─ D2026-042
   ├─ 2026/42
   ├─ DIPL-20260427-001
   └─ Votre propre format

3. ⚠️ IMPORTANT:
   ├─ Pas d'accents
   ├─ Pas d'espaces
   ├─ Doit être UNIQUE (pas de doublons)
   └─ Longueur max: 255 caractères
```

**Exemple de remplissage :**
```
┌────────────────────────────────────┐
│ N° Diplôme*: [FSTBM-2026-001    ] │
└────────────────────────────────────┘
```

---

### 📍 Étape 7 : Remplir la Section 2 - Champs 2-3

**Temps : 30 secondes**

**Champs : Mentions (Français + Arabe)***

```
1️⃣ MENTION FRANÇAISE:

   Cliquez dans le champ "Mention (Français)"
   Tapez une mention

   💡 Exemples:
   ├─ Très Bien
   ├─ Bien
   ├─ Assez Bien
   ├─ Passable
   ├─ Excellent
   ├─ Very Good
   └─ Ou votre texte personnalisé

2️⃣ MENTION ARABE:

   Cliquez dans le champ "Mention (Arabe)"
   Tapez en arabe

   💡 Exemples:
   ├─ ممتاز (Excellent)
   ├─ جيد جداً (Très bien)
   ├─ جيد (Bien)
   ├─ مقبول (Passable)
   └─ ضعيف (Faible)
```

**Exemple de remplissage :**
```
┌──────────────────────────────────────────┐
│ Mention (Français)*: [Très Bien       ] │
│ Mention (Arabe)*:    [ممتاز           ] │
└──────────────────────────────────────────┘
```

---

### 📍 Étape 8 : Remplir les Dates

**Temps : 1 minute**

**Champs : Dates d'Examen et d'Obtention***

```
1️⃣ DATE D'EXAMEN:

   Format: JJ/MM/AAAA
   
   Exemple:
   ├─ 15/04/2026 (15 avril 2026)
   ├─ 01/01/2026
   └─ 31/12/2025

   💡 Conseils:
   ├─ Date généralement avant la date d'obtention
   ├─ Doit être une date valide
   └─ Évitez les dates futures

   Actions:
   ├─ Cliquez dans le champ
   ├─ Tapez manuellement
   └─ Ou cliquez le calendrier (si disponible)

2️⃣ DATE D'OBTENTION:

   Format: JJ/MM/AAAA
   
   Exemple:
   ├─ 20/04/2026 (après la date d'examen)
   ├─ 15/04/2026 (même jour si validation immédiate)
   └─ 01/05/2026

   💡 Conseils:
   ├─ Généralement APRÈS la date d'examen
   ├─ Peut être la même si approbation directe
   └─ Ne peut pas être dans le futur
```

**Exemple de remplissage :**
```
┌──────────────────────────────────────────┐
│ Date Examen*:        [15/04/2026      ] │
│ Date Obtention*:     [20/04/2026      ] │
└──────────────────────────────────────────┘
```

---

### 📍 Étape 9 : Remplir le Statut (Optionnel)

**Temps : 15 secondes**

**Champ : Statut** (par défaut: En Attente)

```
Cliquez sur le dropdown "Statut"

Options disponibles:
├─ ⏳ En Attente (par défaut)
│  └─ Diplôme fraîchement créé, en cours de traitement
│
├─ ✅ Approuvé
│  └─ Diplôme validé et approuvé par le jury/administrateur
│
└─ ❌ Rejeté
   └─ Diplôme rejeté ou invalide pour une raison

⚠️ Conseil: Laissez "En Attente" par défaut si vous n'êtes pas sûr
```

**Exemple de remplissage :**
```
Statut: [En Attente ▼]

Ou après sélection:
Statut: [Approuvé ▼]
```

---

### 📍 Étape 10 : Remplir la Note (Optionnel)

**Temps : 15 secondes**

**Champ : Note Moyenne**

```
Cliquez dans le champ "Note Moyenne"

Format: Nombre décimal entre 0 et 20

💡 Exemples:
├─ 20 ou 20.00 (Excellent)
├─ 18.50 (Très bien)
├─ 15 (Bien)
├─ 12.75 (Assez bien)
├─ 10 (Passable)
├─ 8.5 (Faible)
└─ 0 (Très faible/absent)

⚠️ Conseils:
├─ La note doit être ≥ 0 et ≤ 20
├─ Vous pouvez laisser vide
└─ Utile pour la traçabilité
```

**Exemple de remplissage :**
```
┌──────────────────────────────────────────┐
│ Note Moyenne: [18.50                   ] │
└──────────────────────────────────────────┘
```

---

### 📍 Étape 11 : Remplir les Observations (Optionnel)

**Temps : 30 secondes**

**Champ : Observations (Zone texte)**

```
Cliquez dans la zone "Observations"

C'est un champ libre pour noter des commentaires

💡 Exemples d'observations:
├─ "Mention spéciale accordée par le jury"
├─ "Mémoire de recherche excellente qualité"
├─ "En attente de validation finale"
├─ "Diplôme provisoire remis"
├─ "Correction requise avant approbation"
└─ "Cumul des mentions (France + Arabe)"

⚠️ Conseils:
├─ Peut être vide
├─ Utile pour documentation
├─ Limité à ~1000 caractères
└─ Visible lors de la consultation
```

**Exemple de remplissage :**
```
┌────────────────────────────────────────┐
│ Observations:                          │
│ [Mention spéciale accordée.           ]│
│ [Mémoire de très bonne qualité.       ]│
│ [Validation finale en cours.          ]│
└────────────────────────────────────────┘
```

---

### 📍 Étape 12 : VÉRIFIER Avant Enregistrement

**Temps : 30 secondes - TRÈS IMPORTANT**

**Checklist à faire AVANT de cliquer "Enregistrer":**

```
✅ CHAMPS OBLIGATOIRES (avec *):

   □ N° Diplôme              : Rempli et UNIQUE ?
   □ Mention (Français)      : Remplie ?
   □ Mention (Arabe)         : Remplie ?
   □ Date Examen             : Format JJ/MM/AAAA ?
   □ Date Obtention          : Format JJ/MM/AAAA ?

⚠️ VÉRIFICATIONS IMPORTANTES:

   □ N° Diplôme n'existe pas déjà
   □ Pas d'accents ou caractères spéciaux
   □ Dates valides et logiques
   □ Dates: Examen ≤ Obtention (généralement)

📋 DONNÉES INFOS DOCTORANT (Section 1):

   □ Doctorant correct ?
   □ CIN exact ?
   □ Spécialité correcte ?
```

**Affichage avant enregistrement :**
```
┌────────────────────────────────────────────┐
│                                            │
│ 📝 CRÉER DIPLÔME                          │
│                                            │
│ ✓ N° Diplôme:          FSTBM-2026-001    │
│ ✓ Mention (FR):        Très Bien         │
│ ✓ Mention (AR):        ممتاز              │
│ ✓ Date Examen:         15/04/2026        │
│ ✓ Date Obtention:      20/04/2026        │
│   Statut:              En Attente        │
│   Note:                18.50             │
│   Observations:        Mention spéciale  │
│                                            │
│    [Annuler]              [Enregistrer]   │
│                                            │
└────────────────────────────────────────────┘
```

---

### 📍 Étape 13 : Cliquer "Enregistrer"

**Temps : 3-5 secondes**

```
1. Cliquez sur le bouton "✅ Enregistrer"

2. Attendez 2-3 secondes (pas d'action)
   ├─ Pas de barre de chargement
   └─ C'est normal, la requête est en cours

3. L'une de ces choses se produit:
```

**Résultat 1 : ✅ SUCCÈS**
```
✅ Message vert: "Diplôme créé avec succès!"

Conséquences:
├─ La modal se ferme automatiquement
├─ Vous retournez à la page /diplomes
├─ Le tableau se rafraîchit
└─ Vous voyez le NOUVEAU diplôme en haut ou en bas
```

**Résultat 2 : ⚠️ ERREUR DE VALIDATION**
```
⚠️ Message rouge: "Erreur de validation"

Avec détail du champ:
├─ "N° Diplôme doit être unique"
├─ "Veuillez remplir tous les champs obligatoires"
├─ "Format de date invalide"
└─ "Note doit être entre 0 et 20"

Action:
├─ Lisez le message d'erreur
├─ Corrigez le champ indiqué
├─ Cliquez "Enregistrer" à nouveau
```

**Résultat 3 : 🔴 ERREUR SERVEUR**
```
🔴 Message rouge: "Erreur serveur"

Possibles causes:
├─ Backend pas en cours d'exécution
├─ Problème de connexion API
├─ Erreur base de données

Actions:
├─ Vérifiez que le backend est lancé
├─ Vérifiez les logs Laravel
├─ Rechargez la page (F5)
├─ Recommencez
```

---

### 📍 Étape 14 : Vérifier le Résultat

**Temps : 30 secondes**

**Après succès, vous retournez à `/diplomes`**

```
1. Cherchez votre nouveau diplôme dans le tableau

2. Où le trouver ?
   ├─ En haut du tableau (derniers ajoutés généralement)
   ├─ Utilisez la barre de recherche
   └─ Cherchez par N° Diplôme ou nom du doctorant

3. Vérifiez les informations:
   ├─ N° Diplôme correct ?
   ├─ Nom du doctorant correct ?
   ├─ Mention affichée ?
   ├─ Statut correct ? (⏳ En Attente)
   └─ Note si saisie ?
```

**Affichage final :**
```
┌────────────────────────────────────────────────────┐
│ 🎓 Gestion des Diplômes                           │
│ ┌───────────────────────────────────────────────┐ │
│ │ ➕ Nouveau Diplôme    🔍 [Rechercher...]     │ │
│ ├───────────────────────────────────────────────┤ │
│ │ N° Diplôme │ Doctorant │ CIN    │ Mention   │ │
│ ├───────────────────────────────────────────────┤ │
│ │ FSTBM-2026-│ Ahmed Ben │ Y12345 │ Très      │ │
│ │ 001        │ Brahim    │        │ Bien ✅   │ │
│ │ D002       │ Fatima    │ Y23456 │ Bien      │ │
│ │ D003       │ Mohammed  │ Y34567 │ Assez B..│ │
│ └───────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────┘

✅ SUCCÈS! Votre diplôme a été créé.
```

---

## 🎬 TUTORIEL RAPIDE - Autres Actions

### 🔍 Rechercher un Diplôme

```
1. Allez à /diplomes

2. Utilisez la barre "🔍 Rechercher..."

3. Tapez:
   ├─ Nom du doctorant (ex: "Ahmed")
   ├─ CIN (ex: "Y12345")
   ├─ N° de diplôme (ex: "FSTBM-2026")
   └─ N° inscription (ex: "2024-001")

4. Le tableau se filtre en TEMPS RÉEL
```

---

### 👁️ Voir les Détails d'un Diplôme

```
1. Depuis /diplomes, localisez le diplôme

2. Cliquez sur l'icône "👁️ Voir" à la fin de la ligne

3. Une modal s'ouvre avec TOUS les détails:
   ├─ Nom doctorant (FR + AR)
   ├─ Toutes les infos du diplôme
   └─ Dates et observations

4. Cliquez "Fermer" pour quitter
```

---

### 🗑️ Supprimer un Diplôme

```
1. Depuis /diplomes, localisez le diplôme

2. Cliquez sur l'icône "🗑️ Supprimer"

3. Confirmation: "Êtes-vous sûr de vouloir supprimer?"

4. Cliquez "Oui, supprimer"

5. ⚠️ ATTENTION: Cette action est IRRÉVERSIBLE

6. Le diplôme disparaît du tableau
```

---

## 💡 Conseils et Astuces

### 💡 Astuce 1 : N° Diplôme Unique
```
Pour éviter les doublons, utilisez un format avec date:
├─ FSTBM-20260427-001 (FSTBM-AAAAMMJJ-001)
├─ D-2026-04-27-001
└─ 20260427-001

Cela rend unique et traçable!
```

### 💡 Astuce 2 : Recherche Efficace
```
Au lieu de taper le nom complet:
├─ "Ah" pour "Ahmed"
├─ "Fat" pour "Fatima"
└─ "Mo" pour "Mohammed"

La recherche est PROGRESSIVE!
```

### 💡 Astuce 3 : Mentions Bilingues
```
Toujours remplir les deux:
├─ Mention Français (pour rapport officiel FR)
└─ Mention Arabe (pour rapport officiel AR)

Cela permet la génération de documents multilingues!
```

### 💡 Astuce 4 : Observations Importantes
```
Notez les contextes spéciaux:
├─ "Diplomation différée"
├─ "Conditions spéciales appliquées"
├─ "En attente de signature"
├─ "Diplôme provisoire émis"
└─ "Réserves du jury à lever"

Très utile pour la traçabilité administrative!
```

---

## 🆘 Si Vous Êtes Bloqué

| Problème | Solution |
|----------|----------|
| Modal ne s'ouvre pas | Rechargez la page (F5) |
| Pas de doctorant trouvé | Vérifiez que des doctorants existent dans le système |
| "N° Diplôme doit être unique" | Utilisez un N° différent (probablement déjà utilisé) |
| Les champs n'apparaissent pas | Attendez le chargement complet (2-3 sec) |
| Erreur réseau | Vérifiez que le backend est lancé sur port 8001 |
| Rien ne se passe au clic | Attendez quelques secondes, puis vérifiez les logs |

---

## ✅ Vous l'avez fait!

Vous venez de créer votre **premier diplôme** ! 🎉

**Prochaines étapes :**
- Créer d'autres diplômes
- Explorer les autres modules (Doctorants, Jurys)
- Consulter le [Guide d'Utilisation Complet](GUIDE_UTILISATION.md) pour plus de détails

---

**Bonne utilisation! 🎓**
