// On exécute la fonction getAndPopulateProducts au chargement de la page
getAndPopulateProducts();

function getAndPopulateProducts() {
    // Fetch envoie une requête de type GET (par défaut) au back-end qui nous répond la listes des produits
    fetch("http://localhost:3000/api/furniture")
        // Fetch renvoie une promesse, on demande à cette promesse de donner la valeur qu'elle nous a promit avec la fonction .then (une réponse du back-end)
        // Comme la promesse va mettre un certain temps (indéterminé) à répondre à notre demande (puisqu'elle est asynchrone),
        // On doit lui donner un moyen de nous communiquer la valeur promise
        // Pour cela on lui donne une fonction. Cette fonction prend un argument qui sera ce que va lui donner la promesse (la valeur attendue)
        // Et la promesse appelera cette fonction quand elle aura le résultat,
        // En lui donnant le résultat qui sera stocké en argument httpResponse

        .then(function (httpResponse) {
            return httpResponse.json();
        })
        .then(function (response) {
            displayProducts(response);
        })
        .catch(function (error) {
            console.error(error);
        });
}

// Prend en argument  un tableau qui contient des produits
function displayProducts(products) {
    for (let product of products) {
        displayProduct(product);
    }
}

// Prend en argument un produit (objet javascript)
function displayProduct(product) {
    //If vérifie que l'argument product a le bon type (c'est à dire qu'il a une propriété name et imageUrl)
    if (product.name === undefined || product.imageUrl === undefined) {
        throw Error(
            "Product n'est pas au bon type :" + JSON.stringify(product)
        );
    }

    // Permet de :

    // 1) Trouver et cloner le template
    const originalProduct = document.getElementById("product-template");
    const clonedProduct = document.importNode(originalProduct.content, true);

    // 2) Remplir ce clone avec les bonnes valeurs récupérer dans le produit (nom et url d'image)
    const name = clonedProduct.querySelector("p");
    name.innerHTML = product.name;
    const image = clonedProduct.querySelector("img");
    image.setAttribute("src", product.imageUrl);

    // 3) Trouver la liste de produits (dans la page HTML) et y insérer le clone pour qu'on le voit
    const productsList = document.getElementById("products-list");
    productsList.appendChild(clonedProduct);
}
