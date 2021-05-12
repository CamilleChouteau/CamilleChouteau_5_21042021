import { updateCartProductsNumber } from "./helpers/helpers.js";

const getAndPopulateProduct = () => {
    fetch("http://localhost:3000/api/furniture");
};

updateCartProductsNumber();
