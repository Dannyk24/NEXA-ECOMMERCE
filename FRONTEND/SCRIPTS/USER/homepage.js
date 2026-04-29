import {
    openOverlay,
    closeOverlay,
    blockUserScrolling,
    restoreUserScrolling
} from "../MODULES/overlay.js";
import { activeUser, checkActiveUser } from "../../../BACKEND/DATA/user.js";
import { capitalize } from "../UTILS/format.js";
import { checkNewDay } from "../UTILS/date.js";
import { products } from "../../../BACKEND/DATA/products.js";
import { productsImages } from "../../../BACKEND/DATA/productsImages.js";
import { generateRandomIndex } from "../UTILS/generate.js";

if (!checkActiveUser()) {
    document.body.innerHTML = "YOU MUST BE AUTHENTICATED TO VIEW THIS PAGE"; //Check if user is authenticated
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

/*Welcome Back Section*/
/*=====HELPERS=====*/
function renderActiveUsername() {
    const activeUsername = document.querySelector("#active-username");
    activeUsername.textContent = capitalize(activeUser.username);
}
function generateRecommendedProductHtml(product) {
    const productImage = getProductImage(product);
    const html = `
            <div class="recommended-product" data-id="${product.id}">
                <div class="left">
                    <img src="../../../${productImage}" alt="">
                </div>
                <div class="right">
                    <div class="product-name">${product.name}</div>
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                </div>
            </div>
        `;
    return html;
}
function getProductImage(product) {
    const imageObject = productsImages.find(
        (imageObject) => imageObject.id === product.id
    );
    return imageObject.images[0];
}
function getRandomProduct() {
    return products[generateRandomIndex(products)];
}
function getRecommendedProducts() {
    return JSON.parse(localStorage.getItem("recommended-products"));
}
renderActiveUsername();

const recommendedProductsContainer = document.querySelector(
    ".recommended-products-container"
);

function renderRecommendedProducts() {
    const newDay = checkNewDay();
    recommendedProductsContainer.innerHTML = "";
    if (newDay === false) {
        const recommendedProducts = getRecommendedProducts();
        recommendedProducts.forEach((product) => {
            recommendedProductsContainer.innerHTML +=
                generateRecommendedProductHtml(product);
        });
        return;
    }
    let recommendedProducts = [];
    for (let i = 0; i < 3; i++) {
        const product = getRandomProduct();
        recommendedProducts.push(product);
        const productImage = getProductImage(product); //Get the first image in the images array
        recommendedProductsContainer.innerHTML +=
            generateRecommendedProductHtml(product);
    }
    localStorage.setItem(
        "recommended-products",
        JSON.stringify(recommendedProducts)
    ); //Save recommended products so it can be used to generate html if its still the same day
}

renderRecommendedProducts();
