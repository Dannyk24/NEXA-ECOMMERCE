import { activeUser } from "./user.js";
import { getCurrentDate } from "../../FRONTEND/SCRIPTS/UTILS/date.js";
import { notify } from "../../FRONTEND/SCRIPTS/MODULES/notifyUser.js";
import { calculateCartTotal } from "./carts.js";
import dayjs from "https://cdn.jsdelivr.net/npm/dayjs@1.11.13/+esm";
import { navigateTo } from "../../FRONTEND/SCRIPTS/MODULES/navigation.js";

export const userOrders = getUserOrders(); //Stores orders for all users

export let activeUserOrders = getActiveUserOrders(); //Hold active users orders

function getUserOrders() {
    return JSON.parse(localStorage.getItem("user-orders")) || [];
}
function getActiveUserOrders() {
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
    if (!activeUser.id) {
        return;
    }
    const orderObject = {
        id: activeUser.id,
        orders: []
    };
    userOrders.push(orderObject);
    saveUserOrders();
}
export function saveUserOrders() {
    localStorage.setItem("user-orders", JSON.stringify(userOrders));
}

function generateOrderId(cart) {
    let orderId = 0;
    cart.forEach((cartItem) => {
        orderId += cartItem.id;
    });
    return orderId;
}

function checkDuplicateOrders(newOrder) {
    const matchingOrder = activeUserOrders.find(
        (order) => order.id === newOrder.id && order.status !== "cancelled"
    );
    return matchingOrder;
}

export function createOrder(cart, name, address) {
    const total = calculateCartTotal(cart);
    const orderDate = dayjs();
    const shippedDate = orderDate.add(6, "hour");
    const deliveryDate = orderDate.add(24, "hour");
    const orderId = generateOrderId(cart);
    cart.forEach((cartItem) => {
        //Attach the order id to each product
        cartItem.orderId = orderId;
    });

    const newOrder = {
        id: orderId,
        total: total,
        orderDate: orderDate,
        shippedDate: shippedDate,
        deliveryDate: deliveryDate,
        name: name,
        address: address,
        products: cart,
        status: "pending"
    };

    if (checkDuplicateOrders(newOrder)) {
        notify("warning", "Duplicate order found");
        return;
    }
    activeUserOrders.push(newOrder);
    saveUserOrders();
    return true;
}

export function updateOrders() {
    activeUserOrders.forEach((order) => {
        if (order.status === "cancelled" || order.status === "delivered") {
            return;
        }
        const now = dayjs();
        const orderDate = dayjs(order.orderDate);
        const shippedDate = dayjs(order.shippedDate);
        const deliveryDate = dayjs(order.deliveryDate);
        if (now > orderDate.add(10, "minute") && now < shippedDate) {
            order.status = "confirmed";
        } else if (now >= shippedDate && now < deliveryDate) {
            order.status = "shipped";
        } else if (now >= deliveryDate) {
            order.status = "delivered";
        }
    });
    saveUserOrders();
}

export function getOrder(id) {
    const order = activeUserOrders.find((orderObject) => orderObject.id === id);
    return order;
}

export function cancelOrder(id) {
    const order = activeUserOrders.find((orderObject) => orderObject.id === id);
    if (!order) {
        notify("danger", "Invalid order");
        return;
    }
    order.status = "cancelled";
    saveUserOrders();
    return true;
}

export function setActiveViewingOrder(order) {
    localStorage.setItem("active-viewing-order", JSON.stringify(order));
}
export function getActiveViewingOrder() {
    return JSON.parse(localStorage.getItem("active-viewing-order"));
}
export function viewOrder(order) {
    setActiveViewingOrder(order);
    navigateTo("../../PAGES/USER/order_view.html", 0);
}
