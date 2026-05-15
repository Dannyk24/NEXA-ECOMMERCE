import {
    openOverlay,
    closeOverlay,
    blockUserScrolling,
    restoreUserScrolling
} from "./overlay.js";

export function openModal(modalId) {
    const modal = document.querySelector(`#${modalId}`);
    modal.classList.add("modal-active");
    openOverlay();
    blockUserScrolling();
}
export function closeModal(modalId) {
    const modal = document.querySelector(`#${modalId}`);
    modal.classList.remove("modal-active");
    closeOverlay();
    restoreUserScrolling();
}
