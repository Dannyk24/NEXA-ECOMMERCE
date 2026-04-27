const overlay = document.querySelector(".overlay");
export function openOverlay() {
    overlay.classList.add("overlay-active");
}

export function blockUserScrolling() {
    document.body.style.overflow = "hidden";
}
export function closeOverlay() {
    overlay.classList.remove("overlay-active");
}
export function restoreUserScrolling() {
    document.body.style.overflow = "auto";
}
