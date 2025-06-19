const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');
const app = express();
const PORT = process.env.PORT || 3000;

// Pour parser le JSON dans les requêtes
app.use(express.json());

// Import des modèles Sequelize
const db = require('./models');

// Import des routes
const userRoutes = require('./src/routes/user');
const invoiceRoutes = require('./src/routes/invoice');
const invoiceLineRoutes = require('./src/routes/invoiceLine');

// Import du middleware d'authentification
const auth = require('./src/middleware/auth');

// Test de connexion à la base de données
// (optionnel, mais utile au démarrage)

db.sequelize.authenticate()
  .then(() => {
    console.log('Connexion à la base de données réussie !');
  })
  .catch(err => {
    console.error('Impossible de se connecter à la base de données :', err);
  });

// Middleware
app.use(cors());

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: "API de Gestion de Factures - Documentation",
    customfavIcon: "https://www.favicon.cc/logo3d/805095.png"
}));

// Routes publiques
app.use('/api/auth', userRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({ message: "Bienvenue sur l'API Backend Facture !" });
});

// Routes protégées
app.use('/api/invoices', auth, invoiceRoutes);
app.use('/api', auth, invoiceLineRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Une erreur est survenue',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Documentation Swagger disponible sur http://localhost:${PORT}/api-docs`);
});
