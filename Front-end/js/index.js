main();

function main() {
    fetch("http://localhost:3000/api/furniture")
        .then(function (httpBodyResponse) {
            return httpBodyResponse.json();
        })
        .then(function (response) {
            displayProducts(response);
        });
}

function displayProducts(products) {
    for (let product of products) {
        displayProduct(product);
    }
}

function displayProduct(product) {
    const originalProduct = document.getElementById("product-template");
    const clonedProduct = document.importNode(originalProduct.content, true);
    const name = clonedProduct.querySelector("p");
    name.innerHTML = product.name;
    const image = clonedProduct.querySelector("img");
    image.setAttribute("src", product.imageUrl);

    const productsList = document.getElementById("products-list");
    productsList.appendChild(clonedProduct);
}
