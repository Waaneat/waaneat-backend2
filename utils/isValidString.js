function isValidString(inputString) {
    // Vérifier si la chaîne n'est pas nulle et non vide
    if (inputString == null || inputString.trim() === '') {
        return false;
    }

    // Utiliser une expression régulière pour vérifier si la chaîne contient uniquement des caractères alphanumériques
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    return alphanumericRegex.test(inputString);
}

module.exports = isValidString;