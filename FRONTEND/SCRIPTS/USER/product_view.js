import { getActiveViewingProduct } from "../../../BACKEND/DATA/productsMethods.js";
import { productsImages } from "../../../BACKEND/DATA/productsImages.js";
import { products } from "../../../BACKEND/DATA/products.js";
import {
    productsReviews,
    saveProductReviews
} from "../../../BACKEND/DATA/productsReviews.js";
import {
    getProductStockCondition,
    getStockConditionColourClass
} from "../../../BACKEND/DATA/productsMethods.js";
import {
    openOverlay,
    closeOverlay,
    blockUserScrolling,
    restoreUserScrolling
} from "../MODULES/overlay.js";
import { calculatePercentage, capitalize } from "../UTILS/format.js";
import { formatString } from "../UTILS/format.js";
import { notfiy } from "../MODULES/notifyUser.js";
import { activeUser } from "../../../BACKEND/DATA/user.js";

const activeViewingProductContainer = document.querySelector(
    ".active-viewing-product-container"
);
const activeProduct = getActiveViewingProduct();
const imagesObject = productsImages.find(
    (imageObject) => imageObject.id === activeProduct.id
);
const activeProductImages = imagesObject.images;
const reviewsObject = productsReviews.find(
    (reviewObject) => reviewObject.id === activeProduct.id
);
const activeProductReviews = reviewsObject.reviews;

activeViewingProductContainer.innerHTML = `
    <div class="product-details-container">
        <div class="left">
            <div class="top active-image-container">
                <img src="" alt="" class = "active-image">
            </div>
            <div class="bottom products-images-container">
            </div>
        </div>
        <div class="right" class = "product-details-container-js">
            <div class="product-edition"></div>
            <div class="product-name"></div>
            <div class="product-price"></div>
            <div class="product-seller-name"></div>
            <div class="product-description"></div>
            <div class="no-of-product-reviews"><span class="no-of-product-reviews-number">0</span> reviews</div>
            <div class="product-stock-condition"></div>
            <div class="product-quantity-selector-container">
                <i class="fas fa-minus"></i>
                <span class="product-quantity">1</span>
                <i class="fas fa-plus"></i>
            </div>
            <div class="cta-container">
                <div class="cta primary-cta add-to-cart-button">
                    add to cart <i class="fas fa-shopping-cart"></i>
                </div>
                <div class="cta secondary-cta add-to-wishlist-button">
                    <i class="far fa-heart"></i>
                </div>
            </div>
            <div class="product-assurances-container">
                <div class="product-assurance">
                    <div class="left"><i class="fas fa-truck"></i></div>
                    <div class="right">
                        <p class="assurance-header">fast shipping</p>
                        <span class="assurance-description">2-3 business days delivery</span>
                    </div>
                </div>
                <div class="product-assurance">
                    <div class="left"><i class="fas fa-shield-alt"></i></div>
                    <div class="right">
                        <p class="assurance-header">2-Year warranty</p>
                        <span class="assurance-description">full hardware coverage</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <section id="product-reviews">
        <div class="top">
            <p class="product-reviews-section-header">customer reviews</p>
            <div class="product-reviews-container">
            </div>
            <div class="cta alternate-cta write-a-review-cta">write a review</div>
        </div>
        <div class="bottom user-reviews-container">
            
        </div>
    </section>
`;
const productImagesContainer = document.querySelector(
    ".products-images-container"
); //Get all html elements are populating page with layout template first

/*====HELPERS=====*/
function setActiveImage(image) {
    const activeImage = document.querySelector(".active-image");
    activeImage.src = `../../../${image}`;
}
function setProductImages() {
    activeProductImages.forEach((image, index) => {
        productImagesContainer.innerHTML += `
            <div class="product-image-container">
                <img src="../../../${image}" alt="" data-index="${index}">
            </div>
        `;
    });
}
function generateUserReviewHtml(review) {
    const html = `
        <div class="user-review-container">
            <div class="user-review-star-count-container">
                <img src="../../ASSETS/IMAGES/ratings/rating-${review.stars * 10}.png" alt="">
            </div>
            <div class="user-review-username-container">
                <span class="user-review-username">${review.name}</span>
                <span class="verified-purchase-badge">
                    <i class="far fa-check-circle"></i>
                    <span>verified purchase</span>
                </span>
            </div>
            <div class="user-review-text">${review.text}</div>
        </div>
    `;
    return html;
}

function generateUserReviewsBreakdownHtml(index, reviewPercentage) {
    const html = `
            <div class="product-review-container" data-star-count="${index}">
                <div class="no-of-stars">${index} stars</div>
                <div class="review-percentage-container">
                    <div class="review-percentage"></div>
                </div>
                <div class="review-percentage-number">${reviewPercentage}%</div>
            </div>
        `;
    return html;
}

function renderProductImages() {
    const firstProductImage = activeProductImages[0];
    setActiveImage(firstProductImage);
    setProductImages();
}
function renderProductDetails() {
    const productEdition = document.querySelector(".product-edition");
    const productName = document.querySelector(".product-name");
    const productPrice = document.querySelector(".product-price");
    const productSellerName = document.querySelector(".product-seller-name");
    const productDescription = document.querySelector(".product-description");
    const productReviewsCount = document.querySelector(
        ".no-of-product-reviews-number"
    );
    const productStockCondition = document.querySelector(
        ".product-stock-condition"
    );

    productEdition.textContent = `${activeProduct.edition} edition`;
    productName.textContent = activeProduct.name;
    productPrice.textContent = `$${activeProduct.price.toFixed(2)}`;
    productSellerName.textContent = activeProduct.sellerName;
    productDescription.textContent = activeProduct.description;
    productReviewsCount.textContent = activeProductReviews.length;
    productStockCondition.textContent = getProductStockCondition(activeProduct);
    productStockCondition.classList.add(
        getStockConditionColourClass(activeProduct)
    );
}
function renderUserReviewsBreakdown() {
    const productReviewsContiainer = document.querySelector(
        ".product-reviews-container"
    );
    productReviewsContiainer.innerHTML = "";
    for (let i = 5; i > 0; i--) {
        const index = i;
        const reviewsArray = activeProductReviews.filter(
            (review) => review.stars === index
        ); //Convert to array to access the find() method
        const reviewsLength = reviewsArray.length;
        const totalReviewsLength = activeProductReviews.length;
        let reviewPercentage = Math.round(
            calculatePercentage(reviewsLength, totalReviewsLength)
        ); //Round up percentage to avoid values like 66.6667676
        if (!reviewPercentage) {
            reviewPercentage = 0;
        } //Check if review percentage is NAN when there are no user reviews

        productReviewsContiainer.innerHTML += generateUserReviewsBreakdownHtml(
            index,
            reviewPercentage
        );
        const reviewContainers = document.querySelectorAll(
            ".product-review-container"
        );
        const reviewContainerArray = Array.from(reviewContainers);
        const reviewContainer = reviewContainerArray.find(
            (container) => Number(container.dataset.starCount) === index //Typecast as number to use strict equality
        );
        const reviewPercentageElem =
            reviewContainer.querySelector(".review-percentage");
        reviewPercentageElem.style.width = `${reviewPercentage}%`;
    }
}

function renderUserReviews() {
    const userReviewsContainer = document.querySelector(
        ".user-reviews-container"
    );
    userReviewsContainer.innerHTML = "";
    if (activeProductReviews.length === 0) {
        userReviewsContainer.textContent = "No reviews avaible at this time";
        return;
    }
    activeProductReviews.forEach((review) => {
        userReviewsContainer.innerHTML += generateUserReviewHtml(review);
    });
    //Multiply star number by 10 to match with image filepath
}

productImagesContainer.addEventListener("click", (e) => {
    const imageContainer = e.target.closest(".product-image-container");
    if (!imageContainer) {
        return;
    }
    const image = imageContainer.querySelector("img");
    const imageIndex = image.dataset.index;
    setActiveImage(activeProductImages[imageIndex]); //Use index data attribute to set the active image by its position in the activeProductImages array
});

const overlay = document.querySelector(".overlay");
const reviewCta = document.querySelector(".write-a-review-cta");
const reviewModal = document.querySelector("#write-a-review-modal");
const modalCloseButton = document.querySelector(".modal-close-button");
const modalSubmitButton = document.querySelector(".modal-submit-button");
const starsInputElem = reviewModal.querySelector(".stars-count-input");
const reviewTextInputElem = reviewModal.querySelector(".review-text-input");

function openReviewModal() {
    reviewModal.classList.add("primary-modal-active");
    overlay.classList.add("overlay-active");
    blockUserScrolling();
}
function closeReviewModal() {
    closeOverlay();
    reviewModal.classList.remove("primary-modal-active");
    restoreUserScrolling();
}

reviewCta.addEventListener("click", () => {
    openReviewModal();
});
overlay.addEventListener("click", () => {
    closeReviewModal();
});
modalCloseButton.addEventListener("click", () => {
    closeReviewModal();
});
modalSubmitButton.addEventListener("click", (e) => {
    const reviewStars = formatString(starsInputElem.value);
    const reviewText = formatString(reviewTextInputElem.value);
    if (!reviewModal.checkValidity()) {
        return;
    }
    e.preventDefault();
    if (Number(reviewStars) <= 0 || Number(reviewStars) >= 6) {
        notfiy("warning", "Invalid stars count");
        return;
    }
    if (reviewText.length < 10) {
        notfiy("warning", "Review too short");
        return;
    }

    const stars = Number(reviewStars);
    const name = capitalize(activeUser.username);
    const text = reviewText;
    const newReview = {
        stars,
        name,
        text
    };
    activeProductReviews.push(newReview);
    saveProductReviews();
    closeReviewModal();
    notfiy("success", "Review Added");
    renderUserReviewsBreakdown();
    renderUserReviews();
});

renderProductImages();
renderProductDetails();
renderUserReviewsBreakdown();
renderUserReviews();
