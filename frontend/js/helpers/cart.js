export const getCart = () => {
    // Avec localstorage.getItem("cart") on récupère la valeur qui a été stockée dans le localStorage à la clé cart

    // On veut stocker un tableau qui va contenir tous les produits ajoutés au panier dans cette clé
    // (on utilise un tableau pour éviter d'écraser le produit précédent avec le nouveau produit)

    // Le souci est que localStorage ne stocke que des valeurs en string (donc pas de tableau pas d'objet).

    // Pour compenser ça, on va stocker le tableau en format JSON (format qui permet de représenter des objets JS
    //sous forme de texte, c'est comme ça que le backend nous envoie ses données)

    // Comme il est stocké au format JSON, il faut le convertir en tableau pour le manipuler ;

    // Ce qu'on fait avec JSON.parse qui prend en argument du texte en format JSON
    let cart = JSON.parse(localStorage.getItem("cart"));
    // Si jamais c'est la première visite de l'utilisateur, aucun tableau n'était stocké à la
    // clé cart = localStorage était vide et donc cart vaut null.

    // Dans ce cas particulier, on crée un nouveau tableau vide
    if (cart === null) {
        cart = [];
    }
    return cart;
};

export const saveCart = (cart) => {
    // On veut maintenant écraser le tableau précédemment stocké à la clé cart
    // dans localStorage par sa version mise à jour (donc avec le produits en plus)

    // Donc on utilise JSON.strigify pour reconvertir le tableau au format JSON
    // et c'est ce que l'on stocke dans localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
};

export const addProductToCart = (product) => {
    // On appelle la fonction getCart qui est dans le fichier cart.js dans le
    // dossier helpers
    const cart = getCart();
    const savedProduct = {
        id: product._id,
        varnish: productVarnish.value,
    };
    // On ajoute au tableau (stocké dans la variable cart et qui représente la panier)
    // l'id du produit que le client souhaite ajouter à son panier
    cart.push(savedProduct);
    // On appelle la fonction saveCart qui est dans le fichier cart.js dans le dossier helpers

    // On donne en argument cart pour pouvoir enregistrer le panier
    saveCart(cart);
};

export const removeProductFromCart = (savedProduct) => {
    // on appelle la fonction getCart pour récupérer le panier
    const cart = getCart();
    // On cherche l'index (l'index c'est sa position dans le tableau - tableau qui représente le panier) du produit à supprimer dans le panier
    // On a besoin de cet index pour savoir quel case enlever du tableau
    const index = findProductIndexInCart(cart);
    // Si l'index retourné est -1, ça veut dire que le produit n'est même pas dans le panier, donc on s'arrête
    if (index === -1) {
        console.error("Product isn't in the cart");
        return;
    }
    // Splice(index,1) permet de supprimer 1 case du tableau cart à partir de la case d'index "index"
    // Donc ça supprime la case à la position index qui est la case qui contient le produit qu'on veut enlever
    cart.splice(index, 1);
    saveCart(cart);
};

const findProductIndexInCart = (cart) => {
    // On initialise l'index à -1, qui est la valeur qui signifie qu'on a pas (encore) trouvé l'index du produit qu'on cherche
    let index = -1;
    // On parcourt le tableau avec une boucle for traditionnelle (plutôt qu'un forof) car on a besoin de tout le temps savoir
    // à quelle position dans le tableau on en est (représenté par la variable i qui va de 0 à la taille du tableau = -1)
    for (let i = 0; i < cart.length; i++) {
        // On récupère le roduit dans le panier qui correspond à l'index/case i
        const product = cart[i];
        // On vérifie si le produit qu'on vient de prendre dans le tableau (panier) correspond à celui qu'on cherche
        if (
            product.id === savedProduct.id &&
            product.varnish === savedProduct.varnish
        ) {
            // On arrive ici quand la condition est vraie et qu'on a trouvé le produit qu'on veut supprimer
            // On enregistre le numéro de la case où on est dans l'index (car ce numéro correspond à l'index du produit qu'on cherche à supprimer)
            index = i;
            // On sort de la boucle instantanément avec break
            break;
        }
    }
    // Quand on arrive à ce moment de la fonction, index vaut soit -1 si on a jamais trouvé le produit dans le panier
    // Soit index contient l'index du produit qu'on cherchait
    return index;
};

export const emptyCart = () => {
    saveCart([]);
};
