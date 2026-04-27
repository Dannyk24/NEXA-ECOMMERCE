import {
    openOverlay,
    closeOverlay,
    blockUserScrolling,
    restoreUserScrolling
} from "../MODULES/overlay.js";

const sidebarToggle = document.querySelector(".menu-toggle-mobile");
const authenticatedNavbar = document.querySelector(".authenticated-mobile-nav");
const overlay = document.querySelector(".overlay");
sidebarToggle.addEventListener("click", () => {
    authenticatedNavbar.classList.add("authenticated-mobile-nav-active");
    openOverlay();
    blockUserScrolling();
});
overlay.addEventListener("click", () => {
    authenticatedNavbar.classList.remove("authenticated-mobile-nav-active");
    closeOverlay();
    restoreUserScrolling();
});
