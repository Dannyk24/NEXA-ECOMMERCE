import { activeUserCart } from "../../../BACKEND/DATA/carts.js";
import {
    getProduct,
    getProductImage,
    getProductStockCondition,
    getStockConditionColourClass,
    viewProduct
} from "../../../BACKEND/DATA/productsMethods.js";

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
                    <p class="product-stock-condition ${stockConditonColourClass}">${stockCondition}</p>
                    <div class="product-quantity-selector-container">
                        <i class="fas fa-minus reduce-quantity"></i>
                        <span class="product-quantity">${cartItem.quantity}</span>
                        <i class="fas fa-plus increase-quantity"></i>
                    </div>
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
    if (!productElem) {
        return;
    }
    const productId = Number(productElem.dataset.id); //Convert to type number because getProduct() uses strict equality to compare product id's;
    const product = getProduct(productId);
    viewProduct(product);
});

renderCartitems();
renderOrderSummary();
