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

    profileAvatar.textContent = activeUser.username[0]; //Use first letter
    username.textContent = activeUser.username;
    email.textContent = activeUser.email;
    phoneNumber.textContent = activeUser.phoneNumber || "null";
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
