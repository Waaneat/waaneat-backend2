const generateNOrder = (longueur)=>{
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let chaineAleatoire = '';
                  
    for (let i = 0; i < longueur; i++) {
        const index = Math.floor(Math.random() * caracteres.length);
        chaineAleatoire += caracteres.charAt(index);
    }
                  
    return chaineAleatoire;
}

module.exports = generateNOrder;