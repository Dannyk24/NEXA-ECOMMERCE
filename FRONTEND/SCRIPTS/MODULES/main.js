import { updateOrders } from "../../../BACKEND/DATA/orders.js";
import { activeUser } from "../../../BACKEND/DATA/user.js";

if (!activeUser.id) {
    document.body.innerHTML = "YOU MUST BE AUTHENTICATED TO VIEW THIS PAGE";
}
updateOrders();
