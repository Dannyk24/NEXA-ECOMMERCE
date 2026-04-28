import {
    openOverlay,
    closeOverlay,
    blockUserScrolling,
    restoreUserScrolling
} from "../MODULES/overlay.js";
import { activeUser, checkActiveUser } from "../../../BACKEND/DATA/user.js";

if (!checkActiveUser()) {
    document.body.innerHTML = "YOU MUST BE AUTHENTICATED TO VIEW THIS PAGE";
}

/*Mobile sidebar toggle*/

/*=====HELPERS=====*/
function openMobileNav() {
    authenticatedNavbar.classList.add("authenticated-mobile-nav-active");
    openOverlay();
    blockUserScrolling();
}
function closeMobileNav() {
    authenticatedNavbar.classList.remove("authenticated-mobile-nav-active");
    closeOverlay();
    restoreUserScrolling();
}

const sidebarToggle = document.querySelector(".menu-toggle-mobile");
const authenticatedNavbar = document.querySelector(".authenticated-mobile-nav");
const overlay = document.querySelector(".overlay");
sidebarToggle.addEventListener("click", () => {
    openMobileNav();
});
overlay.addEventListener("click", () => {
    closeMobileNav();
});
