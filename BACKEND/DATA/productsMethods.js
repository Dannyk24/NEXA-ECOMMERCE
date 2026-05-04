import { productsImages } from "./productsImages.js";
import { products } from "./products.js";
import { generateRandomIndex } from "../../FRONTEND/SCRIPTS/UTILS/generate.js";

export function getProductStockCondition(product) {
    const stockAmount = product.stockAmount;
    let stockCondition;
    if (stockAmount === 0) {
        stockCondition = "out of stock";
    } else if (stockAmount > 40) {
        stockCondition = "in stock";
    } else if (stockAmount <= 40 && stockAmount > 15) {
        stockCondition = "few units left";
    } else if (stockAmount <= 15 && stockAmount >= 1) {
        stockCondition = `${product.stockAmount} units left`;
    }
    return stockCondition;
}

export function checkDuplicateProduct(product, array) {
    if (array.length === 0) {
        return false;
    }
    const duplicateProduct = array.find(
        (arrayProduct) => arrayProduct.id === product.id
    );
    return duplicateProduct;
}

export function getProductImage(product) {
    const imageObject = productsImages.find(
        (imageObject) => imageObject.id === product.id
    );
    return imageObject.images[0];
}
export function getRandomProduct() {
    return products[generateRandomIndex(products)];
}
export function getStockConditionColourClass(product) {
    const productStockCondition = getProductStockCondition(product);
    let stockConditionColourClass;
    if (productStockCondition === "in stock") {
        stockConditionColourClass = "in-stock";
    } else if (productStockCondition === "few units left") {
        stockConditionColourClass = "few-units-left";
    } else if (productStockCondition === `${product.stockAmount} units left`) {
        stockConditionColourClass = "number-stock";
    } else {
        stockConditionColourClass = "out-of-stock";
    }
    return stockConditionColourClass;
}
export function setActiveViewingProduct(product) {
    localStorage.setItem("active-viewing-product", JSON.stringify(product));
}
export function getActiveViewingProduct(product) {
    return JSON.parse(localStorage.getItem("active-viewing-product"));
}
