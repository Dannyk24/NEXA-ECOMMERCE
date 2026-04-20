import { notfiy } from "../../FRONTEND/SCRIPTS/MODULES/notifyUser.js";
import {
    checkStringLength,
    validatePasswords,
    validateUsername,
    checkPasswordsMatch,
    checkMatchingUsername,
    checkMatchingEmail
} from "./MODULES/validate.js";
import { toggleInputFieldType } from "./MODULES/security.js";
import { users, saveUsers } from "../DATA/user.js";
import { formatString } from "../../FRONTEND/SCRIPTS/UTILS/format.js";
import { generateUserId } from "./MODULES/generate.js";
import { navigateTo } from "../../FRONTEND/SCRIPTS/MODULES/navigation.js";

//SIMULATED SIGN UP LOGIC
/*=====HELPERS======*/
function openPasswordIcon(icon) {
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
}
function closePasswordIcon(icon) {
    icon.classList.add("fa-eye");
    icon.classList.remove("fa-eye-slash");
}
function setErrorDisplay(text) {
    errorDisplay.textContent = text;
}
function clearErrorDisplay() {
    errorDisplay.textContent = "";
}
function handleUsernameLength() {
    const username = formatString(usernameElem.value);
    if (!validateUsername(username)) {
        setErrorDisplay("Username Must be atleast 6 characters long");
        return;
    } else {
        clearErrorDisplay();
        return true;
    }
}
function handlePasswordsLength() {
    const password = formatString(passwordElem.value);
    const confirmPassword = formatString(confirmPasswordElem.value);

    if (!validatePasswords(password, confirmPassword)) {
        setErrorDisplay("Passwords must be atleast 6 chracters long");
        return;
    } else {
        clearErrorDisplay();
        return true;
    }
}

function handlePasswordsMatch() {
    const password = formatString(passwordElem.value);
    const confirmPassword = formatString(confirmPasswordElem.value);
    if (!checkPasswordsMatch(password, confirmPassword)) {
        setErrorDisplay("Passwords do not match");
        return;
    } else {
        clearErrorDisplay();
        return true;
    }
}

function handleUsernameCheck() {
    const username = formatString(usernameElem.value);
    if (checkMatchingUsername(username)) {
        notfiy("warning", "Username unavailable");
        return;
    } else {
        clearErrorDisplay();
        return true;
    }
}

function handleEmailCheck() {
    const email = formatString(emailElem.value);
    if (checkMatchingEmail(email)) {
        //checkMatchingEmail returns true if it finds a matching email
        setErrorDisplay("An account was found with this email");
        return;
    } else {
        clearErrorDisplay();
        return true;
    }
}

const signUpForm = document.querySelector("#sign-up-auth-form");
const signUpButton = document.querySelector("#js-sign-up-btn");
const errorDisplay = document.querySelector(".error-display");
const usernameElem = signUpForm.querySelector("#js-username-input");
const emailElem = signUpForm.querySelector("#js-email-input");
const passwordElem = document.querySelector("#js-password-input");
const confirmPasswordElem = document.querySelector(
    "#js-confirm-password-input"
);

signUpButton.addEventListener("click", (e) => {
    if (!signUpForm.checkValidity()) {
        return;
    }
    e.preventDefault(); //If Basic form validation passes then move on to additional checks

    if (
        !handleUsernameLength() ||
        !handlePasswordsLength() ||
        !handlePasswordsMatch() ||
        !handleUsernameCheck() ||
        !handleEmailCheck()
    ) {
        return;
    }

    notfiy("success", "Account Created");
    const userId = generateUserId();
    const username = formatString(usernameElem.value);
    const email = formatString(emailElem.value);
    const password = formatString(passwordElem.value);

    const newUser = {
        id: userId,
        username: username,
        email: email,
        password: password,
        role: "user"
    };
    users.push(newUser);
    saveUsers();
    setTimeout(() => {
        navigateTo("http://127.0.0.1:5500/FRONTEND/PAGES/USER/login.html");
    }, 2500);

    //Notify user
    //Add user to usersList
    //Navigate user to Login Page
    //Once user logs in navigate user to homepage
    //Create User cart
    //Set user as activeUser
});

document.body.addEventListener("click", (e) => {
    if (!e.target.classList.contains("fas")) {
        return;
    }
    const container = e.target.closest(".auth-form-input-field-container");
    const inputField = container.querySelector("input");
    const icon = e.target;
    if (toggleInputFieldType(inputField) === "text") {
        openPasswordIcon(icon);
    } else {
        closePasswordIcon(icon);
    }
});
