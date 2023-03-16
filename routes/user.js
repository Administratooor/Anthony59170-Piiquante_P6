// Import du module express  pour accéder à toutes ces fonctionnalités 
const express = require('express');

// Utilisation de la méthode "Router" d'express
const router = express.Router();

// Chargement du module controller/user
const userCtrl = require('../controllers/user');

// Création des routers users 
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// Exports des routes 
module.exports = router;
