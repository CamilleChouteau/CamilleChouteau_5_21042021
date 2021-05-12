export const findProduct = async (productId) => {
    // comme on est dans une fonction asynchrone, on a pas besoin de passer par des then (qui sont lourds en écriture)
    // on peut utiliser le mot clé "await" pour dire qu'on attend le résultat asynchrone
    // et on peut donc directement stocker le résultat dans une variable (comme on ferait habituellement quand on appelle une fonction)
    const httpResponse = await fetch(
        "http://localhost:3000/api/furniture/" + productId
    );
    const response = await httpResponse.json();
    return response;
};
