export const getCart = () => {
    // Avec localstorage.getItem("cart") on récupère la valeur qui a été stockée dans le localStorage à la clé cart
    // On veut stocker un tableau qui va contenir tous les produits ajoutés au panier dans cette clé (on utilise un tableau pour éviter d'écraser le produit précédent avec le nouveau produit)
    // Le souci est que localStorage ne stocke que des valeurs en string (donc pas de tableau pas d'objet).
    // Pour compenser ça, on va stocker le tableau en format JSON (format qui permet de représenter des objets JS sous forme de texte, c'est comme ça que le backend nous envoie ses données)
    // Comme il est stocké au format JSON, il faut le convertir en tableau pour le manipuler ; Ce qu'on fait avec JSON.parse qui prend en argument du texte en format JSON
    let cart = JSON.parse(localStorage.getItem("cart"));
    // Si jamais c'est la première visite de l'utilisateur, aucun tableau n'était stocké à la clé cart = localStorage était vide et donc cart vaut null.
    // Dans ce cas particulier, on crée un nouveau tableau vide
    if (cart === null) {
        cart = [];
    }
    return cart;
};

export const saveCart = (cart) => {
    // On veut maintenant écraser le tableau précédemment stocké à la clé cart dans localStorage par sa version mise à jour (donc avec le produits en plus)
    // Donc on utilise JSON.strigify pour reconvertir le tableau au format JSON et c'est ce que l'on stocke dans localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
};
