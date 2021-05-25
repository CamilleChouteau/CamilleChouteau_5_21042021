const emailRegex = /^[a-zA-Z0-9.-_]+@[a-zA-Z0-9.-_]+\.[a-zA-Z]{2,6}$/g;

export const validateEmail = (inputEmail) => {
    return emailRegex.test(inputEmail);
};

export const validatePostalCode = (inputPostalCode) => {
    return inputPostalCode.length === 5;
};
