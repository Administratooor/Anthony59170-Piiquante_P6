const express = require('express');

// Utilisation de la méthode "Router" d'express
const router = express.Router();

// Chargement du module d'authentification
const auth = require('../middleware/auth');

// Chargement du module multer
const multer = require('../middleware/multer-config');

// Chargement du module controllers
const saucesCtrl = require('../controllers/sauces');

/*--- Paramétrage des routes à la racine, multer pour gérer les fichiers
et auth pour gérer la sécurité des accés --- */
router.post('/', auth, multer, saucesCtrl.createSauces);
router.post('/:id/like', auth, saucesCtrl.likeSauces);
router.put('/:id', auth, multer, saucesCtrl.modifySauces);
router.delete('/:id', auth, multer, saucesCtrl.deleteSauces);
router.get('/', auth, saucesCtrl.getAllSauces);
router.get('/:id', auth, saucesCtrl.getOneSauces);

module.exports = router;
