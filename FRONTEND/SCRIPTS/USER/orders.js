import {
    activeUserOrders,
    cancelOrder,
    getOrder,
    setActiveViewingOrder,
    viewOrder
} from "../../../BACKEND/DATA/orders.js";
import dayjs from "https://cdn.jsdelivr.net/npm/dayjs@1.11.13/+esm";
import { getProduct } from "../../../BACKEND/DATA/productsMethods.js";
import { getProductImage } from "../../../BACKEND/DATA/productsMethods.js";
import { openModal, closeModal } from "../MODULES/modals.js";
import { notify } from "../MODULES/notifyUser.js";
import { debounce } from "../UTILS/performace.js";
import { formatString } from "../UTILS/format.js";

const ordersContainer = document.querySelector(".orders-list");
function renderOrders(ordersArray) {
    ordersContainer.innerHTML = "";
    if (activeUserOrders.length === 0) {
        ordersContainer.textContent = "You have no orders";
        return;
    }
    if (ordersArray.length === 0) {
        ordersContainer.textContent = "No matching orders found for this query";
        return;
    }
    const sortedOrders = ordersArray.slice().reverse();
    sortedOrders.forEach((order) => {
        const orderDate = dayjs(order.orderDate).format("MMM D, YYYY");
        const deliveryDate = dayjs(order.deliveryDate).format("MMM D, YYYY");
        ordersContainer.innerHTML += `
            <div class="order-container" data-id = "${order.id}">
                <p>Order ID: <span class="order-id">${order.id}</span></p>
                <div class="order-products-list-container">
                    <p>Products list</p>
                    <div class="order-products-list">
                        
                    </div>
                </div>
                <div class="order-placement-date-container">order date: <span class="order-date">${orderDate}</span>
                </div>
                <div class="order-delivery-date-container">delivery date: <span class="delivery-date">${deliveryDate}</span></div>
                <p class="order-cancellation-notice">You can cancel a pending order before it gets confirmed</p>
                <div class="order-cta-container">
                    <div class="order-status ${order.status}-order-status">${order.status}</div>
                    <div class="order-cancel-button" data-modal="confirmation-modal">
                        cancel order
                    </div>
                </div>
            </div>
        `;
        renderOrderProductsImage(order);
        const orderContainer = document.querySelector(
            `[data-id = "${order.id}"]`
        );
        handleContainerState(order, orderContainer);
    });
}

function handleContainerState(order, orderContainer) {
    const cancellationNotice = orderContainer.querySelector(
        ".order-cancellation-notice"
    );
    const orderCancelButton = orderContainer.querySelector(
        ".order-cancel-button"
    );
    if (order.status !== "pending") {
        cancellationNotice.style.display = "none";
        orderCancelButton.style.display = "none";
    }
}

function renderOrder(id) {
    const orderContainer = document.querySelector(`[data-id = "${id}"]`);
    const order = getOrder(id);
    const orderDate = dayjs(order.orderDate).format("MMM D, YYYY");
    const deliveryDate = dayjs(order.deliveryDate).format("MMM D, YYYY");
    orderContainer.innerHTML = `
        <p>Order ID: <span class="order-id">${order.id}</span></p>
        <div class="order-products-list-container">
            <p>Products list</p>
            <div class="order-products-list">
                
            </div>
        </div>
        <div class="order-placement-date-container">order date: <span class="order-date">${orderDate}</span>
        </div>
        <div class="order-delivery-date-container">delivery date: <span class="delivery-date">${deliveryDate}</span></div>
        <p class="order-cancellation-notice">You can cancel a pending order before it gets confirmed</p>
        <div class="order-cta-container">
            <div class="order-status ${order.status}-order-status">${order.status}</div>
            <div class="order-cancel-button" data-modal="confirmation-modal">
                cancel order
            </div>
        </div>
    `;
    renderOrderProductsImage(order);
    handleContainerState(order, orderContainer);
}

function renderOrderProductsImage(order) {
    const orderContainer = document.querySelector(`[data-id = "${order.id}"]`);
    const orderContainerProductsList = orderContainer.querySelector(
        ".order-products-list"
    );
    order.products.forEach((orderItem) => {
        const product = getProduct(orderItem.id);
        const productImage = getProductImage(product);
        orderContainerProductsList.innerHTML += `<img src="../../../${productImage}" alt="">`;
    });
}

renderOrders(activeUserOrders);

const confirmationModal = document.querySelector("#confirmation-modal");
ordersContainer.addEventListener("click", (e) => {
    if (e.target.closest(".order-cancel-button")) {
        const cancelButton = e.target.closest(".order-cancel-button");
        const orderContainer = cancelButton.closest(".order-container");
        const orderId = orderContainer.dataset.id;
        openModal(cancelButton.dataset.modal);
        confirmationModal.dataset.id = orderId;
    } else if (e.target.closest(".order-container")) {
        const orderContainer = e.target.closest(".order-container");
        const orderId = orderContainer.dataset.id;
        const order = getOrder(orderId);
        viewOrder(order);
    }
});

const overlay = document.querySelector(".overlay");
overlay.addEventListener("click", () => {
    closeModal("confirmation-modal");
});
const confirmationModalCloseButton = confirmationModal.querySelector(
    ".modal-close-button"
);
confirmationModalCloseButton.addEventListener("click", () => {
    closeModal("confirmation-modal");
});

confirmationModal.addEventListener("click", (e) => {
    if (e.target.closest) {
    }
});

const cancelOrderConfirmationButton = document.querySelector(
    ".cancel-order-confirmation-button"
);

cancelOrderConfirmationButton.addEventListener("click", (e) => {
    e.preventDefault();
    const orderId = confirmationModal.dataset.id;
    const orderContainer = document.querySelector(`[data-id = "${orderId}"]`);
    if (!cancelOrder(orderId)) {
        return;
    }
    renderOrder(orderId);
    closeModal("confirmation-modal");
    notify("success", "Order cancelled");
});

const ordersSearchInput = document.querySelector("#orders-search");
ordersSearchInput.addEventListener("input", () => {
    const query = formatString(ordersSearchInput.value);
    const debounceFunction = debounce(renderOrders, 500);
    const searchResult = filterOrders(query);
    const searchFunction = debounceFunction(searchResult);
});

function filterOrders(query) {
    const result = [];
    activeUserOrders.forEach((orderObject) => {
        if (orderObject.id.includes(query)) {
            result.push(orderObject);
        }
    });

    return result;
}
