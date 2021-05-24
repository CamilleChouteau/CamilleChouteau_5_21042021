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

export const addProductToCart = (product) => {
    // On appelle la fonction getCart qui est dans le fichier cart.js dans le dossier helpers
    const cart = getCart();
    const savedProduct = {
        id: product._id,
        varnish: productVarnish.value,
    };
    // On ajoute au tableau (stocké dans la variable cart et qui représente la panier) l'id du produit que le client souhaite ajouter à son panier
    cart.push(savedProduct);
    // On appelle la fonction saveCart qui est dans le fichier cart.js dans le dossier helpers
    // On donne en argument cart pour pouvoir enregistrer le panier
    saveCart(cart);
};

export const removeProductFromCart = (savedProduct) => {
    const cart = getCart();
    let index = -1;
    for (let i = 0; i < cart.length; i++) {
        const product = cart[i];
        if (
            product.id === savedProduct.id &&
            product.varnish === savedProduct.varnish
        ) {
            index = i;
            break;
        }
    }
    if (index === -1) {
        console.error("Product isn't in the cart");
        return;
    }
    cart.splice(index, 1);
    saveCart(cart);
};

export const emptyCart = () => {
    saveCart([]);
};
