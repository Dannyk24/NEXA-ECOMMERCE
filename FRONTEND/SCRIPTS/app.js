//GENERAL NAVIGATION
/*====HELPERS====*/
function setActiveNavItem(navItem) {
    navItems.forEach((item) => {
        item.classList.toggle(
            "active-nav-item",
            item.dataset.section === navItem.dataset.section
        ); /*Toggle takes a force parameter that adds the class if the condition returns true and removes it if the condition returns false*/
    });
}
function scrollSectionIntoView(section) {
    section.scrollIntoView({
        behavior: "smooth"
    });
}

const navItemsContainer = document.querySelector("nav");
const navItems = document.querySelectorAll(".nav-item");
const sections = document.querySelectorAll(".js-main-sections");
navItemsContainer.addEventListener("click", (e) => {
    if (!e.target.classList.contains("nav-item")) {
        return;
    }
    const navItem = e.target;
    const sectionsArray = Array.from(sections); //Convert sections nodelist to array to gain access to the find method
    const matchingSection = sectionsArray.find(
        (section) => section.dataset.section === navItem.dataset.section
    );
    setActiveNavItem(navItem);
    scrollSectionIntoView(matchingSection);
});

const contactUsCta = document.querySelector("#contact-us-cta");
contactUsCta.addEventListener("click", (e) => {
    e.preventDefault(); //Prevent default behaviour cause contact us cta is an anchor tag
    scrollSectionIntoView(
        document.querySelector("#contact-us-section")
    ); /*Pass contact us section html element as the arguement*/
});

//Automatic nvaigation switching logic
const observer = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const sectionElem = entry.target;
                const navItemsArray =
                    Array.from(
                        sections
                    ); /*convert navItems collection from nodelist toarray to access find method*/
                const matchingNavItem = navItemsArray.find(
                    (item) =>
                        item.dataset.section === sectionElem.dataset.section
                ); /*Compare data section values to find matching nav item then call setActive function on it*/
                setActiveNavItem(matchingNavItem);
            }
        });
    },
    {
        threshold: 0.1 /*Only activate when 10% of the section is visible*/
    }
);
sections.forEach((section) => {
    observer.observe(section);
}); /*The observe method only takes one dom element and cant take an array so we loop through each section and call an instance of the observer class*/

//MOBILE NAVIGATION
/*=====HELPERS=====*/
function openNav() {
    nav.classList.add("nav-active");
}

function openOverlay() {
    overlay.classList.add("overlay-active");
}

function blockUserScrolling() {
    document.body.style.overflow = "hidden";
}

function closeNav() {
    nav.classList.remove("nav-active");
}
function closeOverlay() {
    overlay.classList.remove("overlay-active");
}
function restoreUserScrolling() {
    document.body.style.overflow = "auto";
}

const toggleBtn = document.querySelector(".menu-toggle-mobile");
const nav = document.querySelector("nav");
const overlay = document.querySelector(".overlay");

toggleBtn.addEventListener("click", () => {
    openNav();
    openOverlay();
    blockUserScrolling();
});
overlay.addEventListener("click", () => {
    closeNav();
    closeOverlay();
    restoreUserScrolling();
});

//DESKTOP HOME SECTION SLIDESHOW
/*=====HELPERS=====*/
const slideShowImages = document.querySelectorAll(".slideshow-images");
function generateRandomIndex() {
    let index = Math.floor(Math.random() * slideShowImages.length);
    return index;
}
function pickNewSlideShowImage() {
    newImageElem = slideShowImages[generateRandomIndex()];
    return newImageElem;
}
function setNewSlideShowImage() {
    slideShowImages.forEach((image) => {
        image.classList.remove("active-slideshow-image");
    });
    newImageElem.classList.add("active-slideshow-image");
}

let lastImageElem; //Stores last slideshow element
setInterval(() => {
    let newImageElem = pickNewSlideShowImage(); //Pick a new image first
    while (newImageElem === lastImageElem) {
        //Check if its the same as the old one
        pickNewSlideShowImage(); //If it is, pick again
    }
    setNewSlideShowImage(); //If it isnt, set it as the new image
}, 3000);

//FAQ's SECTION LOGIC
/*=====HELPERS=====*/
function expandFaq(faq) {
    const plusIcon = faq.querySelector(".fa-plus");
    faq.classList.add("faq-active");
    plusIcon.classList.remove("fa-plus");
    plusIcon.classList.add("fa-minus");
}
function collapseFaq(faq) {
    const minusIcon = faq.querySelector(".fa-minus");
    faq.classList.remove("faq-active");
    minusIcon.classList.remove("fa-minus");
    minusIcon.classList.add("fa-plus");
}

const faqsContainer = document.querySelector(".faqs-container");
faqsContainer.addEventListener("click", (e) => {
    //Use event delegation by adding the event listener to the faq's general container
    const faq = e.target.closest(".faq-container");
    if (e.target.classList.contains("fa-plus")) {
        expandFaq(faq);
    } else if (e.target.classList.contains("fa-minus")) {
        collapseFaq(faq);
    }
    //Check if faq toggle icon is plus, if it is,open it. if its minus,collapse the faq
});
