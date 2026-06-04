import { activeUser } from "../../../BACKEND/DATA/user.js";
import { notify } from "../MODULES/notifyUser.js";
import { formatString } from "../UTILS/format.js";
import {
    activeUserCart,
    calculateCartTotal,
    clearActiveUsersCart
} from "../../../BACKEND/DATA/carts.js";
import {
    getProduct,
    getProductImage
} from "../../../BACKEND/DATA/productsMethods.js";
import { viewProduct } from "../../../BACKEND/DATA/productsMethods.js";
import { createOrder } from "../../../BACKEND/DATA/orders.js";
import { navigateTo } from "../MODULES/navigation.js";
import { updateHeaderCartCount } from "../MODULES/authenticated_header.js";

function loadDefaultUserAddress() {
    const addressNameInput = document.querySelector(".address-name-input");
    addressNameInput.value = activeUser.username;

    if (activeUser.address.street) {
        const addressStreetInput = document.querySelector(
            ".address-street-input"
        );
        const addressCityInput = document.querySelector(".address-city-input");
        const addressPostalCodeInput = document.querySelector(
            ".address-postal-code-input"
        );
        const addressCountryInput = document.querySelector("#country-input");

        addressStreetInput.value = activeUser.address.street;
        addressCityInput.value = activeUser.address.city;
        addressPostalCodeInput.value = activeUser.address.postalCode;
        addressCountryInput.value = activeUser.address.country;

        addressCityInput.setAttribute("readonly", "");
        addressStreetInput.setAttribute("readonly", "");
        addressPostalCodeInput.setAttribute("readonly", "");
    }
}
if (activeUser.address.street) {
    loadDefaultUserAddress();
} else {
    const checkoutLeftContainer = document.querySelector(".checkout-left");
    checkoutLeftContainer.innerHTML = `<a href="./profile.html" class="cta primary-cta">Setup default address</a>`;
}

const checkoutForms = document.querySelectorAll(".checkout-form");
function setActiveCheckoutForm(formID) {
    checkoutForms.forEach((form) => {
        form.classList.toggle(
            "active-checkout-form",
            form.getAttribute("id") === formID
        );
    });
}

const checkkoutProgressContainer = document.querySelector(
    ".checkout-progress-container"
);
const checkoutProgressStages = document.querySelectorAll(
    ".checkout-progress-stage"
);
checkkoutProgressContainer.addEventListener("click", (e) => {
    if (!e.target.closest(".checkout-progress-stage")) {
        return;
    }
    const stage = e.target.closest(".checkout-progress-stage");
    const formId = stage.dataset.form;
    if (formId === "review-form") {
        renderOrderReview();
    }
    setActiveProgressStage(formId);
    setActiveCheckoutForm(formId);
});

function setActiveProgressStage(formID) {
    checkoutProgressStages.forEach((stage) => {
        stage.classList.toggle(
            "active-checkout-progress-stage",
            stage.dataset.form === formID
        );
    });
}

const shippingAddressFormSubmitButton = document.querySelector(
    ".shipping-address-form-submit-button"
);

shippingAddressFormSubmitButton.addEventListener("click", (e) => {
    const shippingAddressForm = shippingAddressFormSubmitButton.closest("form");
    if (!shippingAddressForm.checkValidity()) {
        return;
    }
    e.preventDefault();
    setActiveProgressStage("payment-form");
    setActiveCheckoutForm("payment-form");
});

const paymentFormSubmitButton = document.querySelector(
    ".payment-form-submit-button"
);
paymentFormSubmitButton.addEventListener("click", (e) => {
    const paymentForm = paymentFormSubmitButton.closest("form");
    if (!paymentForm.checkValidity()) {
        return;
    }
    e.preventDefault();

    if (!validatePaymentForm()) {
        return;
    }

    renderOrderReview();
    setActiveProgressStage("review-form");
    setActiveCheckoutForm("review-form");
});

const reviewFormSubmitButton = document.querySelector(
    ".review-form-submit-button"
);

reviewFormSubmitButton.addEventListener("click", () => {
    if (!validatePaymentForm()) {
        notify("warning", "Payment form data invalid");
        return;
    }
    const name = document.querySelector(".address-name-input").value;
    const address = activeUser.address;
    if (
        !createOrder(activeUserCart, name, address)
        //This checks if the order was created successfully
    ) {
        console.log("returns");
        return;
    }
    clearActiveUsersCart();
    notify("success", "Order Submitted");
    navigateTo("./profile.html", 2000);
});

const cardNumberInput = document.querySelector(".card-number-input");
const expiryDateInput = document.querySelector(".expiry-date-input");
const cvvInput = document.querySelector(".cvv-input");
function validatePaymentForm() {
    const cardNumber = formatString(cardNumberInput.value);
    const expiryDate = formatString(expiryDateInput.value);
    const cvv = formatString(cvvInput.value);

    if (cardNumber.length < 12) {
        notify("warning", "Card number too short");
        return;
    }

    if (cardNumber.length > 21) {
        notify("warning", "Card number too long");
        return;
    }

    if (expiryDate.length < 4 || expiryDate.length > 7) {
        notify("warning", "invalid expiry date");
        return;
    }

    if (cvv.length !== 3) {
        notify("warning", "Invalid CVV");
        return;
    }

    return true;
}

cardNumberInput.addEventListener("keydown", (e) => {
    if (cardNumberInput.value.length >= 21 && e.key !== "Backspace") {
        e.preventDefault();
        return;
    }
});
expiryDateInput.addEventListener("keydown", (e) => {
    if (expiryDateInput.value.length >= 7 && e.key !== "Backspace") {
        e.preventDefault();
        return;
    }
});
cvvInput.addEventListener("keydown", (e) => {
    if (cvvInput.value.length >= 3 && e.key !== "Backspace") {
        e.preventDefault();
        return;
    }
});

function renderOrderReview() {
    const receiverNameInput = document.querySelector(".address-name-input");
    const receiverName = document.querySelector(".order-receiver-name");
    const receiverAddress = document.querySelector(".order-receiver-address");

    receiverName.textContent = receiverNameInput.value;
    receiverAddress.textContent = `${activeUser.address.street},${activeUser.address.city},${activeUser.address.postalCode},${activeUser.address.country}`;
}
renderOrderReview();

const productsList = document.querySelector(".products-list");
function renderCheckoutSummary() {
    const summariesContainer = document.querySelector(".summaries-container");
    const cartTotal = calculateCartTotal(activeUserCart);
    summariesContainer.innerHTML = `
        <div class="order-summary-price-field-container">
            <div class="price-title">subtotal:</div>
            <div class="price-value">$${cartTotal.toFixed(2)}</div>
        </div>
        <div class="order-summary-price-field-container">
            <div class="price-title">shipping:</div>
            <div class="price-value">free</div>
        </div>
        <div class="order-summary-price-field-container">
            <div class="price-title">tax:</div>
            <div class="price-value">$0</div>
        </div>
        <div class="order-summary-price-field-container">
            <div class="price-title">total:</div>
            <div class="price-value order-total">$${cartTotal.toFixed(2)}</div>
        </div>
    `;

    productsList.innerHTML = "";
    activeUserCart.forEach((cartItem) => {
        const product = getProduct(cartItem.id);
        const productImage = getProductImage(product);
        productsList.innerHTML += `
            <div class="order-summary-product-container" data-id="${product.id}">
                <div class="product-image">
                    <img src="../../../${productImage}" alt="">
                </div>
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                </div>
            </div>
        `;
    });
}

renderCheckoutSummary();

productsList.addEventListener("click", (e) => {
    if (!e.target.closest(".order-summary-product-container")) {
        return;
    }
    const productElem = e.target.closest(".order-summary-product-container");
    const productId = Number(productElem.dataset.id);
    const product = getProduct(productId);
    viewProduct(product);
});
