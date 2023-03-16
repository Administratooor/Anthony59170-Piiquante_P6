// Import du package bcrypt
const bcrypt = require('bcrypt');
// Import du package jsonwebtoken
const jwt = require('jsonwebtoken');
// déclaration du model user
const User = require('../models/User');

// on exporte le contrôleur d'inscription
exports.signup = (req, res, next) => {
  // on utilise la fonction de hachage pour le password du corp de la requête en moulinant 10 tours
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      // lorsque le hash est réalisé, ont crée un objet user
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      // on enregistre dans la BDD le user
      user
        .save()
        // on renvoi un code status(201) => ressource crée
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// on exporte le contrôleur d'identification
exports.login = (req, res, next) => {
  // on cherche à trouver un user (celui du corp de la requete)
  User.findOne({ email: req.body.email })
    .then((user) => {
      // si il est différent on renvoi une erreur (401): il manque des informations d'authentification valides
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      // on compare avec l'algorithme de hachage les password (saisie)et celui de la BDD
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          // si la réponse est invalide
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          // on renvoi un succé avec un id et un token signé avec la fonction jwt.sign
          res.status(200).json({
            // payload représente les données que vous souhaitez inclure dans le JWT
            userId: user._id,
            // 'RANDOM_TOKEN_SECRET' chaîne de caractères utilisée pour signer le JWT,
            token: jwt.sign({ userId: user._id }, 'RANDOM_TOKEN_SECRET', {
              expiresIn: '24h',
            }),
          });
        })
        /* Le code de réponse d'erreur serveur HTTP 500 Internal Server Error indique que le
         serveur a rencontré un problème inattendu qui l'empêche de répondre à la requête. */
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
