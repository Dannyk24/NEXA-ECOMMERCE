import { productsImages } from "./productsImages.js";
import { products } from "./products.js";

export function getProductStockCondition(product) {
    const stockAmount = [product.stockAmount];
    let stockCondition;
    if (stockAmount === 0) {
        stockCondition = "out of stock";
    } else if (stockAmount > 40) {
        stockCondition = "in stock";
    } else if (stockAmount < 40 && stockAmount > 15) {
        stockCondition = "few units left";
    } else if (stockAmount <= 15 && stockAmount >= 1)
        stockCondition = `${product.stockAmount} units left`;

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
