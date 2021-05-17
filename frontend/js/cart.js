import { updateCartProductsNumber } from "./helpers/helpers.js";
import { getCart, saveCart } from "./helpers/cart.js";
import { findProduct } from "./helpers/product.js";

const cart = getCart();
for (const savedProduct of cart) {
    findProduct(savedProduct.id).then((product) => {
        const originalProduct = document.getElementById("product-template");
        const clonedProduct = document.importNode(
            originalProduct.content,
            true
        );

        const productImage = clonedProduct.getElementById("productImage");
        const productName = clonedProduct.getElementById("productName");
        const productVarnish = clonedProduct.getElementById("productVarnish");
        const productPrice = clonedProduct.getElementById("productPrice");

        productImage.setAttribute("src", product.imageUrl);
        productName.textContent = product.name;
        productVarnish.textContent = savedProduct.varnish;
        productPrice.textContent = product.price / 100 + "€";

        const tableProducts = document.getElementById("tableProducts");
        tableProducts.appendChild(clonedProduct);
    });
}

updateCartProductsNumber();
