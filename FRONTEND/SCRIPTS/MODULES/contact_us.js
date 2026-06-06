import { addNewTicket } from "../../../BACKEND/DATA/tickets.js";
import { activeUser } from "../../../BACKEND/DATA/user.js";
import dayjs from "https://cdn.jsdelivr.net/npm/dayjs@1.11.13/+esm";
import { notify } from "./notifyUser.js";
import { formatString } from "../UTILS/format.js";

const contactUsForm = document.querySelector("#contact-us-form");
function sendTicket() {}

const formSubmitButton = document.querySelector(".send-message-btn");
formSubmitButton.addEventListener("click", (e) => {
    if (!contactUsForm.checkValidity()) {
        return;
    }
    e.preventDefault();
    const ticketName = document.querySelector(".ticket-name").value;
    const ticketEmail = document.querySelector(".ticket-email").value;
    const ticketCategory = document.querySelector(".ticket-category").value;
    const ticketMessage = formatString(
        document.querySelector(".ticket-message").value
    );
    const ticketDate = dayjs();

    if (ticketMessage === "") {
        notify("warning", "Invalid ticket message");
        return;
    }

    if (ticketMessage.length < 12) {
        notify("warning", "Message too short");
        return;
    }

    const newTicket = {
        name: ticketName,
        email: ticketEmail,
        category: ticketCategory,
        message: ticketMessage,
        date: ticketDate,
        status: "pending"
    };

    addNewTicket(newTicket);
    clearContactUsForm();
    notify("success", "Report submitted");
});

function populateContactUsForm() {
    const ticketNameElem = document.querySelector(".ticket-name");
    const ticketEmailElem = document.querySelector(".ticket-email");

    ticketNameElem.value = activeUser.username;
    ticketEmailElem.value = activeUser.email;

    ticketNameElem.setAttribute("readonly", "");
    ticketEmailElem.setAttribute("readonly", "");
}

function clearContactUsForm() {
    const ticketCategoryElem = document.querySelector(".ticket-category");
    const ticketMessageElem = document.querySelector(".ticket-message");

    ticketCategoryElem.value = "general-inquiry";
    ticketMessageElem.value = "";
}

populateContactUsForm();
