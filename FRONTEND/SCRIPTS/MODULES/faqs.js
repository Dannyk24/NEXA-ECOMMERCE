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
