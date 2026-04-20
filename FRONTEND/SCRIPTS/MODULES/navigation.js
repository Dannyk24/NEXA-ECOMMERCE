const navItems = document.querySelectorAll(".nav-item");
export function setActiveNavItem(navItem) {
    navItems.forEach((item) => {
        item.classList.toggle(
            "active-nav-item",
            item.dataset.section === navItem.dataset.section
        ); /*Toggle takes a force parameter that adds the class if the condition returns true and removes it if the condition returns false*/
    });
}
export function scrollSectionIntoView(section) {
    section.scrollIntoView({
        behavior: "smooth"
    });
}

export function navigateTo(location) {
    window.location.href = location;
}
