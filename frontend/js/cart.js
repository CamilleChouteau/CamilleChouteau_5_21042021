import { updateCartProductsNumber } from "./helpers/helpers.js";
import { emptyCart, getCart, removeProductFromCart } from "./helpers/cart.js";
import { findProduct, order } from "./helpers/product.js";
import {
    validateAddress,
    validateEmail,
    validatePostalCode,
    validateRegularName,
} from "./helpers/forms.js";

// On la déclare ici pour qu'elle soit accessible à toutes les fonctions
let totalPrice = 0;

// La fonction met à jour le prix total sur la page
const updateTotalPrice = async () => {
    const cart = getCart();
    // On la remet à 0 parce qu'on va la recalculer, donc il faut partir de zéro
    totalPrice = 0;

    // Pour chaque produit dans le panier
    for (const savedProduct of cart) {
        // On récupère le produit sur le backend pour avoir tout ses infos
        // (dans le panier on n'a enregistré que l'id et le vernis donc on doit
        // récupérer le reste sur le backend)
        const product = await findProduct(savedProduct.id);
        // On ajoute le prix du produit au prix total
        totalPrice += product.price;
    }

    // On met à jour le prix total sur la page
    const totalPriceDiv = document.getElementById("totalPrice");
    totalPriceDiv.textContent = totalPrice / 100 + "€";
};

// La fonction remplit la page avec les produits du panier
const fillCartSummary = async () => {
    const cart = getCart();

    // On parcourt les produits dans le panier
    for (const savedProduct of cart) {
        // On récupère les infos du produit sur le backend
        const product = await findProduct(savedProduct.id);
        // On clone le template
        const originalProduct = document.getElementById("product-template");
        const clonedProduct = document.importNode(
            originalProduct.content,
            true
        );

        // On récupère et on remplit les éléments du clone avec les bonnes infos
        const productContainer =
            clonedProduct.getElementById("productContainer");
        const productImage = clonedProduct.getElementById("productImage");
        const productName = clonedProduct.getElementById("productName");
        const productVarnish = clonedProduct.getElementById("productVarnish");
        const productPrice = clonedProduct.getElementById("productPrice");
        const productDeleteButton = clonedProduct.getElementById(
            "productDeleteButton"
        );

        productImage.setAttribute("src", product.imageUrl);
        productName.textContent = product.name;
        productVarnish.textContent = savedProduct.varnish;
        productPrice.textContent = product.price / 100 + "€";

        // On ajoute le clone à la page
        const tableProducts = document.getElementById("tableProducts");
        tableProducts.appendChild(clonedProduct);

        // On paramètre la réaction du bouton supprimer du produit
        productDeleteButton.addEventListener("click", () => {
            // On enlève le produit du panier
            removeProductFromCart(savedProduct);
            // Ensuite on enlève le produit de la page
            tableProducts.removeChild(productContainer);
            // On met à jour le nombre de produit de l'icone panier
            updateCartProductsNumber();
            // On met à jour le prix total
            updateTotalPrice();
        });
    }
};

// Cette fonction sert à préparer le bouton pour vider le panier
const setupClearCartButton = () => {
    // On récupère le bouton
    const clearCartButton = document.getElementById("clearCartButton");
    // On paramètre sa réaction quand on clique
    clearCartButton.addEventListener("click", () => {
        // On vide le panier
        emptyCart();
        // On vide la page des produits en remplaçant le html de la div qui les contient par du vide
        const tableProducts = document.getElementById("tableProducts");
        tableProducts.innerHTML = "";
        // On met à jour le nombre de l'icone panier + prix total
        updateCartProductsNumber();
        updateTotalPrice();
    });
};

// Permet de mettre en place un validateur (texte en rouge + bordure rouge si pas valide)
// sur un champs de formulaire
// inputId = id de la balise input sur laquelle mettre le validateur
// invalidTextId = id du texte en rouge à faire apparaitre quand c'est invalide
// validator = une fonction qui prend un texte en argument et renvoie true si le
//             texte est valise et false si le texte est invalide
const setupFieldValidator = (inputId, invalidTextId, validator) => {
    // On récupère l'input et le texte invalide sur la page
    const input = document.getElementById(inputId);
    const invalidText = document.getElementById(invalidTextId);
    // On paramètre une réaction de l'input quand le focus n'est plus sur lui
    input.addEventListener("focusout", () => {
        // On vérifie si le texte dans l'input est valide
        const isValid = validator(input.value);
        if (isValid) {
            // On cache le texte invalide puisque c'est valide
            invalidText.style.display = "none";
            // On enlève la classe "invalid-input" de l'input
            // qui permettait de mettre une bordure rouge
            input.classList.remove("invalid-input");
        } else {
            // On montre le texte invalide puisque c'est invalide
            invalidText.style.display = "block";
            // On fait apparaitre la bordure rouge
            input.classList.add("invalid-input");
        }
    });
};

// Met en place des validateurs sur tous les champs de la page
const setupFormValidator = () => {
    // Ici pour faire valider avec la fonction validateRegularName, on indique
    // simplement le nom de la fonction sans les parenthèses et sans les arguments
    // On la traite comme une variable
    setupFieldValidator("lastname", "lastNameInvalid", validateRegularName);
    setupFieldValidator("firstname", "firstNameInvalid", validateRegularName);
    setupFieldValidator("email", "emailInvalid", validateEmail);
    setupFieldValidator("address", "addressInvalid", validateAddress);
    setupFieldValidator("postalCode", "postalCodeInvalid", validatePostalCode);
    setupFieldValidator("city", "cityInvalid", validateRegularName);
};

//
const setupOrderButton = () => {
    const lastNameInput = document.getElementById("lastname");
    const firstNameInput = document.getElementById("firstname");
    const emailInput = document.getElementById("email");
    const addressInput = document.getElementById("address");
    const postalCodeInput = document.getElementById("postalCode");
    const cityInput = document.getElementById("city");
    const orderButton = document.getElementById("orderButton");

    orderButton.addEventListener("click", async () => {
        const cart = getCart();
        if (cart.length === 0) {
            alert("Your cart is empty");
            return;
        }
        if (
            validateRegularName(lastNameInput.value) === false ||
            validateRegularName(firstNameInput.value) === false ||
            validateEmail(emailInput.value) === false ||
            validateAddress(addressInput.value) === false ||
            validatePostalCode(postalCodeInput.value) === false ||
            validateRegularName(cityInput.value) === false
        ) {
            alert("Please fill the contact informations");
            return;
        }
        const contact = {
            firstName: firstNameInput.value,
            lastName: lastNameInput.value,
            email: emailInput.value,
            address: addressInput.value,
            city: cityInput.value,
        };

        const productsIds = [];
        for (const savedProduct of cart) {
            productsIds.push(savedProduct.id);
        }

        const orderId = await order(contact, productsIds);
        emptyCart();
        window.location.href =
            "order_confirmation.html?orderId=" +
            orderId +
            "&firstName=" +
            contact.firstName +
            "&totalPrice=" +
            totalPrice;
    });
};

fillCartSummary();
updateTotalPrice();
setupClearCartButton();
setupFormValidator();
setupOrderButton();
updateCartProductsNumber();
