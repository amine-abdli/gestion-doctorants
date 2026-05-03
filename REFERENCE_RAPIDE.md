#  Tableau de Référence Rapide

## 📊 Résumé des Actions Principales

### Module Doctorants
| Action | Accès | Résultat |
|--------|-------|----------|
| **Voir Liste** | `/doctorants` | Tableau avec tous les doctorants |
| **Ajouter** | Bouton "➕" | Formulaire de création |
| **Modifier** | Icône "✏️" | Formulaire pré-rempli |
| **Supprimer** | Icône "🗑️" | Confirmation requise |
| **Rechercher** | Barre de recherche | Filtre en temps réel |

### Module Jurys
| Action | Accès | Résultat |
|--------|-------|----------|
| **Voir Liste** | `/juries` | Tableau avec tous les jurys |
| **Ajouter** | Bouton "➕" | Formulaire de création |
| **Modifier** | Icône "✏️" | Formulaire pré-rempli |
| **Supprimer** | Icône "🗑️" | Confirmation requise |
| **Associer** | Fiche doctorant | Modal sélection jury |

### Module Diplômes ⭐
| Action | Accès | Résultat |
|--------|-------|----------|
| **Voir Liste** | `/diplomes` | Tableau avec tous les diplômes |
| **Ajouter** | Bouton "➕" | 2 modals : Sélection + Formulaire |
| **Voir Détails** | Icône "👁️" | Fiche complète du diplôme |
| **Supprimer** | Icône "🗑️" | Confirmation requise |
| **Rechercher** | Barre de recherche | Filtre par doctorant/N°/CIN |

---

## ⌨️ Raccourcis Clavier

| Touche | Action | Où |
|--------|--------|-----|
| **Ctrl+F** | Recherche navigateur | Partout |
| **Échap** | Fermer modal/form | Formulaires |
| **Tab** | Naviguer champs | Formulaires |
| **Entrée** | Soumettre formulaire | Formulaires (si activé) |
| **Ctrl+S** | Enregistrer (selon navigateur) | Formulaires |

---

## 🚀 Checklist d'Installation

- [ ] PHP ≥ 8.1 installé
- [ ] Node.js ≥ 16.0 installé
- [ ] MySQL en cours d'exécution
- [ ] `composer install` exécuté (backend)
- [ ] `.env` configuré avec base de données
- [ ] `php artisan key:generate` exécuté
- [ ] `php artisan migrate` exécuté
- [ ] `npm install` exécuté (frontend)
- [ ] Backend lancé : `php artisan serve --port=8001`
- [ ] Frontend lancé : `npm run dev`
- [ ] ✅ Application accessible à `http://localhost:5174`

---

## 📋 Champs Obligatoires par Module

### Doctorants
- ✅ Nom Français
- ✅ Nom Arabe
- ✅ CIN (unique)
- ✅ N° Inscription
- ✅ Spécialité
- ✅ Discipline

### Jurys
- ✅ Nom Français
- ✅ Nom Arabe
- ✅ Email

### Diplômes
- ✅ Doctorant (sélectionné d'abord)
- ✅ N° Diplôme (unique)
- ✅ Mention Français
- ✅ Mention Arabe
- ✅ Date Examen
- ✅ Date Obtention

---

## 🌐 URLs Importantes

| Page | URL |
|------|-----|
| **Accueil** | `http://localhost:5174` |
| **Doctorants** | `http://localhost:5174/doctorants` |
| **Jurys** | `http://localhost:5174/juries` |
| **Diplômes** | `http://localhost:5174/diplomes` |
| **API Backend** | `http://localhost:8001` |
| **API Doctorants** | `http://localhost:8001/api/doctorants` |
| **API Jurys** | `http://localhost:8001/api/juries` |
| **API Diplômes** | `http://localhost:8001/api/diplomes` |

---

## 💾 Variables .env Critiques

```env
APP_DEBUG=true
APP_URL=http://localhost:8001

DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=fstbm_db
DB_USERNAME=root
DB_PASSWORD=
```

---

## 🔍 Codes d'Erreur Courants

| Code | Signification | Solution |
|------|---------------|----------|
| **400** | Bad Request | Vérifiez le format des données |
| **404** | Not Found | Vérifiez l'URL de l'API |
| **422** | Validation Failed | Vérifiez les champs obligatoires |
| **500** | Server Error | Consultez les logs Laravel |
| **CORS Error** | Erreur d'origine | Configurez CORS |

---

## 📞 Commandes Utiles

```bash
# Backend
php artisan serve --port=8001          # Lancer le serveur
php artisan tinker                     # Console interactive
php artisan migrate                    # Exécuter migrations
php artisan migrate:rollback           # Annuler migrations
php artisan cache:clear                # Vider le cache
php artisan config:cache               # Cache config
php artisan db:seed                    # Remplir la BD

# Frontend
npm run dev                             # Lancer le serveur dev
npm run build                           # Build production
npm install                             # Installer dépendances
npm audit fix                           # Corriger vulnérabilités

# Git
git status                              # Voir modifications
git add .                               # Ajouter fichiers
git commit -m "message"                 # Committer
git push                                # Pousser vers distant
```

---

## 🎨 Palette de Couleurs

| Statut | Couleur | Hex |
|--------|---------|-----|
| ⏳ En Attente | Jaune | `#FFC107` |
| ✅ Approuvé | Vert | `#28A745` |
| ❌ Rejeté | Rouge | `#DC3545` |
| ℹ️ Info | Bleu | `#17A2B8` |

---

## 🐛 Débogage

### Activer les logs détaillés
```javascript
// Dans console navigateur (F12)
localStorage.setItem('debug', '*')
```

### Voir les requêtes API
```
F12 → Onglet Network → Cliquer sur requête
```

### Voir les erreurs backend
```bash
tail -f storage/logs/laravel.log
```

---

**Dernière mise à jour : 27 avril 2026**
