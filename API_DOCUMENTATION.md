# Documentation API - Système de Gestion de Factures

## Table des matières
- [Authentification](#authentification)
- [Factures](#factures)
- [Lignes de facture](#lignes-de-facture)

## Base URL
```
http://localhost:3000/api
```

## Authentification

### Inscription
```http
POST /auth/register
```

**Requête**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Réponse (201)**
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt_token"
}
```

### Connexion
```http
POST /auth/login
```

**Requête**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Réponse (200)**
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt_token"
}
```

### Profil utilisateur
```http
GET /auth/profile
```

**Headers**
```
Authorization: Bearer jwt_token
```

**Réponse (200)**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com"
}
```

## Factures

### Créer une facture
```http
POST /invoices
```

**Headers**
```
Authorization: Bearer jwt_token
```

**Requête** (seul le nom est requis, les autres champs sont générés automatiquement)
```json
{
  "name": "Facture pour services de développement",
  "issuerName": "Ma Société",
  "issuerAddress": "123 Rue Business",
  "clientName": "Client SARL",
  "clientAddress": "456 Avenue Client",
  "vatActive": true,
  "vatRate": 20
}
```

**Réponse (201)**
```json
{
  "id": "uuid",
  "name": "Facture pour services de développement",
  "invoiceNumber": "FACT-202403001",
  "issuerName": "Ma Société",
  "issuerAddress": "123 Rue Business",
  "clientName": "Client SARL",
  "clientAddress": "456 Avenue Client",
  "invoiceDate": "2024-03-19",
  "dueDate": "2024-04-18",
  "vatActive": true,
  "vatRate": 20,
  "status": "BROUILLON",
  "totalAmount": 0
}
```

### Lister les factures
```http
GET /invoices
```

**Headers**
```
Authorization: Bearer jwt_token
```

**Réponse (200)** (retourne uniquement les champs essentiels)
```json
[
  {
    "totalAmount": 1500.00,
    "status": "BROUILLON",
    "name": "Facture pour services de développement",
    "invoiceNumber": "FACT-202403001"
  }
]
```

### Détails d'une facture
```http
GET /invoices/:id
```

**Headers**
```
Authorization: Bearer jwt_token
```

**Réponse (200)**
```json
{
  "id": "uuid",
  "name": "Facture pour services de développement",
  "invoiceNumber": "FACT-202403001",
  "issuerName": "Ma Société",
  "issuerAddress": "123 Rue Business",
  "clientName": "Client SARL",
  "clientAddress": "456 Avenue Client",
  "invoiceDate": "2024-03-19",
  "dueDate": "2024-04-18",
  "vatActive": true,
  "vatRate": 20,
  "status": "BROUILLON",
  "totalAmount": 1500.00,
  "lines": [
    {
      "id": "uuid",
      "description": "Développement Frontend",
      "quantity": 1,
      "unitPrice": 1500.00,
      "total": 1500.00
    }
  ]
}
```

### Mettre à jour une facture
```http
PUT /invoices/:id
```

**Headers**
```
Authorization: Bearer jwt_token
```

**Requête**
```json
{
  "name": "Facture mise à jour",
  "clientName": "Nouveau Client SARL",
  "clientAddress": "789 Boulevard Client"
}
```

### Mettre à jour le statut d'une facture
```http
PUT /invoices/:id/status
```

**Headers**
```
Authorization: Bearer jwt_token
```

**Requête**
```json
{
  "status": "ATTENTE"
}
```

**Statuts possibles**
- `BROUILLON`
- `ATTENTE`
- `PAYE`
- `RETARD`
- `ANNULE`

### Générer le PDF d'une facture
```http
GET /invoices/:id/pdf
```

**Headers**
```
Authorization: Bearer jwt_token
```

**Réponse (200)**
```
Content-Type: application/pdf
```

## Lignes de facture

### Ajouter une ligne
```http
POST /invoices/:invoiceId/lines
```

**Headers**
```
Authorization: Bearer jwt_token
```

**Requête**
```json
{
  "description": "Développement Frontend",
  "quantity": 1,
  "unitPrice": 1500.00
}
```

**Réponse (201)**
```json
{
  "id": "uuid",
  "description": "Développement Frontend",
  "quantity": 1,
  "unitPrice": 1500.00,
  "total": 1500.00,
  "invoiceId": "invoice_uuid"
}
```

### Ajouter plusieurs lignes
```http
POST /invoices/:invoiceId/lines/bulk
```

**Headers**
```
Authorization: Bearer jwt_token
```

**Requête**
```json
[
  {
    "description": "Développement Frontend",
    "quantity": 1,
    "unitPrice": 1500.00
  },
  {
    "description": "Développement Backend",
    "quantity": 1,
    "unitPrice": 2000.00
  }
]
```

### Lister les lignes d'une facture
```http
GET /invoices/:invoiceId/lines
```

**Headers**
```
Authorization: Bearer jwt_token
```

**Réponse (200)**
```json
[
  {
    "id": "uuid",
    "description": "Développement Frontend",
    "quantity": 1,
    "unitPrice": 1500.00,
    "total": 1500.00
  }
]
```

### Mettre à jour une ligne
```http
PUT /lines/:id
```

**Headers**
```
Authorization: Bearer jwt_token
```

**Requête**
```json
{
  "quantity": 2,
  "unitPrice": 1600.00
}
```

### Supprimer une ligne
```http
DELETE /lines/:id
```

**Headers**
```
Authorization: Bearer jwt_token
```

## Gestion des erreurs

L'API retourne des codes d'erreur HTTP standards :

- `400` : Requête invalide (données manquantes ou invalides)
- `401` : Non authentifié
- `403` : Non autorisé
- `404` : Ressource non trouvée
- `500` : Erreur serveur

Format des erreurs :
```json
{
  "error": "Message d'erreur"
}
```

ou pour les erreurs de validation :
```json
{
  "errors": [
    "Le nom est requis",
    "L'email doit être valide"
  ]
}
```

## Calculs automatiques

- Le total d'une ligne est calculé automatiquement : `quantity * unitPrice`
- Le total d'une facture est la somme des totaux des lignes
- Si la TVA est active, le montant TTC = total HT + (total HT * vatRate / 100)
- La date d'échéance est automatiquement fixée à 30 jours après la date de facture
- Le numéro de facture est généré automatiquement au format : `FACT-YYYYMM001`

## Conseils pour le Frontend

1. **Authentification**
   - Stockez le token JWT dans le localStorage
   - Ajoutez-le dans les headers de chaque requête
   - Gérez la déconnexion en supprimant le token

2. **Gestion des factures**
   - Affichez la liste avec pagination côté client
   - Utilisez des filtres par statut
   - Implémentez un système de recherche

3. **Interface de création/édition**
   - Formulaire en plusieurs étapes
   - Validation en temps réel
   - Aperçu du total en direct

4. **Tableau de bord**
   - Statistiques par statut
   - Graphiques de montants
   - Alertes pour les factures en retard 