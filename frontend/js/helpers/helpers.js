import { getCart } from "./cart.js";

export const updateCartProductsNumber = () => {
    let cart = getCart();
    const numberOfProducts = cart.length;

    const numbers = document.getElementsByClassName("cart-number");
    for (const number of numbers) {
        number.textContent = numberOfProducts;
    }
};
