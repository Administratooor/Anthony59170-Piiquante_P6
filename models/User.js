const mongoose = require('mongoose');
// import module mongoose
const uniqueValidator = require('mongoose-unique-validator');

// Déclaration du userShema pour modélisation d'objet 
const userSchema = mongoose.Schema({
  // On s'assure que l'e-mail est unique avec le module uniqueValidator 
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

/* On s'assure que les champs du userSchema soit unique en appliquant le plugin "uniqueValidator",
cela nous garanti qu'il n'y aura pas de doublons d'un user*/
userSchema.plugin(uniqueValidator);

// On exporte le module en créant un modèle à partir de notre shéma , le 1er argument est le nom du modèle lui-même
module.exports = mongoose.model('User', userSchema);
