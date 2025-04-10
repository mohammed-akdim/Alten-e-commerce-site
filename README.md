# Alten E-commerce Application

Application e-commerce complète construite avec Angular et Node.js, offrant une expérience utilisateur moderne et responsive.

## 🚀 Fonctionnalités

### 👥 Gestion des Utilisateurs
- Inscription et connexion sécurisées
- Authentification JWT
- Gestion des rôles (utilisateur/administrateur)
- Profil utilisateur personnalisable

### 🛍️ Catalogue Produits
- Liste des produits avec pagination
- Recherche et filtrage avancés
- Vue détaillée des produits
- Gestion des catégories
- Images et descriptions riches

### 🛒 Gestion du Panier
- Ajout/suppression de produits
- Mise à jour des quantités en temps réel
- Persistance du panier
- Calcul automatique du total
- Indicateur de quantité dans la navbar

### ❤️ Liste de Souhaits
- Ajout/suppression des favoris
- Synchronisation avec le compte utilisateur
- Interface intuitive
- Indicateurs visuels (cœur plein/vide)

### 👑 Panel Administrateur
- Gestion complète des produits (CRUD)
- Gestion des utilisateurs
- Suivi des commandes
- Tableau de bord avec statistiques

## 🛠️ Technologies Utilisées

### Frontend
- Angular 18+
- Angular Material
- RxJS
- TypeScript
- SCSS

### Backend
- Node.js
- Express.js
- TypeScript
- JWT pour l'authentification
- Stockage JSON

## 📋 Prérequis

- Node.js (v18 ou supérieur)
- npm (v9 ou supérieur)
- Angular CLI (v17 ou supérieur)

## 🚀 Installation

### Backend

1. Accéder au dossier backend :
```bash
cd backend
```

2. Installer les dépendances :
```bash
npm install
```

3. Compiler le code TypeScript :
```bash
npm run build
```

4. Démarrer le serveur de développement :
```bash
npm run dev
```

Le serveur backend sera accessible sur http://localhost:3000

### Frontend

1. Accéder au dossier frontend :
```bash
cd frontend
```

2. Installer les dépendances :
```bash
npm install
```

3. Démarrer le serveur de développement :
```bash
ng serve
```

L'application sera accessible sur http://localhost:4200

## 📚 Structure du Projet

```
alten-ecommerce/
├── backend/         # Node.js backend application
└── frontend/        # Angular frontend application
```

## 🔑 Configuration

### Variables d'Environnement Backend (.env)
```
PORT=3000
JWT_SECRET=your_jwt_secret
```

### Configuration Frontend (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

## 📡 API Endpoints

### Authentification
- POST /auth/account - Inscription
- POST /auth/token - Connexion

### Produits
- GET /products - Liste des produits
- GET /products/:id - Détail d'un produit
- POST /products - Créer un produit (admin)
- PUT /products/:id - Modifier un produit (admin)
- DELETE /products/:id - Supprimer un produit (admin)

### Panier
- GET /carts - Obtenir le panier
- POST /carts/add - Ajouter au panier
- PUT /carts/:id - Modifier la quantité
- DELETE /carts/:id - Supprimer du panier

### Favoris
- GET /wishlists - Liste des favoris
- POST /wishlists/add - Ajouter aux favoris
- DELETE /wishlists/:id - Retirer des favoris

## 🔒 Sécurité

- Authentification JWT
- Protection CORS
- Validation des données
- Hachage des mots de passe
- Protection des routes sensibles

## 🤝 Contribution

1. Forkez le projet
2. Créez votre branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`)
4. Poussez vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence ISC.

## 👥 Auteurs

- Équipe Alten

## 📞 Support

Pour toute question ou problème, veuillez ouvrir une issue sur le dépôt GitHub. 