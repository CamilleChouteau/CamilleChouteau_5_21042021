import { updateCartProductsNumber } from "./helpers/helpers.js";
import { emptyCart, getCart, removeProductFromCart } from "./helpers/cart.js";
import { findProduct, order } from "./helpers/product.js";
import {
    validateAddress,
    validateEmail,
    validatePostalCode,
    validateRegularName,
} from "./helpers/forms.js";

let totalPrice = 0;

const updateTotalPrice = async () => {
    const cart = getCart();
    totalPrice = 0;

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

const setupFieldValidator = (inputId, invalidTextId, validator) => {
    const input = document.getElementById(inputId);
    const invalidText = document.getElementById(invalidTextId);
    input.addEventListener("focusout", () => {
        const isValid = validator(input.value);
        if (isValid) {
            invalidText.style.display = "none";
            input.classList.remove("invalid-input");
        } else {
            invalidText.style.display = "block";
            input.classList.add("invalid-input");
        }
    });
};

const setupFormValidator = () => {
    setupFieldValidator("lastname", "lastNameInvalid", validateRegularName);
    setupFieldValidator("firstname", "firstNameInvalid", validateRegularName);
    setupFieldValidator("email", "emailInvalid", validateEmail);
    setupFieldValidator("address", "addressInvalid", validateAddress);
    setupFieldValidator("postalCode", "postalCodeInvalid", validatePostalCode);
    setupFieldValidator("city", "cityInvalid", validateRegularName);
};

const setupOrderButton = () => {
    const lastNameInput = document.getElementById("lastname");
    const firstNameInput = document.getElementById("firstname");
    const emailInput = document.getElementById("email");
    const addressInput = document.getElementById("address");
    const postalCodeInput = document.getElementById("postalCode");
    const cityInput = document.getElementById("city");
    const orderButton = document.getElementById("orderButton");

    orderButton.addEventListener("click", async () => {
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

        const cart = getCart();
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
