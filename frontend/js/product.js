getAndPopulateProduct();

function getAndPopulateProduct() {
    const queryString = window.location.search;
    console.log(queryString);

    const urlParams = new URLSearchParams(queryString);
    const productId = urlParams.get("id");
    console.log(productId);

    // on a productId (variable constante) qui contient l'ID du produit qu'on doit afficher

    fetch("http://localhost:3000/api/furniture/" + productId)
        .then((httpResponse) => {
            return httpResponse.json();
        })
        .then((response) => {
            displayProduct(response);
        });
}

function displayProduct(product) {
    const productName = document.getElementById("productName");
    const productPrice = document.getElementById("productPrice");
    const productDescription = document.getElementById("productDescription");
    const productImage = document.getElementById("productImage");
    const productVarnish = document.getElementById("productVarnish");
    console.log(product);

    productName.textContent = product.name;
    productPrice.textContent = product.price / 100 + "€";
    productDescription.textContent = product.description;
    productImage.setAttribute("src", product.imageUrl);

    for (let varnish of product.varnish) {
        const productOptions = document.createElement("option");
        productOptions.textContent = varnish;
        productOptions.setAttribute("value", varnish);
        productVarnish.appendChild(productOptions);
    }

    const button = document.getElementById("orderButton");
    button.addEventListener("click", () => {
        let cart = JSON.parse(localStorage.getItem("cart"));
        if (cart === null) {
            cart = [];
        }
        cart.push(product._id);
        localStorage.setItem("cart", JSON.stringify(cart));
    });
}
