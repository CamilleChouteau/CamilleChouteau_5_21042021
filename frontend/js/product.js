import { updateCartProductsNumber } from "./helpers/helpers.js";
import { getCart, saveCart } from "./helpers/cart.js";
import { findProduct } from "./helpers/product.js";

const getAndPopulateProduct = () => {
    // Sur la page d'accueil, on a ajouté l'id à l'url de la page, on retrouve cet id qui a été ajouté à l'url grâce la chaine de requêtes
    // (Partie d'une URL qui transmet des données supplémentaires à une page de destination. Par exemple : ?p_id=42)
    const queryString = window.location.search;
    console.log(queryString);

    // On récupère l'id d'un produit (qui est dans la chaine de requêtes) grâce à la class URLSearchParams
    const urlParams = new URLSearchParams(queryString);
    const productId = urlParams.get("id");
    console.log(productId);

    // On a productId (variable constante) qui contient l'ID du produit qu'on doit afficher
    // On a l'id du produit (transmis depuis la page index), mais pas les autres infos
    // Pour les récupérer on doit les demander au backend avec un fetch
    // À la différence de la page index, on ne demande pas tous les produits mais un seul
    // On a une fonction utilitaire findProduct (dans helpers/product.js) qui fait ça pour nous
    // elle prend l'id du produit en argument, et (de façon asynchrone) nous renvoie le produit donné par le backend
    // comme c'est asynchrone (car elle contacte le backend), on doit utiliser then pour attendre son résultat (le produit)
    findProduct(productId).then((product) => {
        displayProduct(product);
    });

    // Ici la response est le produit (sous forme d'objet JavaScript)
};

// Le but de la fonction est de remplir la page avec les infos du produit
const displayProduct = (product) => {
    // On récupère tous les éléments qu'il va falloir remplir
    const productName = document.getElementById("productName");
    const productPrice = document.getElementById("productPrice");
    const productDescription = document.getElementById("productDescription");
    const productImage = document.getElementById("productImage");
    const productVarnish = document.getElementById("productVarnish");
    console.log(product);

    // On remplit tous les éléments
    productName.textContent = product.name;
    // Ici le prix est en centimes donc on doit effectuer une conversion, diviser par cent, pour avoir le prix final et on concatène pour ajouter le symbole € au prix
    productPrice.textContent = product.price / 100 + "€";
    productDescription.textContent = product.description;
    productImage.setAttribute("src", product.imageUrl);

    // Dans product on récupère le tableau varnish qui contient les vernis, et on le parcourt pour ajouter tous les vernis au select en HTML
    for (let varnish of product.varnish) {
        // On crée un nouvel élement option
        const productOptions = document.createElement("option");
        // On remplit son contenu avec le nom du vernis
        productOptions.textContent = varnish;
        // On remplit son attribut value avec le nom du vernis. Dans un formulaire c'est cet attribut qui est envoyé quand on envoie le formulaire
        productOptions.setAttribute("value", varnish);
        // On ajoute au select l'option remplie
        productVarnish.appendChild(productOptions);
    }

    // On veut configurer le comportement du bouton quand on ajoute au panier
    const button = document.getElementById("orderButton");
    // On définie ce qui va être effectuer quand on clique sur le bouton
    button.addEventListener("click", () => {
        const alertVarnish = document.getElementById("alert-varnish");
        if (productVarnish.value === "") {
            alertVarnish.style.display = "block";
            return;
        }
        alertVarnish.style.display = "none";
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
        // On appelle la fonction qui change le numéro de produits qu'il y a dans le panier sur l'icone panier
        updateCartProductsNumber();
        // Redirige vers le panier quand un article est ajouté
        window.location.href = "cart.html";
    });
};

// On exécute la fonction getAndPopulateProduct au chargement de la page
getAndPopulateProduct();
updateCartProductsNumber();
