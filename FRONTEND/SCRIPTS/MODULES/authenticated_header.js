import {
    openOverlay,
    closeOverlay,
    blockUserScrolling,
    restoreUserScrolling
} from "./overlay.js";
import { activeUserCart } from "../../../BACKEND/DATA/carts.js";
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

export function updateHeaderCartCount() {
    const cartCountElem = document.querySelector(".number-badge-display");
    cartCountElem.textContent = activeUserCart.length;
}

updateHeaderCartCount();
