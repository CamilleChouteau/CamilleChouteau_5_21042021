const emailRegex = /^[a-zA-Z0-9.-_]+@[a-zA-Z0-9.-_]+\.[a-zA-Z]{2,6}$/;
const regularNameRegex = /^[a-zA-Zéèàîïêëûü' -]+$/;
const addressRegex = /^[a-zA-Z0-9éèàîïêëûü' -]+$/;

export const validateEmail = (inputEmail) => {
    return emailRegex.test(inputEmail);
};

export const validatePostalCode = (inputPostalCode) => {
    return inputPostalCode.length === 5;
};

export const validateRegularName = (inputString) => {
    return regularNameRegex.test(inputString);
};

export const validateAddress = (inputAddress) => {
    return addressRegex.test(inputAddress);
};
