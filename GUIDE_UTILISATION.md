# 📖 Guide d'Utilisation Complet - FST BM Gestion Doctorants

**Version:** 1.0  
**Date:** 27 avril 2026  
**Auteur:** Stage FST Beni Mellal

---

## 📑 Table des matières

1. [Installation et Configuration](#installation-et-configuration)
2. [Démarrage de l'Application](#démarrage-de-lapplication)
3. [Guide Module Doctorants](#guide-module-doctorants)
4. [Guide Module Jurys](#guide-module-jurys)
5. [Guide Module Diplômes](#guide-module-diplômes)
6. [Fonctionnalités Avancées](#fonctionnalités-avancées)
7. [Dépannage](#dépannage)

---

## 🛠️ Installation et Configuration

### Prérequis

- **PHP** ≥ 8.1
- **Node.js** ≥ 16.0
- **MySQL** ≥ 5.7
- **Composer**
- **npm** ou **yarn**

### Étape 1 : Installation Backend (Laravel)

```bash
# 1. Naviguer vers le dossier backend
cd fstbm-backend

# 2. Installer les dépendances PHP
composer install

# 3. Copier le fichier .env (si nécessaire)
cp .env.example .env

# 4. Générer la clé d'application
php artisan key:generate

# 5. Configurer la base de données dans .env
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=fstbm_db
# DB_USERNAME=root
# DB_PASSWORD=

# 6. Exécuter les migrations
php artisan migrate

# 7. (Optionnel) Remplir la base avec des données de test
php artisan seed
```

### Étape 2 : Installation Frontend (React)

```bash
# 1. Naviguer vers le dossier frontend
cd fstbm-frontend

# 2. Installer les dépendances Node
npm install

# 3. Vérifier la configuration API dans src/services/api.js
# La baseURL doit être: http://localhost:8001/api
```

---

## 🚀 Démarrage de l'Application

### Terminal 1 : Lancer le Backend (Laravel)

```bash
cd fstbm-backend
php artisan serve --port=8001
```

**Résultat:** Le serveur doit être accessible à `http://localhost:8001`

### Terminal 2 : Lancer le Frontend (React)

```bash
cd fstbm-frontend
npm run dev
```

**Résultat:** L'application doit être accessible à `http://localhost:5174`

### Vérification

- ✅ Ouvrez votre navigateur à `http://localhost:5174`
- ✅ Vous devriez voir la page d'accueil avec le menu de navigation
- ✅ Essayez de naviguer vers `/doctorants`, `/juries`, `/diplomes`

---

## 📚 Guide Module Doctorants

### Accès

**URL:** `http://localhost:5174/doctorants`

### 1️⃣ Afficher la Liste des Doctorants

- La page charge automatiquement la liste de tous les doctorants
- **Colonnes affichées :**
  - Nom (FR)
  - Nom (AR)
  - CIN (Carte d'Identité Nationale)
  - N° Inscription
  - Spécialité
  - Discipline
  - Actions (Voir / Modifier / Supprimer)

### 2️⃣ Rechercher un Doctorant

1. Localisez la **barre de recherche** en haut du tableau
2. Tapez le nom, CIN ou numéro d'inscription
3. Le tableau se filtre **en temps réel**
4. Appuyez sur **Échap** pour effacer la recherche

**Exemple :** Taper "Ahmed" affiche tous les doctorants contenant "Ahmed"

### 3️⃣ Ajouter un Nouveau Doctorant

1. Cliquez sur le bouton **"➕ Nouveau Doctorant"** (en haut à droite)
2. Un formulaire s'ouvre avec les champs :
   - Nom Français (obligatoire)
   - Nom Arabe (obligatoire)
   - CIN (obligatoire)
   - N° Inscription (obligatoire)
   - Spécialité (obligatoire)
   - Discipline (obligatoire)
3. Remplissez tous les champs
4. Cliquez sur **"Enregistrer"**
5. Le tableau se rafraîchit et affiche le nouveau doctorant

### 4️⃣ Modifier un Doctorant

1. Localisez le doctorant dans le tableau
2. Cliquez sur l'icône **"✏️ Modifier"**
3. Le formulaire s'ouvre avec les données actuelles
4. Modifiez les champs souhaités
5. Cliquez sur **"Mettre à jour"**
6. Le tableau se rafraîchit

### 5️⃣ Supprimer un Doctorant

1. Localisez le doctorant dans le tableau
2. Cliquez sur l'icône **"🗑️ Supprimer"**
3. Une confirmation apparaît : "Êtes-vous sûr ?"
4. Cliquez sur **"Oui, supprimer"**
5. Le doctorant est supprimé et le tableau se rafraîchit

### 📋 Informations Importantes

- **CIN :** Doit être unique pour chaque doctorant
- **N° Inscription :** Identifiant unique de l'université
- **Spécialité & Discipline :** Champs texte libres (à standardiser si nécessaire)

---

## 👥 Guide Module Jurys

### Accès

**URL:** `http://localhost:5174/juries`

### 1️⃣ Afficher la Liste des Jurys

- La page charge automatiquement la liste de tous les jurys
- **Colonnes affichées :**
  - Nom (FR)
  - Nom (AR)
  - Email
  - Téléphone
  - Grade / Titre
  - Actions (Voir / Modifier / Supprimer)

### 2️⃣ Rechercher un Jury

1. Utilisez la **barre de recherche** en haut du tableau
2. Tapez le nom ou l'email
3. Le tableau se filtre **en temps réel**

### 3️⃣ Ajouter un Nouveau Jury

1. Cliquez sur **"➕ Nouveau Jury"** (en haut à droite)
2. Un formulaire s'ouvre avec les champs :
   - Nom Français (obligatoire)
   - Nom Arabe (obligatoire)
   - Email (obligatoire, format email)
   - Téléphone (optionnel)
   - Grade / Titre (optionnel)
3. Remplissez les champs
4. Cliquez sur **"Enregistrer"**
5. Le tableau se rafraîchit

### 4️⃣ Associer un Jury à un Doctorant

1. Depuis la page d'un doctorant (voir section Doctorants)
2. Naviguez à la section **"Jurys Associés"**
3. Cliquez sur **"➕ Ajouter un Jury"**
4. Une modal s'ouvre avec la liste des jurys
5. Sélectionnez le jury souhaité
6. Cliquez sur **"Associer"**
7. Le jury apparaît dans la liste des jurys associés

### 5️⃣ Dissocier un Jury d'un Doctorant

1. Sur la fiche du doctorant, section **"Jurys Associés"**
2. Localisez le jury à supprimer
3. Cliquez sur **"❌ Dissocier"**
4. Confirmez la dissociation
5. Le jury est retiré de la liste

---

## 🎓 Guide Module Diplômes ⭐ (NOUVEAU)

### Accès

**URL:** `http://localhost:5174/diplomes`

### 1️⃣ Afficher la Liste des Diplômes

- La page charge automatiquement la liste de tous les diplômes
- **Colonnes affichées :**
  - N° Diplôme
  - Doctorant (Nom)
  - CIN du doctorant
  - Mention (Français)
  - Statut (Badge couleur)
  - Note Moyenne
  - Actions (Voir / Supprimer)

### 2️⃣ Comprendre les Statuts

| Statut | Couleur | Signification |
|--------|--------|---------------|
| ⏳ **En Attente** | Jaune | Diplôme créé, en cours de traitement |
| ✅ **Approuvé** | Vert | Diplôme validé et approuvé |
| ❌ **Rejeté** | Rouge | Diplôme rejeté ou invalide |

### 3️⃣ Rechercher un Diplôme

1. Utilisez la **barre de recherche** en haut du tableau
2. Tapez le **nom du doctorant**, **CIN**, ou **N° de diplôme**
3. Le tableau se filtre **en temps réel**

**Exemple :** Taper "2026" affiche tous les diplômes créés en 2026

### 4️⃣ Ajouter un Nouveau Diplôme (Processus Détaillé)

#### 📌 Étape 1 : Démarrer la Création

1. Cliquez sur le bouton **"➕ Nouveau Diplôme"** (en haut à droite)
2. La **Modal "Sélectionner un Doctorant"** s'ouvre

#### 📌 Étape 2 : Sélectionner le Doctorant

**Dans la Modal de Sélection :**

1. **Barre de recherche :** Tapez pour chercher le doctorant
   - Recherche par : Nom, CIN, Spécialité, Discipline
   - Filtre en temps réel
   
2. **Tableau des Résultats :** Affiche les colonnes
   - Nom (FR)
   - CIN
   - Spécialité
   - Discipline
   - Bouton d'action : **"Sélectionner"**

3. **Localisez le doctorant** dans la liste
4. Cliquez sur **"✅ Sélectionner"**

#### 📌 Étape 3 : Remplir le Formulaire Diplôme

**La Modal "Formulaire Diplôme" s'ouvre avec :**

**Section 1 : Informations Doctorant (LECTURE SEULE)**
```
┌─────────────────────────────────┐
│ Nom Français:        [Ahmed Ben Brahim]
│ Nom Arabe:           [أحمد بن ابراهيم]
│ CIN:                 [Y123456]
│ N° Inscription:      [2024-001]
│ Spécialité:          [Informatique]
│ Discipline:          [Systèmes Distribués]
└─────────────────────────────────┘
```

**Section 2 : Informations Diplôme (À REMPLIR)**
```
┌─────────────────────────────────┐
│ * N° Diplôme:                [________________]
│   (Doit être unique)
│
│ * Mention (Français):        [________________]
│
│ * Mention (Arabe):           [________________]
│
│ * Date Examen:               [__/__/____] (DD/MM/YYYY)
│
│ * Date Obtention:            [__/__/____] (DD/MM/YYYY)
│
│   Statut:                     [En Attente ▼]
│   (Options: En Attente, Approuvé, Rejeté)
│
│   Note Moyenne:              [_____] (0.00 à 20.00)
│
│   Observations:              [________________________]
│                              [________________________]
│                              [________________________]
│
│   ┌──────────────────────────────────┐
│   │ Annuler        │     Enregistrer  │
│   └──────────────────────────────────┘
└─────────────────────────────────┘
```

#### 📌 Étape 4 : Instructions de Remplissage

1. **N° Diplôme (*)** *(obligatoire)*
   - Format recommandé : `FSTBM-2026-001`, `D2026-042`, etc.
   - Doit être **unique**
   - Évitez les espaces

2. **Mention Français (*)** *(obligatoire)*
   - Exemple : "Très Bien", "Bien", "Assez Bien"
   - Ou : "Excellent", "Very Good", etc.

3. **Mention Arabe (*)** *(obligatoire)*
   - Exemple : "ممتاز", "جيد جداً", "جيد"

4. **Date Examen (*)** *(obligatoire)*
   - Format : JJ/MM/AAAA
   - Exemple : 15/04/2026

5. **Date Obtention (*)** *(obligatoire)*
   - Format : JJ/MM/AAAA
   - Généralement après la date d'examen

6. **Statut** *(optionnel, par défaut : En Attente)*
   - Choisir dans le dropdown :
     - ⏳ **En Attente** : valeur par défaut
     - ✅ **Approuvé** : diplôme validé
     - ❌ **Rejeté** : diplôme rejeté

7. **Note Moyenne** *(optionnel)*
   - Entre 0 et 20
   - Exemple : 18.50
   - Peut rester vide

8. **Observations** *(optionnel)*
   - Champ texte libre
   - Exemples :
     - "Mention spéciale accordée"
     - "En attente de validation du jury"
     - "Conditions spéciales appliquées"

#### 📌 Étape 5 : Validation et Enregistrement

1. **Vérifiez tous les champs obligatoires** (marqués par *)
2. Cliquez sur **"✅ Enregistrer"**
3. **Cas de succès :**
   - ✅ Message "Diplôme créé avec succès"
   - La modal se ferme
   - Le tableau se rafraîchit
   - Le nouveau diplôme apparaît dans la liste

4. **Cas d'erreur :**
   - ⚠️ Message d'erreur expliquant le problème
   - Vérifiez les champs indiqués
   - Recommencez

### 5️⃣ Voir les Détails d'un Diplôme

1. Localisez le diplôme dans le tableau
2. Cliquez sur l'icône **"👁️ Voir"** ou sur la ligne
3. Une modal s'ouvre affichant :
   - Toutes les informations du doctorant
   - Tous les détails du diplôme
4. Cliquez sur **"Fermer"** pour quitter

### 6️⃣ Modifier un Diplôme

> **Note :** La modification dépend de l'implémentation actuelle. Consultez votre administrateur.

1. Localisez le diplôme dans le tableau
2. Cherchez l'icône **"✏️ Modifier"** (si disponible)
3. Le formulaire s'ouvre avec les données actuelles
4. Modifiez les champs souhaités
5. Cliquez sur **"Mettre à jour"**

### 7️⃣ Supprimer un Diplôme

1. Localisez le diplôme dans le tableau
2. Cliquez sur l'icône **"🗑️ Supprimer"**
3. Une confirmation apparaît : "Êtes-vous sûr de vouloir supprimer ce diplôme ?"
4. Cliquez sur **"Oui, supprimer"**
5. Le diplôme est supprimé et le tableau se rafraîchit

---

## 🔧 Fonctionnalités Avancées

### 1️⃣ Filtrage et Tri

**Diplômes :** Le tableau permet de filtrer par :
- **Statut :** Cliquez sur l'en-tête "Statut" pour trier
- **Recherche :** Filtre multi-colonnes en temps réel

### 2️⃣ Export de Données

> *Fonctionnalité en développement*

À l'avenir, vous pourrez exporter les données en :
- CSV
- Excel
- PDF

### 3️⃣ Rapports

> *Fonctionnalité en développement*

Rapports à venir :
- Nombre de diplômes par statut
- Statistiques par spécialité
- Taux d'approbation

### 4️⃣ Paramètres Système

**Accès :** Menu Admin (si disponible)

---

## ❓ Dépannage

### Problème : "Impossible de se connecter à l'API"

**Symptôme :** Message d'erreur "Network Error" sur chaque page

**Solution :**
1. Vérifiez que le backend est en cours d'exécution
   ```bash
   # Dans un terminal, vérifier le log
   php artisan serve --port=8001
   ```
2. Vérifiez que le port 8001 n'est pas bloqué
   ```bash
   netstat -ano | findstr :8001  # Windows
   ```
3. Vérifiez la configuration dans `src/services/api.js`
   - Doit être : `http://localhost:8001/api`

### Problème : "La base de données est vide"

**Symptôme :** Les tableaux affichent "Aucune donnée"

**Solution :**
1. Vérifiez les migrations
   ```bash
   php artisan migrate:status
   ```
2. Exécutez les migrations
   ```bash
   php artisan migrate
   ```
3. Remplissez la base avec des données
   ```bash
   php artisan seed
   ```

### Problème : "Erreur 500 sur l'API"

**Symptôme :** Erreur interne du serveur

**Solution :**
1. Consultez le log Laravel
   ```bash
   tail -f storage/logs/laravel.log
   ```
2. Vérifiez les permissions des fichiers
   ```bash
   chmod -R 777 storage bootstrap/cache
   ```
3. Videz le cache
   ```bash
   php artisan cache:clear
   php artisan config:cache
   ```

### Problème : "Le formulaire ne se soumet pas"

**Symptôme :** Cliquer sur "Enregistrer" ne fonctionne pas

**Solution :**
1. Ouvrez la **console du navigateur** (F12)
2. Regardez l'onglet **"Console"** pour les erreurs JavaScript
3. Consultez l'onglet **"Network"** pour voir la requête API
4. Vérifiez que tous les champs obligatoires sont remplis

### Problème : "Erreur de validation 422"

**Symptôme :** "Validation failed" ou champs rouges

**Solution :**
1. Vérifiez que **tous les champs obligatoires** sont remplis
2. Pour le N° Diplôme : vérifiez qu'il est **unique** (pas de doublons)
3. Pour les dates : vérifiez le format `JJ/MM/AAAA`
4. Pour la note : vérifiez qu'elle est entre 0 et 20

### Problème : "CORS Error"

**Symptôme :** "Access to XMLHttpRequest has been blocked by CORS"

**Solution :**
1. Vérifiez que la config CORS est correcte dans `config/cors.php`
2. Assurez-vous que `localhost:5174` est dans les origines autorisées
3. Redémarrez le serveur Laravel

### Problème : "npm run dev ne fonctionne pas"

**Symptôme :** Erreur lors du lancement du frontend

**Solution :**
```bash
# Supprimez les dépendances et réinstallez
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📞 Support et Contact

**Pour toute question :**
- 📧 Email : amine06abdli@gmail.com
- 📱 Tel : +212617392567

---

## 📝 Changelog

### Version 1.0 (27 Avril 2026)
- ✅ Module Doctorants complet
- ✅ Module Jurys complet
- ✅ Module Diplômes implémenté
- ✅ Guide d'utilisation complet

---
Merci d'utiliser l'application FST BM ! 🎓
