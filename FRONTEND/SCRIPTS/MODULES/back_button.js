const backBtn = document.querySelector(".back-button");
backBtn.addEventListener("click", (e) => {
    if (history.length > 0) {
        e.preventDefault();
        history.back();
    }
}); //Check if theres a previous page in te browser history, if there is, go back to it, if there isnt, the default action is triggered which takes the user back to the homepage
