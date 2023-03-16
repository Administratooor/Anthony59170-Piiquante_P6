//import express
const express = require('express');
// import module mongoose
const mongoose = require('mongoose');

/*  La méthode configure automatiquement les variables d'environnement 
enregistrées dans le fichier .env et les rend disponibles 
pour l'application tout en les sécurisant  */
require('dotenv').config();

// Chargement des modules (fonction "require" JS )
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');

//initialisation application Express.
const app = express();

/*------------------------MONGODB-----------------------------*/
/* Lorsque le mode "strictQuery" est activé, Mongoose vérifie les requêtes de recherche 
MongoDB pour s'assurer qu'elles ne contiennent pas de clés de requête invalides ou inconnues.*/
mongoose.set('strictQuery', true);

// Liaison avec la BDD en utilisant la méthode mongoose "connect"
mongoose
  .connect(process.env.DB_ACCESS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  // Prommess de connection à la BDD
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Parse des données envoyées/Interceptés dans les requêtes HTTP au format JSON
app.use(express.json());
// Définition d"un dossier statique pour stocker les images
app.use('/images', express.static('images'));

/*Le client est autorisé à accéder à l'API depuis n'importe quelle origine,
 avec les en-têtes spécifiés et les méthodes HTTP autorisées. */
app.use((req, res, next) => {
  // accés à notre API de n'importe quelle origines
  res.setHeader('Access-Control-Allow-Origin', '*');
  // ajouter les headers mentionnés aux requêtes envoyées vers notre API
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  //  envoyer des requêtes avec les méthodes mentionnées
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

// Middleware pour cibler les requêtes et pointer les différentes routes
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

// Export du fichier
module.exports = app;
