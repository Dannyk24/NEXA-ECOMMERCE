import { capitalize } from "../UTILS/format.js";

let timeoutId;
export function notfiy(type, message) {
    const notifyContainer = document.querySelector(".toast-container");
    notifyContainer.classList.add(`${type}-toast`); //Add dynamic toast type
    notifyContainer.classList.add("toast-active"); //Make toast visible

    const toastHeader = notifyContainer.querySelector(".toast-header");
    toastHeader.textContent = capitalize(type);

    const toastMessage = notifyContainer.querySelector(".toast-message");
    toastMessage.textContent = message;

    const toastIconContainer = notifyContainer.querySelector(".toast-icon");
    const toastIcon = toastIconContainer.querySelector("i");
    let toastIconClass;
    toastIcon.classList.remove("fa-check"); //Remove default success icon
    if (type === "success") {
        toastIconClass = "fa-check";
    } else if (type === "danger") {
        toastIconClass = "fa-bug";
    } else if (type === "warning") {
        toastIconClass = "fa-exclamation";
    }
    toastIcon.classList.add(toastIconClass);

    if (timeoutId) {
        /*Debounce the toast before making it visible to avoid weird behaviour*/
        clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
        notifyContainer.classList.remove("toast-active");
        notifyContainer.classList.remove(`${type}-toast`);
    }, 4000);
}
