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
import {
    getProductImage,
    getProductStockCondition,
    getRandomProduct,
    getStockConditionColourClass
} from "../../../BACKEND/DATA/productsMethods.js";

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
                    <div class="recommended-product-name">${product.name}</div>
                    <span class="recommended-product-price">$${product.price}</span>
                </div>
            </div>
        `;
    return html;
}

function saveRecommenedProducts(recommendedProducts) {
    localStorage.setItem(
        "recommended-products",
        JSON.stringify(recommendedProducts)
    );
}
function getRecommendedProducts() {
    return JSON.parse(localStorage.getItem("recommended-products"));
}
function generateStationeryProductsHtml(product) {
    const productImage = getProductImage(product);
    const productStockCondition = getProductStockCondition(product);
    let stockConditionColourClass = getStockConditionColourClass(product);

    const productHtml = `
            <div class="product-container" data-id="${product.id}">
                <div class="product-image-container">
                    <img src="../../../${productImage}" alt="">
                    <div class="bottom-fade"></div>
                </div>
                <div class="product-data-container">
                    <div class="top">
                        <span class="product-name">${product.name}</span>
                        <span class="product-price">$${product.price}</span>
                    </div>
                    <div class="bottom">
                        <p class="product-description">
                            ${product.description}
                        </p>
                    </div>
                </div>
                <p class="stock-condition ${stockConditionColourClass}">${productStockCondition}</p>
                <div class="product-cta-container">
                    <button href="#" class="cta primary-cta add-to-cart-btn">Add to Cart</button>
                    <button href="#" class="cta secondary-cta add-to-wishlist-btn"><i
                            class="far fa-heart"></i></button>
                </div>
            </div>
        `;

    return productHtml;
}

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
        //3 is the number of products that are used
        let product = getRandomProduct();
        while (checkDuplicateProduct(product, recommendedProducts)) {
            product = getRandomProduct();
        }
        recommendedProducts.push(product);
        const productImage = getProductImage(product); //Get the first image in the images array
        recommendedProductsContainer.innerHTML +=
            generateRecommendedProductHtml(product);
    }
    saveRecommenedProducts(recommendedProducts); //Save recommended products so it can be used to generate html if its still the same day
}

const stationeryProductsContainer = document.querySelector(
    "#daily-edit-products-grid"
);

function renderStationeryProducts() {
    const stationeryProducts = products.filter(
        (product) => product.category === "stationery"
    );
    stationeryProductsContainer.innerHTML = "";
    if (stationeryProducts.length > 5) {
        for (let i = 0; i < 5; i++) {
            let product = stationeryProducts[i];
            stationeryProductsContainer.innerHTML +=
                generateStationeryProductsHtml(product);
        }
        return;
    }
    stationeryProducts.forEach((product) => {
        stationeryProductsContainer.innerHTML +=
            generateStationeryProductsHtml(product);
    });
}

renderActiveUsername();
renderRecommendedProducts();
renderStationeryProducts();
