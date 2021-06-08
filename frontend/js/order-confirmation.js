import { updateCartProductsNumber } from "./helpers/helpers.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const orderId = urlParams.get("orderId");
const customerName = urlParams.get("firstName");
const totalPrice = urlParams.get("totalPrice");

document.getElementById("customerName").textContent = customerName;
document.getElementById("orderNumber").textContent = orderId;
document.getElementById("totalPrice").textContent = totalPrice / 100 + "€";

updateCartProductsNumber();
