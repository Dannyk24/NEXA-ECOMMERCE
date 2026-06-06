import { getSearchQuery } from "../../../BACKEND/DATA/search.js";
import { products } from "../../../BACKEND/DATA/products.js";
import { productsMetaData } from "../../../BACKEND/DATA/productsMetaData.js";
import {
    getProduct,
    getProductImage,
    viewProduct
} from "../../../BACKEND/DATA/productsMethods.js";
import {
    getProductStockCondition,
    getStockConditionColourClass
} from "../../../BACKEND/DATA/productsMethods.js";

const query = getSearchQuery();

const searchInput = document.querySelector("#header-search-bar");
const searchIcon = document.querySelector(".search-icon-container");
searchInput.value = query;

const searchResultsContainer = document.querySelector(
    "#search-results-products-grid"
);

const searchResults = [];

function getSearchResults() {
    if (query === "") {
        products.forEach((product) => {
            searchResults.push(product);
        });
        return;
    }
    products.forEach((product) => {
        if (product.name.includes(query)) {
            searchResults.push(product);
        }
    });

    productsMetaData.forEach((productData) => {
        productData.tags.forEach((tag) => {
            if (tag.includes(query)) {
                const product = getProduct(productData.id);
                if (findMatchingSearchResult(product)) {
                    return;
                }
                searchResults.push(product);
            }
        });
        productData.keywords.forEach((keyword) => {
            if (keyword.includes(query)) {
                const product = getProduct(productData.id);
                if (findMatchingSearchResult(product)) {
                    return;
                }
                searchResults.push(product);
            }
        });
    });
}
getSearchResults();

function renderSearchResults() {
    if (searchResults.length === 0) {
        searchResultsContainer.textContent = "No products match your search";
        return;
    }

    const searchResultsLengthElem = document.querySelector(
        ".search-results-length"
    );
    searchResultsLengthElem.textContent = `Search Results: ${searchResults.length}`;

    searchResults.forEach((product) => {
        const productImage = getProductImage(product);
        const productStockCondition = getProductStockCondition(product);
        const stockConditionColourClass = getProductStockCondition(product);

        searchResultsContainer.innerHTML += `
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
                    <button href="#" class="cta primary-cta add-to-cart-button">Add to Cart</button>
                    <button href="#" class="cta secondary-cta add-to-wishlist-btn"><i
                            class="far fa-heart"></i></button>
                </div>
            </div>
        `;
    });
}

renderSearchResults();

searchResultsContainer.addEventListener("click", (e) => {
    if (!e.target.closest(".product-container")) {
        return;
    }
    const productContainer = e.target.closest(".product-container");
    const productId = Number(productContainer.dataset.id);
    const product = getProduct(productId);
    viewProduct(product);
});

function findMatchingSearchResult(product) {
    const matchingProduct = searchResults.find(
        (result) => result.id === product.id
    );
    return matchingProduct;
}
