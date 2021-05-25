import { updateCartProductsNumber } from "./helpers/helpers.js";
import {
    emptyCart,
    getCart,
    removeProductFromCart,
    saveCart,
} from "./helpers/cart.js";
import { findProduct } from "./helpers/product.js";
import { validateEmail, validatePostalCode } from "./helpers/forms.js";

const updateTotalPrice = async () => {
    const cart = getCart();
    let totalPrice = 0;

    for (const savedProduct of cart) {
        const product = await findProduct(savedProduct.id);
        totalPrice += product.price;
    }

    const totalPriceDiv = document.getElementById("totalPrice");
    totalPriceDiv.textContent = totalPrice / 100 + "€";
};

const fillCartSummary = async () => {
    const cart = getCart();

    for (const savedProduct of cart) {
        const product = await findProduct(savedProduct.id);
        const originalProduct = document.getElementById("product-template");
        const clonedProduct = document.importNode(
            originalProduct.content,
            true
        );

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

        const tableProducts = document.getElementById("tableProducts");
        tableProducts.appendChild(clonedProduct);

        productDeleteButton.addEventListener("click", () => {
            removeProductFromCart(savedProduct);
            tableProducts.removeChild(productContainer);
            updateCartProductsNumber();
            updateTotalPrice();
        });
    }
};

const setupClearCartButton = () => {
    const clearCartButton = document.getElementById("clearCartButton");
    clearCartButton.addEventListener("click", () => {
        emptyCart();
        const tableProducts = document.getElementById("tableProducts");
        tableProducts.innerHTML = "";
        updateCartProductsNumber();
        updateTotalPrice();
    });
};

const setupFormValidator = () => {
    const emailInput = document.getElementById("email");
    const postalCodeInput = document.getElementById("postalCode");
    emailInput.addEventListener("focusout", () => {
        const isValid = validateEmail(emailInput.value);
        if (isValid) {
            console.log("Email valid");
        } else {
            console.log("Email invalid");
        }
    });
    postalCodeInput.addEventListener("focusout", () => {
        const isValid = validatePostalCode(postalCodeInput.value);
        if (isValid) {
            console.log("Postal code valid");
        } else {
            console.log("Postal code invalid");
        }
    });
};

fillCartSummary();
updateTotalPrice();
setupClearCartButton();
setupFormValidator();
updateCartProductsNumber();
