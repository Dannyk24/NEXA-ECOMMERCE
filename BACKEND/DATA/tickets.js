import { activeUser } from "./user.js";
import { notify } from "../../FRONTEND/SCRIPTS/MODULES/notifyUser.js";
import dayjs from "https://cdn.jsdelivr.net/npm/dayjs@1.11.13/+esm";

export const userTickets = getUserTickets(); //Stores tickets from all users

export let activeUserTickets = getActiveUserTickets(); //Hold active users tickets

function getUserTickets() {
    return JSON.parse(localStorage.getItem("user-tickets")) || [];
}
function getActiveUserTickets() {
    let ticketObject;
    if (
        !userTickets.find(
            (userTicketObject) => userTicketObject.id === activeUser.id
        )
    ) {
        createTicketObject();
    }
    ticketObject = userTickets.find(
        (userTicketObject) => userTicketObject.id === activeUser.id
    );
    return ticketObject.tickets;
}
function createTicketObject() {
    if (!activeUser.id) {
        return;
    }
    const ticketObject = {
        id: activeUser.id,
        tickets: []
    };
    userTickets.push(ticketObject);
    saveUserTickets();
}
function saveUserTickets() {
    localStorage.setItem("user-tickets", JSON.stringify(userTickets));
}

export function addNewTicket(ticket) {
    activeUserTickets.push(ticket);
    saveUserTickets();
}
