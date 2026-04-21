import { users } from "../../DATA/user.js";

export function checkStringLength(string, length = 6) {
    if (string.trim().toLowerCase().length < length) {
        return false;
    } else {
        return true;
    }
}
export function validateUsername(username) {
    if (checkStringLength(username)) {
        return true;
    }
}
export function validatePasswords(password1, password2) {
    if (checkStringLength(password1) && checkStringLength(password2)) {
        return true;
    }
}
export function checkPasswordsMatch(password1, password2) {
    if (password1 === password2) {
        return true;
    }
}

export function checkMatchingEmail(email) {
    let matchingEmail;
    users.forEach((user) => {
        if (user.email === email) {
            matchingEmail = email;
        }
    });
    return matchingEmail; //If email match is not found it returns undefined which is a falsy value
}
export function checkMatchingUsername(username) {
    let matchingUsername;
    users.forEach((user) => {
        if (user.username === username) {
            matchingUsername = username;
        }
    });
    return matchingUsername; //If username match is not found it returns undefined which is a falsy value
}

const errorDisplay = document.querySelector(".error-display");
export function setErrorDisplay(text) {
    errorDisplay.textContent = text;
}
export function clearErrorDisplay() {
    errorDisplay.textContent = "";
}
