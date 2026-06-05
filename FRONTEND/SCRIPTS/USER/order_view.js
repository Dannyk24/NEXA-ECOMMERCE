import { getActiveViewingOrder } from "../../../BACKEND/DATA/orders.js";
import { activeUser } from "../../../BACKEND/DATA/user.js";

import dayjs from "https://cdn.jsdelivr.net/npm/dayjs@1.11.13/+esm";
import { notify } from "../MODULES/notifyUser.js";
import { cancelOrder } from "../../../BACKEND/DATA/orders.js";
import { openModal, closeModal } from "../MODULES/modals.js";
import { navigateTo } from "../MODULES/navigation.js";
import {
    addToCart,
    clearActiveUsersCart
} from "../../../BACKEND/DATA/carts.js";
import {
    getProduct,
    getProductImage
} from "../../../BACKEND/DATA/productsMethods.js";
import { getOrder } from "../../../BACKEND/DATA/orders.js";

const activeOrderObject = getActiveViewingOrder();
const activeOrder = getOrder(activeOrderObject.id);

const orderViewLeft = document.querySelector(".order-view-left");

orderViewLeft.innerHTML = "";

const shippedDate = dayjs(activeOrder.shippedDate).format("MMM D, YYYY");
const deliveryDate = dayjs(activeOrder.deliveryDate).format("MMM D, YYYY");
const address = `${activeOrder.address.street}, ${activeOrder.address.city}, ${activeOrder.address.postalCode}, ${activeOrder.address.country}`;

function renderOrderLeft() {
    orderViewLeft.innerHTML = `
    <div class="section-header">Order ID: <span class="order-id">${activeOrder.id}</span></div>
        <div class="order-cta-container">
            <div class="order-status ${activeOrder.status}-order-status">${activeOrder.status}</div>
            <div class="order-cancel-button" data-modal="confirmation-modal">cancel order</div>
            <div class="cta secondary-cta buy-again-cta">buy again</div>
        </div>
        <div class="order-tracking-container ${activeOrder.status}-order-tracking-container">
            <div class="order-state-info-container" id="pending-state-container">
                <div class="left">
                    <i class="fas fa-clock order-pending-icon"></i>
                    <div class="decorative-line"></div>
                </div>
                <div class="right">
                    <p>Pending</p>
                    <span>order awaiting confirmation</span>
                </div>
            </div>
            <div class="order-state-info-container" id="confirmed-state-container">
                <div class="left">
                    <i class="fas fa-check-circle order-confirmed-icon"></i>
                    <div class="decorative-line"></div>
                </div>
                <div class="right">
                    <p>Confirmed</p>
                    <span>order confirmed</span>
                </div>
            </div>
            <div class="order-state-info-container" id="shipped-state-container">
                <div class="left">
                    <i class="fas fa-truck-fast order-shipped-icon"></i>
                    <div class="decorative-line"></div>
                </div>
                <div class="right">
                    <p>Shipped</p>
                    <span>order shipped to warehouse</span>
                    <div class="order-date">${shippedDate}</div>
                </div>
            </div>
            <div class="order-state-info-container" id="delivered-state-container">
                <div class="left">
                    <i class="fas fa-house order-delivered-icon"></i>
                    <div class="decorative-line"></div>
                </div>
                <div class="right">
                    <p>Delivered</p>
                    <span>order successfully delivered</span>
                    <div class="order-date">${deliveryDate}</div>
                </div>
            </div>
        </div>
        <div class="order-details-container">
            <div class="order-details-field-container">
                <div class="field-header">contact information</div>
                <p class="field-info">${activeUser.email}</p>
            </div>
            <div class="order-details-field-container">
                <div class="field-header">order address</div>
                <p class="field-info">${activeOrder.name}</p>
                <p class="field-info">${address}</p>
            </div>
        </div>
`;
    handleOrderState();
}

renderOrderLeft();

function handleOrderState() {
    const cancelOrderButton = document.querySelector(".order-cancel-button");
    const buyAgainButton = document.querySelector(".buy-again-cta");
    if (activeOrder.status !== "pending") {
        cancelOrderButton.style.display = "none";
    }

    if (
        activeOrder.status === "pending" ||
        activeOrder.status === "confirmed"
    ) {
        buyAgainButton.style.display = "none";
    }
}

function renderOrderProducts() {
    const productsList = document.querySelector(".order-products-list");
    productsList.innerHTML = "";
    const orderProducts = activeOrder.products;
    orderProducts.forEach((orderItem) => {
        const product = getProduct(orderItem.id);
        const productImage = getProductImage(product);
        productsList.innerHTML += `
            <div class="order-product-container">
                <div class="product-image-container">
                    <img src="../../../${productImage}" alt="">
                    <div class="product-quantity-badge">${orderItem.quantity}</div>
                </div>
                <div class="product-info">
                    <p class="product-name">${product.name}</p>
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                </div>
            </div>
        `;
    });
}

renderOrderProducts();

const cancelOrderButton = document.querySelector(".order-cancel-button");
const buyAgainButton = document.querySelector(".buy-again-cta");
cancelOrderButton.addEventListener("click", () => {
    if (activeOrder.status !== "pending") {
        notify("danger", "Order cancel failed");
        return;
    } else {
        openModal(cancelOrderButton.dataset.modal);
        confirmationModal.dataset.id = activeOrder.id;
    }
});

const overlay = document.querySelector(".overlay");
overlay.addEventListener("click", () => {
    closeModal("confirmation-modal");
});
const confirmationModal = document.querySelector("#confirmation-modal");
const confirmationModalCloseButton = document.querySelector(
    ".modal-close-button"
);
confirmationModalCloseButton.addEventListener("click", () => {
    closeModal("confirmation-modal");
});

const cancelOrderConfirmationButton = document.querySelector(
    ".cancel-order-confirmation-button"
);
cancelOrderConfirmationButton.addEventListener("click", (e) => {
    e.preventDefault();
    const orderId = confirmationModal.dataset.id;
    if (orderId !== activeOrder.id) {
        return;
    }
    if (!cancelOrder(orderId)) {
        return;
    }
    closeModal("confirmation-modal");
    notify("success", "Order cancelled");
    renderOrderLeft();
});

buyAgainButton.addEventListener("click", () => {
    clearActiveUsersCart();
    const orderProducts = activeOrder.products;
    orderProducts.forEach((orderProduct) => {
        const product = getProduct(orderProduct.id);
        const quantity = orderProduct.quantity;
        addToCart(product, quantity);
    });
    navigateTo("../../PAGES/USER/checkout.html");
});
