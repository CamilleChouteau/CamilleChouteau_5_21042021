export const updateCartProductsNumber = () => {
    let cart = JSON.parse(localStorage.getItem("cart"));
    const numberOfProducts = cart === null ? 0 : cart.length;

    const numbers = document.getElementsByClassName("cart-number");
    for (const number of numbers) {
        number.textContent = numberOfProducts;
    }
};
