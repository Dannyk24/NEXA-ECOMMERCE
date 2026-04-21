import { navigateTo } from "../../FRONTEND/SCRIPTS/MODULES/navigation.js";
import { notfiy } from "../../FRONTEND/SCRIPTS/MODULES/notifyUser.js";
import { formatString } from "../../FRONTEND/SCRIPTS/UTILS/format.js";
import {
    users,
    activeUser,
    setActiveUser,
    saveActiveUser
} from "../DATA/user.js";
import { setErrorDisplay, clearErrorDisplay } from "./MODULES/validate.js";
import { handlePasswordFieldToggle } from "./MODULES/security.js";

/*=====HELPERS=====*/
function findMatchingUser(email, password) {
    let matchingUser = users.find(
        (user) => user.email === email && user.password === password
    );
    return matchingUser;
}
const loginForm = document.querySelector("#login-auth-form");
const emailElem = loginForm.querySelector("#login-email");
const passwordElem = loginForm.querySelector("#login-password");
const loginButton = loginForm.querySelector("#js-login-btn");
loginButton.addEventListener("click", (e) => {
    authenticateUser(e);
});

function authenticateUser(e) {
    if (!loginForm.checkValidity()) {
        return;
    }
    e.preventDefault();

    const email = formatString(emailElem.value);
    const password = formatString(passwordElem.value);
    const matchingUser = findMatchingUser(email, password);
    if (!matchingUser) {
        //Check if theres no matching user
        setErrorDisplay("Invalid Credentials");
        return;
    }
    clearErrorDisplay();
    notfiy("success", "User Authenticated");
    setActiveUser(matchingUser.id, matchingUser.username, matchingUser.role);
    saveActiveUser();
    if (activeUser.role === "admin") {
        navigateTo("../ADMIN/admin-dashboard.html", 2500);
    } else {
        navigateTo("homepage.html", 2500);
    }
}
document.body.addEventListener("click", (e) => {
    handlePasswordFieldToggle(e);
});
