# Facture_Express

Un backend de gestion de factures développé avec Node.js et Sequelize

## Prérequis
- Node.js v18+
- PostgreSQL/MySQL
- pnpm

## Installation
```powershell
# Cloner le dépôt
git clone https://github.com/votre-repo/facture-express.git
cd facture-express

# Installer les dépendances
pnpm install

# Configurer la base de données
# Créer un fichier config/config.json basé sur config/config.example.json
```

## Configuration de la base de données
1. Créer une base de données PostgreSQL ou MySQL
2. Modifier les credentials dans `config/config.json`

## Exécution
```powershell
# Lancer les migrations
npx sequelize-cli db:migrate

# Démarrer le serveur (production)
node index.js

# Mode développement avec rechargement automatique
nodemon index.js
```

## Environnement de développement
```powershell
# Lancer le watcher ESLint
pnpm run lint:watch

# Exécuter les tests
pnpm test
```