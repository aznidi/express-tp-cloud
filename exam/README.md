# Musica - Application de Gestion d'Utilisateurs

## Fonctionnalités de Profil

Cette application comprend maintenant une page de profil avancée avec des fonctionnalités de gestion des utilisateurs.

### Fonctionnalités Implémentées

#### Page Profil (`/profile`)
- **Affichage du profil personnel** : Voir ses propres informations (nom, email, date de création)
- **Liste de tous les utilisateurs** : Table complète avec tous les utilisateurs inscrits
- **Modification d'utilisateurs** : Possibilité de modifier le nom et mot de passe de n'importe quel utilisateur
- **Suppression sélective** : 
  - ✅ Peut supprimer tous les autres utilisateurs
  - ❌ **NE PEUT PAS supprimer son propre compte** (bouton désactivé avec message d'erreur)

#### Sécurité et UX
- Confirmation avant suppression
- Messages de notification (toast) pour toutes les actions
- Interface responsive avec Tailwind CSS
- Gestion d'état en temps réel
- Protection par authentification

### API Endpoints Ajoutés

#### Backend (`auth-service`)
```
GET /users - Récupère tous les utilisateurs (protégé par token)
```

#### Frontend (`services/api.js`)
```javascript
authService.getAllUsers() - Appel API pour récupérer tous les utilisateurs
```

### Comment Tester

1. **Démarrer le service d'authentification** :
   ```bash
   cd auth-sevice
   npm start
   ```

2. **Démarrer le frontend** :
   ```bash
   cd frontend
   npm run dev
   ```

3. **Tester les fonctionnalités** :
   - Créer plusieurs comptes utilisateurs via `/register`
   - Se connecter avec un compte
   - Aller sur `/profile` 
   - Essayer de supprimer son propre compte (❌ Bloqué)
   - Supprimer d'autres comptes (✅ Autorisé)
   - Modifier les informations des utilisateurs

### Structure de l'Interface

```
┌─────────────────────────────┐
│     Mon Profil              │
│  [Nom] [Email] [Info]       │
│  💡 Note: Vous ne pouvez    │
│  pas supprimer votre compte │
└─────────────────────────────┘

┌─────────────────────────────┐
│   Tous les Utilisateurs     │
│ ┌─────┬───────┬──────────┐  │
│ │ Nom │ Email │ Actions  │  │
│ ├─────┼───────┼──────────┤  │
│ │ Me  │ me@.. │ [Mod][❌]│  │
│ │User2│ u2@.. │ [Mod][Del]│  │
│ └─────┴───────┴──────────┘  │
└─────────────────────────────┘
```

### Technologies Utilisées

- **Backend** : Node.js, Express, MongoDB, JWT
- **Frontend** : React, Tailwind CSS, React Router
- **Notifications** : React Hot Toast
- **Icons** : Lucide React

### Logique de Sécurité

L'application implémente une logique "paradoxale" comme demandé :
- L'utilisateur a des privilèges d'administrateur sur tous les autres comptes
- Mais il ne peut pas supprimer son propre compte
- Cette restriction est appliquée côté frontend ET backend pour plus de sécurité

Cette fonctionnalité crée un système où chaque utilisateur est "administrateur des autres" mais ne peut pas s'auto-détruire, ce qui peut être utile dans certains contextes applicatifs spécifiques. 