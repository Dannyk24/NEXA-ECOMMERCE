import { notify } from "../../FRONTEND/SCRIPTS/MODULES/notifyUser.js";
import { activeUser } from "./user.js";

export const userWishlists = getUserWishlists(); //Stores wishlists for all users

export let activeUserWishlist = getActiveUserWishlist(); //Hold active users wishlist

function getUserWishlists() {
    return JSON.parse(localStorage.getItem("user-wishlists")) || [];
}
function getActiveUserWishlist() {
    let wishlistObject;
    if (
        !userWishlists.find(
            (userWishlistObject) => userWishlistObject.id === activeUser.id
        )
    ) {
        createWishlistObject();
    }
    wishlistObject = userWishlists.find(
        (userWishlistObject) => userWishlistObject.id === activeUser.id
    );
    return wishlistObject.wishlist;
}
function createWishlistObject() {
    if (!activeUser.id) {
        return;
    }
    const wishlistObject = {
        id: activeUser.id,
        wishlist: []
    };
    userWishlists.push(wishlistObject);
    saveUserWishlists();
}
export function saveUserWishlists() {
    localStorage.setItem("user-wishlists", JSON.stringify(userWishlists));
}

export function addToWishlist(product) {
    //Every wishlist item only stores the product id
    //addToWishlist() also handles matching product check logic
    const matchingProduct = checkMatchingWishlistItem(product.id);
    if (matchingProduct) {
        notify("warning", "Product already in wishlist");
        return;
    } else {
        const newWishlistItem = {
            id: product.id
        };
        activeUserWishlist.push(newWishlistItem);
        notify("success", "Product added to wishlist");
    }
    saveUserWishlists();
}

export function checkMatchingWishlistItem(productid) {
    const matchingProduct = activeUserWishlist.find(
        (product) => product.id === productid
    );
    return matchingProduct;
}
