const Sauce = require('../models/Sauces');
// Importation du module fs pour accéder au fichier du serveur
const fs = require('fs');

exports.createSauces = (req, res, next) => {
  // Déclaration d'un objet avec extraction des propriétés du corp de la requête
  const sauceObject = JSON.parse(req.body.sauce);
  // On laisse mongoDB gerer l'id en supr l'_id du corp de la requête
  delete sauceObject._id;
  // Déclaration de l'objet à envoyer à la BDD en utilisant le modéle 'Sauce'
  const sauce = new Sauce({
    //On utilise l'opérateur spread pour copier toutes les propriétés de "sauceObject" dans l'objet "sauce"
    ...sauceObject,
    /* On ajoute la propriété imageUrl en combinant le protocole de la requête HTTP, 
    le nom de l'hôte et le nom de fichier du fichier téléchargé */
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
  });
  /* On enregistre avec la méthode "save" l'objet sauce crée à partir du modéle de donné 'Sauce' ausquel on ajoute l'url de l'image,
  l'image est interceptée depuis le app.js est stockée dans le serveur*/
  sauce
    .save()
    .then(() => {
      res.status(201).json({
        message: 'Produit enregistré avec succés ! ',
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });
};

/* ------------------ Modification Sauce  ------------------*/
exports.modifySauces = (req, res, next) => {
  /* Récupération de la sauce existante depuis la base de 
  données dans la collection Sauce avec la méthode findOne*/
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // On crée un objet en vérifiant si la requête comporte un fichier
      const sauceObject = req.file
        ? {
            // Si c'est la cas ont étend la propriété de l'objet pour récupérer les autres valeurs
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${
              req.file.filename
            }`,
          }
        : // Si la requête ne comporte pas de fichier, ont étend les propriétés de l'objet
          { ...req.body };
      // Si une nouvelle image est fournie, supprimer l'ancienne image du disque
      if (req.file && sauce.imageUrl) {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {});
      }
      // On utilise la méthode mongoDB pour mettre à jour la sauce correspondante dans la collection
      Sauce.updateOne(
        // On recherche l'élément à mettre à jour
        { _id: req.params.id },
        /*On utilise l'opérateur spread (...) pour étendre les propriétés de l'objet "sauceObject" 
        (qui contient les nouvelles valeurs à mettre à jour)
        et on ajoute également l'_id du document comme propriété 
        (pour éviter de créer un nouveau document avec un nouvel _id).*/
        { ...sauceObject, _id: req.params.id }
      )
        .then(() =>
          res.status(201).json({ message: 'Sauce modifiée avec succès !' })
        )
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

/* ------------------ Supréssion Sauce  ------------------*/
exports.deleteSauces = (req, res, next) => {
  // Recherche de la sauce dans la BDD (collection Sauce)
  Sauce.findOne({ _id: req.params.id })
    // Promess asynchrone pour suppression de l'image dans le serveur
    .then((sauce) => {
      // Déclaration du nom de la ressource en isolant ce qui se trouve après /images/ avec split [1]
      const filename = sauce.imageUrl.split('/images/')[1];
      //Utilisation de la méthode unlink (supr) de fs qui va delete la sauce identifié
      fs.unlink(`images/${filename}`, () => {
        // On delete la Sauce de la BDD
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

/* ------------------ Récupération d'une Sauce (page unique)  ------------------*/
exports.getOneSauces = (req, res, next) => {
  // Sélection de la sauce comportant le même Id que "req.params.id"
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  // Sélection de toutes les sauces
  Sauce.find()
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
};

// export du controllers de requête "likeSauces"
exports.likeSauces = (req, res, next) => {
  // Récupération du paramétre URL ':id'
  const sauceId = req.params.id;
  // Récupération dans le corp de la réquête le userId
  const userId = req.body.userId;
  // Récupération dans le corp de la réquête de la valeur du like
  const like = req.body.like;
  // Recherche d'un élément (dynamiquement) grâce à l'argument "sauceId"
  Sauce.findById(sauceId)
    // Pour permettre de traiter les demandes de "like/dislikes" de manière asynchrone (prommess)
    .then((sauce) => {
      // Vérifier si l'utilisateur a déjà aimé ou pas aimé cette sauce
      const likedBefore = sauce.usersLiked.includes(userId);
      const dislikedBefore = sauce.usersDisliked.includes(userId);

      // Mise à jour du statut "Like"
      switch (like) {
        case 1:
          // Valeur de req.body.like : 1
          if (!likedBefore) {
            // Si l'utilisateur n'a pas aimé la sauce auparavant, ajouter son ID au tableau usersLiked
            sauce.usersLiked.push(userId);
            // Puis incrémenter de 1 les "likes" du produit
            sauce.likes++;
          } else {
            // Si l'utilisateur a déjà aimé la sauce, ne rien faire
          }
          if (dislikedBefore) {
            // Si l'utilisateur a précédemment disliké la sauce, retirer son ID du tableau usersDisliked
            sauce.usersDisliked.pull(userId);
            // Puis décrémenter les 'dislikes'
            sauce.dislikes--;
          }
          // Sortie de la boucle
          break;
        case 0:
          // Valeur de req.body.like : 0
          if (likedBefore) {
            // Si l'utilisateur a aimé la sauce auparavant, retirer son ID du tableau usersLiked
            sauce.usersLiked.pull(userId);
            // Puis décrémenter les 'likes'
            sauce.likes--;
          }
          if (dislikedBefore) {
            // Si l'utilisateur a disliké la sauce auparavant, retirer son ID du tableau usersDisliked
            sauce.usersDisliked.pull(userId);
            sauce.dislikes--;
          }
          break;
        case -1:
          // Valeur de req.body.like : -1
          if (!dislikedBefore) {
            // Si l'utilisateur n'a pas disliké la sauce auparavant, ajouter son ID au tableau usersDisliked
            sauce.usersDisliked.push(userId);
            sauce.dislikes++;
          } else {
            // Si l'utilisateur a déjà disliké la sauce, ne rien faire
          }
          if (likedBefore) {
            // Si l'utilisateur a précédemment aimé la sauce, retirer son ID du tableau usersLiked
            sauce.usersLiked.pull(userId);
            sauce.likes--;
          }
          break;
        default:
          return res.status(400).json({ error: "Valeur 'like' invalide." });
      }

      // Mise à jour du nombre total de "Like" et "Dislike" dans la BDD
      sauce
        .save()
        .then(() => {
          res.status(200).json({
            message: 'Le statut de la sauce a été mis à jour avec succès.',
          });
        })
        .catch((error) => {
          res.status(500).json({ error });
        });
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};
