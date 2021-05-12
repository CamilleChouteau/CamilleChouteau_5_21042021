import { updateCartProductsNumber } from "./helpers/helpers.js";

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
    fetch("http://localhost:3000/api/furniture/" + productId)
        .then((httpResponse) => {
            return httpResponse.json();
        })

        .then((response) => {
            displayProduct(response);
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
        // On ajoute au tableau (stocké dans la variable cart et qui représente la panier) l'id du produit que le client souhaite ajouter à son panier
        cart.push(product._id);
        // On veut maintenant écraser le tableau précédemment stocké à la clé cart dans localStorage par sa version mise à jour (donc avec le produits en plus)
        // Donc on utilise JSON.strigify pour reconvertir le tableau au format JSON et c'est ce que l'on stocke dans localStorage
        localStorage.setItem("cart", JSON.stringify(cart));
        // On appelle la fonction qui change le numéro de produits qu'il y a dans le panier sur l'icone panier
        updateCartProductsNumber();
        // Redirige vers le panier quand un article est ajouté
        window.location.href = "cart.html";
    });
};

// On exécute la fonction getAndPopulateProduct au chargement de la page
getAndPopulateProduct();
updateCartProductsNumber();
