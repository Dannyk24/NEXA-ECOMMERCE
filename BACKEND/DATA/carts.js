import { activeUser } from "./user.js";

export const userCarts = getUserCarts(); //Stores carts for all users

export let activeUserCart = getActiveUserCart(); //Hold active users cart

function getUserCarts() {
    return JSON.parse(localStorage.getItem("user-carts")) || [];
}
function getActiveUserCart() {
    let cartObject;
    if (
        !userCarts.find((userCartObject) => userCartObject.id === activeUser.id)
    ) {
        createCartObject();
    }
    cartObject = userCarts.find(
        (userCartObject) => userCartObject.id === activeUser.id
    );
    return cartObject.cart;
}
function createCartObject() {
    const cartObject = {
        id: activeUser.id,
        cart: []
    };
    userCarts.push(cartObject);
    saveUserCarts();
}
function saveUserCarts() {
    localStorage.setItem("user-carts", JSON.stringify(userCarts));
}

export function addToCart(product, quantity) {
    //Every cart item only stores the product id and its quantity
    //addToCart() also handles matching product check logic
    const matchingProduct = checkMatchingCartItem(product.id);
    if (matchingProduct) {
        matchingProduct.quantity += quantity;
    } else {
        const newCartItem = {
            id: product.id,
            quantity: quantity
        };
        activeUserCart.push(newCartItem);
    }
    saveUserCarts();
}

export function checkMatchingCartItem(productid) {
    const matchingProduct = activeUserCart.find(
        (product) => product.id === productid
    );
    return matchingProduct;
}
