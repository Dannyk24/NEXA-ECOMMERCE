import {
    openOverlay,
    closeOverlay,
    blockUserScrolling,
    restoreUserScrolling
} from "./overlay.js";
import { activeUserCart } from "../../../BACKEND/DATA/carts.js";
import { formatString } from "../UTILS/format.js";
import {
    saveSearchQuery,
    getSearchQuery
} from "../../../BACKEND/DATA/search.js";
import { navigateTo } from "./navigation.js";
import { notify } from "./notifyUser.js";
import { logOutUser } from "../../../BACKEND/DATA/user.js";
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

const searchIcon = document.querySelector(".search-icon-container");
const searchInput = document.querySelector("#header-search-bar");
const currentQuery = getSearchQuery();

searchIcon.addEventListener("click", () => {
    const query = formatString(searchInput.value);
    if (currentQuery === query) {
        notify("warning", "Same search query");
        return;
    }
    saveSearchQuery(query);
    navigateTo("../../PAGES/USER/search_results.html", 0);
});

searchInput.addEventListener("search", () => {
    const query = formatString(searchInput.value);
    if (currentQuery === query) {
        notify("warning", "Same search query");
        return;
    }
    saveSearchQuery(query);
    navigateTo("../../PAGES/USER/search_results.html", 0);
});

const logOutButtons = document.querySelectorAll(".log-out-button");
logOutButtons.forEach((button) => {
    button.addEventListener("click", () => {
        logOutUser();
    });
});
