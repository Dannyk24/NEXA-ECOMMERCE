import { openModal, closeModal } from "../MODULES/modals.js";
import { capitalize } from "../UTILS/format.js";
import {
    activeUser,
    saveUsers,
    setActiveUser,
    saveActiveUser,
    users,
    getUser
} from "../../../BACKEND/DATA/user.js";
import { formatString } from "../UTILS/format.js";
import {
    checkMatchingEmail,
    checkMatchingUsername
} from "../../../BACKEND/AUTH/MODULES/validate.js";
import { notify } from "../MODULES/notifyUser.js";
import { activeUserOrders, viewOrder } from "../../../BACKEND/DATA/orders.js";
import {
    getProduct,
    getProductImage
} from "../../../BACKEND/DATA/productsMethods.js";
import { products } from "../../../BACKEND/DATA/products.js";
import { getOrder } from "../../../BACKEND/DATA/orders.js";
import dayjs from "https://cdn.jsdelivr.net/npm/dayjs@1.11.13/+esm";

const editProfileButton = document.querySelector(".edit-profile-cta");
const modal = editProfileButton.dataset.modal;
editProfileButton.addEventListener("click", () => {
    openModal(modal);
    populateUserInfoForm();
});

const overlay = document.querySelector(".overlay");
overlay.addEventListener("click", () => {
    closeModal(modal);
    closeModal("update-address-modal");
});

const userInfoFormModalCloseButton = document.querySelector(
    ".user-info-form-modal-close-button"
);
userInfoFormModalCloseButton.addEventListener("click", () => {
    closeModal(modal);
});

function populateUserInfoForm() {
    const usernameInput = document.querySelector(".username-input");
    const emailInput = document.querySelector(".email-input");
    const phoneNumberInput = document.querySelector(".phone-number-input");

    usernameInput.value = activeUser.username;
    emailInput.value = activeUser.email;
    if (activeUser.phoneNumber) {
        phoneNumberInput.value = activeUser.phoneNumber;
    } else {
        phoneNumberInput.placeholder = "Phone Number";
    }
}

function renderUserprofile() {
    const profileAvatar = document.querySelector(".profile-picture");
    const username = document.querySelector(".username");
    const email = document.querySelector(".user-email");
    const phoneNumber = document.querySelector(".user-phone-number");
    const totalOrders = document.querySelector(".total-orders");
    const rewardPoints = document.querySelector(".total-reward-points");

    profileAvatar.textContent = activeUser.username[0]; //Use first letter
    username.textContent = activeUser.username;
    email.textContent = activeUser.email;
    phoneNumber.textContent = activeUser.phoneNumber || "null";

    const activeOrders = activeUserOrders.filter(
        (order) => order.status !== "cancelled"
    );
    totalOrders.textContent = activeOrders.length;

    const deliveredOrders = activeUserOrders.filter(
        (order) => order.status === "delivered"
    );
    rewardPoints.textContent = deliveredOrders.length * 10;
}

const userProfileForm = document.querySelector("#user-info-modal");
const userProfileFormSubmitButton = document.querySelector(
    ".user-info-form-submit-button"
);
userProfileFormSubmitButton.addEventListener("click", (e) => {
    if (!userProfileForm.checkValidity()) {
        return;
    }
    e.preventDefault();
    const usernameInput = document.querySelector(".username-input");
    const emailInput = document.querySelector(".email-input");
    const phoneNumberInput = document.querySelector(".phone-number-input");

    const username = formatString(usernameInput.value);
    const email = formatString(emailInput.value);
    const phoneNumber = formatString(phoneNumberInput.value);

    const user = getUser(activeUser.id);
    if (phoneNumber !== "") {
        if (phoneNumber.length < 10) {
            notify("warning", "Invalid phone number");
            return;
        } else {
            user.phoneNumber = phoneNumber;
        }
    }

    if (username !== activeUser.username) {
        if (checkMatchingUsername(username)) {
            notify("warning", "Username unavailable");
            return;
        } else {
            user.username = username;
        }
    }

    if (email !== activeUser.email) {
        if (checkMatchingEmail(email)) {
            notify("warning", "Email linked to another account");
            return;
        } else {
            user.email = email;
        }
    }

    activeUser.username = user.username;
    activeUser.email = user.email;
    activeUser.phoneNumber = user.phoneNumber;

    notify("success", "Profile updated");
    renderUserprofile();
    closeModal("user-info-modal");
    saveUsers();
    saveActiveUser();
});

renderUserprofile();

const updateAddressButton = document.querySelector(".update-address-cta");

updateAddressButton.addEventListener("click", () => {
    const modal = updateAddressButton.dataset.modal;
    openModal(modal);
    populateUpdateAdressForm();
});
const updateAddressFormModalCloseButton = document.querySelector(
    ".update-adress-form-modal-close-button"
);
updateAddressFormModalCloseButton.addEventListener("click", () => {
    closeModal("update-address-modal");
});

const recentOrdersContainer = document.querySelector(
    ".recent-orders-container"
);

function renderRecentOrders() {
    recentOrdersContainer.innerHTML = "";
    const recentOrderProducts = getRecentOrdersProducts();
    if (recentOrderProducts.length === 0) {
        recentOrdersContainer.textContent = "You have no recent Orders";
        return;
    }
    for (let i = 0; i < 3; i++) {
        const orderItem = recentOrderProducts[i];
        if (!orderItem) {
            break;
        }
        const order = getOrder(orderItem.orderId);
        const product = getProduct(orderItem.id);
        const productImage = getProductImage(product);
        const deliveryDate = dayjs(order.deliveryDate).format("MMM D, YYYY");
        const orderItemTotal = (product.price * orderItem.quantity).toFixed(2);
        recentOrdersContainer.innerHTML += `
                <div class="recent-order-container" data-order-id="${order.id}">
                    <div class="left">
                        <div class="product-image">
                            <img src="../../../${productImage}" alt="">
                        </div>
                        <div class="product-info">
                            <div class="product-id">Order ID: ${order.id}</div>
                            <div class="product-name">${product.name}</div>
                            <div class="product-delivery-date">Delivered on <span>${deliveryDate}</span></div>
                        </div>
                    </div>
                    <div class="right">
                        <div class="product-amount-container">
                            <label for="total">total</label>
                            <div class="product-price">$${orderItemTotal}</div>
                        </div>
                        <div class="order-status ${order.status}-order-status">${order.status}</div>
                    </div>
                </div>
            `;
    }
}

renderRecentOrders();

recentOrdersContainer.addEventListener("click", (e) => {
    if (!e.target.closest(".recent-order-container")) {
        return;
    }
    const recentOrderContainer = e.target.closest(".recent-order-container");
    const orderId = recentOrderContainer.dataset.orderId;
    const order = getOrder(orderId);
    viewOrder(order);
});

function getRecentOrdersProducts(numberOfProducts) {
    let recentOrdersProducts = [];
    const sortedRecentOrderProducts = activeUserOrders.slice().reverse();

    for (let i = 0; i < 3; i++) {
        const order = sortedRecentOrderProducts[i];
        if (!order) {
            break;
        }
        if (recentOrdersProducts.length >= 3) {
            break;
        }
        for (let index = 0; index < 3; index++) {
            const orderProducts = order.products.slice().reverse();
            const product = orderProducts[index];
            if (!product) {
                break;
            }
            recentOrdersProducts.push(product);
        }
    }

    return recentOrdersProducts;
}

function populateUpdateAdressForm() {
    const streetInput = document.querySelector(".street-input");
    const cityInput = document.querySelector(".city-input");
    const postalCodeInput = document.querySelector(".postal-code-input");
    const countrySelect = document.querySelector("#country-input");

    if (activeUser.address.street) {
        streetInput.value = activeUser.address.street;
        cityInput.value = activeUser.address.city;
        postalCodeInput.value = activeUser.address.postalCode;
        countrySelect.value = activeUser.address.country;
    }
}

function renderUserAddress() {
    const username = document.querySelector(".account-name");
    username.textContent = activeUser.username;
    const address = document.querySelector(".default-shipping-address");
    if (!activeUser.address.street) {
        address.textContent = "Add your default shipping address here";
    } else {
        address.textContent = `${activeUser.address.street}, ${activeUser.address.city}, ${activeUser.address.postalCode}, ${activeUser.address.country}`;
    }
}

const updateAddressFormSubmitButton = document.querySelector(
    ".update-address-form-submit-button"
);
updateAddressFormSubmitButton.addEventListener("click", (e) => {
    const updateAddressForm = document.querySelector("#update-address-modal");
    const streetInput = document.querySelector(".street-input");
    const cityInput = document.querySelector(".city-input");
    const postalCodeInput = document.querySelector(".postal-code-input");
    const countrySelect = document.querySelector("#country-input");

    const street = formatString(streetInput.value);
    const city = formatString(cityInput.value);
    const postalCode = Number(postalCodeInput.value.trim());
    const country = countrySelect.value;

    if (!updateAddressForm.checkValidity()) {
        return;
    }
    e.preventDefault();

    if (street.length < 12) {
        notify("warning", "Address too short");
        return;
    }
    const user = getUser(activeUser.id);
    const address = {
        street,
        city,
        postalCode,
        country
    };
    user.address = address;
    activeUser.address = address;

    notify("success", "Address updated");
    closeModal("update-address-modal");
    saveUsers();
    saveActiveUser();
    renderUserAddress();
});

renderUserAddress();
