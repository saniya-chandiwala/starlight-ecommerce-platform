$(document).ready(function () {

    $.ajax({
        type: "GET",
        url: "http://localhost:56642/api/Product",

        success: function (response) {

            if (document.getElementById("necklaceContainer")) {
                let products = response.filter(x => x.CategoryID == 1);
                displayProducts("necklaceContainer", products);
            }

            if (document.getElementById("earringContainer")) {
                let products = response.filter(x => x.CategoryID == 2);
                displayProducts("earringContainer", products);
            }

            if (document.getElementById("ringContainer")) {
                let products = response.filter(x => x.CategoryID == 3);
                displayProducts("ringContainer", products);
            }

            if (document.getElementById("braceletContainer")) {
                let products = response.filter(x => x.CategoryID == 4);
                displayProducts("braceletContainer", products);
            }
        },

        error: (err) => {
            alert(err);
            console.log(err);
        }
    });

});

function displayProducts(elementId, data) {
    let container = document.getElementById(elementId);
    let htmlContent = "";

    data.forEach((product) => {

        if (product.ProductQty == 0) {

            htmlContent += `
                <div class="product-card out-of-stock">

                    <div class="product-image-wrap">

                        <span class="stock-badge">Out of Stock</span>

                        <img src="${product.ProductImg}" alt="${product.ProductName}">

                        <div class="slider-indicator-track">
                            <div class="slider-indicator-bar"></div>
                        </div>

                    </div>

                    <div class="product-meta">
                        <h3>${product.ProductName}</h3>

                        <p class="product-desc">
                            ${product.ProductDesc}
                        </p>

                        <p class="product-price">
                            ₹ ${product.ProductPrice.toLocaleString('en-IN')}
                        </p>

                        <button type="button" class="add-cart-btn" disabled>
                            Sold Out
                        </button>
                    </div>

                </div>
            `;

        }
        else {

            htmlContent += `
                <div class="product-card">

                    <div class="product-image-wrap">

                        <img src="${product.ProductImg}" alt="${product.ProductName}">

                        <div class="slider-indicator-track">
                            <div class="slider-indicator-bar"></div>
                        </div>

                    </div>

                    <div class="product-meta">
                        <h3>${product.ProductName}</h3>

                        <p class="product-desc">
                            ${product.ProductDesc}
                        </p>

                        <p class="product-price">
                            ₹ ${product.ProductPrice.toLocaleString('en-IN')}
                        </p>

                        <button class="add-cart-btn"
                            onclick='addToCart(${JSON.stringify(product)})'>
                            Add To Cart
                        </button>
                    </div>

                </div>
            `;

        }
    });

    container.innerHTML = htmlContent;
}