import { activeUser } from "./user.js";
import { getCurrentDate } from "../../FRONTEND/SCRIPTS/UTILS/date.js";
import { notify } from "../../FRONTEND/SCRIPTS/MODULES/notifyUser.js";

export const userOrders = getUserOrders(); //Stores orders for all users

export let activeUserOrders = getActiveUserOrders(); //Hold active users orders

function getUserOrders() {
    return JSON.parse(localStorage.getItem("user-orders")) || [];
}
function getActiveUserOrder() {
    let orderObject;
    if (
        !userOrders.find(
            (userOrderObject) => userOrderObject.id === activeUser.id
        )
    ) {
        createOrderObject();
    }
    orderObject = userOrders.find(
        (userOrderObject) => userOrderObject.id === activeUser.id
    );
    return orderObject.orders;
}
function createOrderObject() {
    const orderObject = {
        id: activeUser.id,
        orders: []
    };
    userOrders.push(orderObject);
    saveUserOrders();
}
export function saveUserCarts() {
    localStorage.setItem("user-orders", JSON.stringify(userOrders));
}

function createOrder(cart, total) {
    const orderDate = getCurrentDate();
    const newOrder = {
        total: total,
        date: orderDate,
        products: cart
    };

    activeUserOrders.push(newOrder);
    saveUserOrders();
}
