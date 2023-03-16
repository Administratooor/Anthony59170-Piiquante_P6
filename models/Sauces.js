const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Shéma de donné des sauces
const saucesSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  heat: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  /* On applique la valeur par défaut "0" au likes/dislikes, 
  cela représente le nombre de likes/dislikes initiaux */
  likes: { default: 0, type: Number, required: true },
  dislikes: { default: 0, type: Number, required: true },
  usersLiked: { type: [], required: true },
  usersDisliked: { type: [], required: true },
});

/* On s'assure que les champs du sauceShema soit unique en appliquant le plugin "uniqueValidator",
cela nous garanti qu'il n'y aura pas de doublons d'une sauce*/
saucesSchema.plugin(uniqueValidator);

// On exporte le module en créant un modèle à partir de notre shéma , le 1er argument est le nom du modèle lui-même
module.exports = mongoose.model('Sauces', saucesSchema);
