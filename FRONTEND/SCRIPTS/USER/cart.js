import { activeUserCart, saveUserCarts } from "../../../BACKEND/DATA/carts.js";
import {
    activeUserWishlist,
    saveUserWishlists,
    addToWishlist
} from "../../../BACKEND/DATA/wishlists.js";
import {
    getProduct,
    getProductImage,
    getProductStockCondition,
    getStockConditionColourClass,
    viewProduct
} from "../../../BACKEND/DATA/productsMethods.js";
import { updateHeaderCartCount } from "../MODULES/authenticated_header.js";
import { openModal, closeModal } from "../MODULES/modals.js";
import { notify } from "../MODULES/notifyUser.js";

const cartItemsContainer = document.querySelector(".cart-items-container");
const orderSummaryContainer = document.querySelector(".summaries-container");

function generateCartItemHtml(cartItem) {
    const product = getProduct(cartItem.id);
    const productImage = getProductImage(product);
    const stockCondition = getProductStockCondition(product);
    const stockConditonColourClass = getStockConditionColourClass(product);
    const html = `
        <div class="cart-item-container" data-id = "${cartItem.id}">
            <div class="left">
                <div class="product-image-container">
                    <img src="../../../${productImage}" alt="">
                </div>
                <div class="product-details">
                    <span class="product-edition">${product.edition} edition</span>
                    <p class="product-name">${product.name}</p>
                    <p class = "product-quantity">Quantity: ${cartItem.quantity}</p>
                    <p class="product-stock-condition ${stockConditonColourClass}">${stockCondition}</p>
                </div>
            </div>
            <div class="right">
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="remove-from-cart">
                    <i class="fas fa-trash"></i>
                </div>
            </div>
        </div>
    `;
    return html;
}

function renderCartitems() {
    cartItemsContainer.innerHTML = "";
    if (activeUserCart.length === 0) {
        cartItemsContainer.innerHTML = "You have no cart items";
        return;
    }
    activeUserCart.forEach((cartItem) => {
        cartItemsContainer.innerHTML += generateCartItemHtml(cartItem);
    });
}

function calculateCartItemsTotal() {
    let total = 0;
    activeUserCart.forEach((cartItem) => {
        const product = getProduct(cartItem.id);
        total += product.price;
    });
    return total;
}

const cartTotal = calculateCartItemsTotal();

function renderOrderSummary() {
    orderSummaryContainer.innerHTML = "";
    orderSummaryContainer.innerHTML = `
        <div class="summary-container">
            <span class="summary-title">subtotal (${activeUserCart.length} items):</span>
            <span class="summary-value">$${cartTotal}</span>
        </div>
        <div class="summary-container">
            <span class="summary-title">total shipping:</span>
            <span class="summary-value">free</span>
        </div>
        <div class="summary-container">
            <span class="summary-title">tax(calculated at checkout):</span>
            <span class="summary-value">$0</span>
        </div>
        <div class="line"></div>
        <div class="summary-container">
            <span class="summary-title">total:</span>
            <span class="summary-value total-amount-value">$${cartTotal}</span>
        </div>
    `;
}

cartItemsContainer.addEventListener("click", (e) => {
    const productElem = e.target.closest(".cart-item-container");
    if (!productElem || e.target.closest(".remove-from-cart")) {
        return;
    }
    const productId = Number(productElem.dataset.id); //Convert to type number because getProduct() uses strict equality to compare product id's;
    const product = getProduct(productId);
    viewProduct(product);
});

function renderCartSummary() {
    renderCartitems();
    renderOrderSummary();
}

renderCartSummary();

const productQuantityElem = document.querySelector(".product-quantity");
const confirmationModal = document.querySelector("#confirmation-modal");

cartItemsContainer.addEventListener("click", (e) => {
    if (!e.target.closest(".remove-from-cart")) {
        return;
    }
    const deleteCartItemButton = e.target;
    const cartItemElem = deleteCartItemButton.closest(".cart-item-container");
    const itemId = cartItemElem.dataset.id;
    confirmationModal.dataset.id = itemId;
    openModal("confirmation-modal");
});

const modalCloseButton = document.querySelector(".modal-close-button");
modalCloseButton.addEventListener("click", () => {
    closeModal("confirmation-modal");
});

const overlay = document.querySelector(".overlay");
overlay.addEventListener("click", () => {
    closeModal("confirmation-modal");
});

confirmationModal.addEventListener("click", (e) => {
    e.preventDefault();
    const productId = confirmationModal.dataset.id;
    const productIndex = activeUserCart.findIndex(
        (cartItem) => cartItem.id === Number(productId)
    );
    if (e.target.closest(".remove-from-cart-button")) {
        activeUserCart.splice(productIndex, 1);
        saveUserCarts();
        renderCartSummary();
        updateHeaderCartCount();
        notify("success", "Product removed from cart");
        closeModal("confirmation-modal");
    }
    if (e.target.closest(".add-to-wishlist-button")) {
        const cartItemArray = activeUserCart.splice(productIndex, 1);
        const cartItem = cartItemArray[0]; //index 0 because splice() returns an array
        saveUserCarts();
        renderCartSummary();
        updateHeaderCartCount();
        addToWishlist(cartItem);
        saveUserWishlists();
        notify("success", "Product added to wishlist");
        closeModal("confirmation-modal");
    }
});

const checkoutButton = document.querySelector(".checkout-button");

checkoutButton.addEventListener("click", (e) => {
    if (activeUserCart.length === 0) {
        e.preventDefault();
        notify("warning", "User cart empty");
        return;
    }
});
