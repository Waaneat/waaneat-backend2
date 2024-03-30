// Fonction pour supprimer les espaces superflus d'une chaîne
function removeExtraSpaces(inputString) {
    // Utiliser une expression régulière pour remplacer les espaces multiples par un seul espace
    return inputString.replace(/\s+/g, ' ').trim();
}

// Vérifie si la chaîne est un Gmail valide
function isValidGmail(email) {
    // Utiliser une expression régulière pour valider l'adresse Gmail
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
}

// Vérifie si la chaîne est un nom d'utilisateur valide
function isValidUsername(username) {
    // Utiliser une expression régulière pour valider le nom d'utilisateur
    // Vous pouvez ajuster cette expression régulière en fonction de vos critères spécifiques
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    return usernameRegex.test(username);
}

// Vérifie si la chaîne est un identifiant valide (Gmail ou nom d'utilisateur)
function isValidIdentifier(identifier) {
    // Supprimer les espaces superflus
    const cleanedIdentifier = removeExtraSpaces(identifier);

    // Vérifier si l'identifiant est une adresse Gmail valide
    if (isValidGmail(cleanedIdentifier)) {
        return true;
    }

    // Vérifier si l'identifiant est un nom d'utilisateur valide
    if (isValidUsername(cleanedIdentifier)) {
        return true;
    }

    // Si ni Gmail ni nom d'utilisateur ne correspondent, retourner false
    return false;
}

module.exports = {
    isValidGmail,
    isValidUsername,
    isValidIdentifier
};
