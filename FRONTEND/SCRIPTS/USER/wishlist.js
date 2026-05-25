import {
    activeUserWishlist,
    saveUserWishlists
} from "../../../BACKEND/DATA/wishlists.js";
import { products } from "../../../BACKEND/DATA/products.js";
import {
    getProduct,
    getProductImage,
    getProductStockCondition,
    getStockConditionColourClass,
    viewProduct
} from "../../../BACKEND/DATA/productsMethods.js";
import { addToCart } from "../../../BACKEND/DATA/carts.js";
import { notfiy } from "../MODULES/notifyUser.js";

const productsGrid = document.querySelector("#wishlist-products-grid");

function renderWishlistProducts() {
    if (activeUserWishlist.length === 0) {
        productsGrid.textContent = "You have no wishlist items";
        return;
    }
    activeUserWishlist.forEach((wishlistItem) => {
        const product = getProduct(wishlistItem.id);
        const productImage = getProductImage(product);
        const productStockCondition = getProductStockCondition(product);
        const stockConditionColourClass = getStockConditionColourClass(product);

        productsGrid.innerHTML += `
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
                    <button class="cta primary-cta add-to-cart-button">Add to Cart</button>
                    <button class="cta secondary-cta remove-from-wishlist-btn">Remove from wishlist</button>
                </div>
            </div>
        `;
    });
}
renderWishlistProducts();

productsGrid.addEventListener("click", (e) => {});

productsGrid.addEventListener("click", (e) => {
    const productContainer = e.target.closest(".product-container");
    const productId = Number(productContainer.dataset.id);
    const product = getProduct(productId);
    if (e.target.closest(".add-to-cart-button")) {
        const itemIndex = activeUserWishlist.findIndex(
            (item) => item.id === productId
        );
        activeUserWishlist.splice(itemIndex, 1);
        addToCart(product, 1);
        saveUserWishlists();
        renderWishlistProducts();
        notfiy("success", "Product moved to cart");
        return;
    }
    if (e.target.closest(".remove-from-wishlist-btn")) {
        const itemIndex = activeUserWishlist.findIndex(
            (item) => item.id === productId
        );
        activeUserWishlist.splice(itemIndex, 1);
        saveUserWishlists();
        renderWishlistProducts();
        notfiy("success", "Product removed from wishlist");
        return;
    }
    if (e.target.closest(".product-container")) {
        viewProduct(product);
    }
});
