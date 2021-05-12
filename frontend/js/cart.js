import { updateCartProductsNumber } from "./helpers/helpers.js";
import { getCart, saveCart } from "./helpers/cart.js";

const cart = getCart();
for (const productId of cart) {
    console.log(productId);
}

const getAndPopulateProduct = () => {
    fetch("http://localhost:3000/api/furniture");
};

updateCartProductsNumber();
