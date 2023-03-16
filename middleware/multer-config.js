// Import du module multer pour la gestion des fichiers
const multer = require('multer');

// déclaration des types d'extension accéptés
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

// indiquer à multer où enregistrer les fichiers entrants :
const storage = multer.diskStorage({
  //indiquer à multer où enregistrer les fichiers entrants :
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  // utiliser le nom d'origine des fichiers
  filename: (req, file, callback) => {
    // remplacer les espaces par des underscores
    const name = file.originalname.split(' ').join('_');
    // utilise ensuite la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée.
    const extension = MIME_TYPES[file.mimetype];
    // ajouter un timestamp Date.now()
    callback(null, name + Date.now() + '.' + extension);
  },
});

// Nous gérerons uniquement les téléchargements de fichiers image.
module.exports = multer({ storage: storage }).single('image');
