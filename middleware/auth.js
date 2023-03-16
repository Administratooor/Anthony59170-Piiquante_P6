// Import du module JWT
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // On essaie de récupérer le token à partir de l'entête "authorization"
  try {
    // Le token est ensuite extrait du format "Bearer <token>" en divisant la chaîne de l'en-tête avec l'espace (' ').
    const token = req.headers.authorization.split(' ')[1];
    // On utilise la méthode jwt.verify() pour décoder le token d'authentification
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    // On extrait l'id de l'utilisateur depuis le token décodé
    const userId = decodedToken.userId;
    // On l'ajoute à la propriété "auth" de l'objet de requête (req.auth.userId).
    req.auth = { userId };
    // Si l'id de l'utilisateur dans le est différent de celui du token décodé, on invalide l'utilisateur
    if (req.body.userId && req.body.userId !== userId) {
      throw 'User non valide ';
      // Si les vérification de la condition sont réussi on continu
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({
      error: error | 'Requête non valide !',
    });
  }
};
