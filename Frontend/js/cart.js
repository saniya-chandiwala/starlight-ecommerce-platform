
// Get cart 
function getCart(callback) {
    let user = JSON.parse(localStorage.getItem("loggedInUser"));

    $.ajax({
        type: "GET",
        url: "http://localhost:56642/api/Cart/" + user.UserID,

        success: (response) => {
            callback(response);
        },

        error: (err) => {
            alert(err);
            console.log((err));
        }
    })
}


// Add to cart
function addToCart(product) {
    let user = JSON.parse(localStorage.getItem("loggedInUser"));

    // User is not logged in
    if (user === null) {
        alert("Please login first!");

        // saving product user clicked on
        sessionStorage.setItem("pendingProduct", JSON.stringify(product));

        // redirection to the pg user was on previously
        let fullPath = window.location.pathname;
        let currentPage = fullPath.split("/").pop();

        window.location.href = "login.html?returnUrl=" + currentPage;

        return;
    }

    // User is logged in then add to database cart
    $.ajax({
        type: "POST",
        url: "http://localhost:56642/api/Cart",


        data: {
            UserID: user.UserID,
            ProductID: product.ProductID,
            CartQty: 1
        },

        success: (response) => {

            if (response == false) {
                alert("Only " + product.ProductQty + " items are available");
                return;
            }

            updateCartCounter();

        },

        error: (err) => {
            alert(err);
            console.log(err);
        }

    })

    // Show popup
    let cartPopup = document.getElementById("cartPopup");
    cartPopup.classList.add("show");


    // Hide popup
    setTimeout(function () {
        cartPopup.classList.remove("show");
    }, 1500);
}

// Display cart
function displayCart() {
    getCart((cart) => {

        let container = document.getElementById("cartItemsContainer");
        let cartLayout = document.getElementById("cartLayout");
        let emptyCart = document.getElementById("emptyCart");
        let cartHeader = document.getElementById("cartHeader");
        let checkoutButton = document.getElementById("checkoutButton");

        let totalBill = 0;
        let stockUnavailable = false;

        // Empty cart
        if (cart.length === 0) {
            cartHeader.style.display = "none";
            cartLayout.style.display = "none";
            emptyCart.style.display = "block";
            return;
        }

        // Cart has items
        cartHeader.style.display = "block";
        cartLayout.style.display = "grid";
        emptyCart.style.display = "none";

        let html = "";

        cart.forEach((item) => {

            let itemTotal = item.Price * item.CartQty;
            totalBill += itemTotal;

            // Check if current stock is less than cart quantity
            let itemUnavailable = item.Product.ProductQty < item.CartQty;

            if (itemUnavailable) {
                stockUnavailable = true;
            }

            html += `
            <div class="cart-card">

                <img src="${item.Product.ProductImg}" alt="${item.Product.ProductName}">

                <div class="cart-info">

                    <h3 class="cart-title">${item.Product.ProductName}</h3>

                    <p class="cart-desc">${item.Product.ProductDesc}</p>

                    ${item.Product.ProductQty == 0 ? `
                        <p class="cart-stock-warning">Out of Stock</p>
                    ` : itemUnavailable ? `
                        <p class="cart-stock-warning">
                            Only ${item.Product.ProductQty} available
                        </p>
                    ` : ""}

                    <div class="cart-actions">

                        <div class="qty-pill">
                            <button type="button" onclick="decreaseQty(${item.CartID})">-</button>

                            <span>${item.CartQty}</span>

                            <button type="button" onclick="increaseQty(${item.CartID})">+</button>
                        </div>

                        <button type="button"
                            class="remove-btn"
                            title="Remove item"
                            onclick="removeItem(${item.CartID})">
                            <i class="fa-solid fa-xmark"></i>
                        </button>

                        <span class="cart-price">
                            ₹ ${itemTotal.toLocaleString('en-IN')}
                        </span>

                    </div>

                </div>
            </div>
            `;
        });

        container.innerHTML = html;

        document.getElementById("summarySubtotal").innerText =
            "₹ " + totalBill.toLocaleString('en-IN');

        document.getElementById("summaryTotal").innerText =
            "₹ " + totalBill.toLocaleString('en-IN');

        // Disable checkout if any item is unavailable
        checkoutButton.disabled = stockUnavailable;
    });
}

// Increase quantity
function increaseQty(id) {
    getCart((cart) => {
        let item = cart.find(x => x.CartID === id);

        item.CartQty++;

        $.ajax({
            type: "PUT",
            url: "http://localhost:56642/api/Cart",

            data: {
                CartID: item.CartID,
                CartQty: item.CartQty
            },

            success: (response) => {
                if (response == false) {
                    alert("Only " + item.Product.ProductQty + " items are available");
                    return;
                }
                displayCart();
                updateCartCounter()
            },

            error: (err) => {
                alert(err);
                console.log(err);
            }
        })
    })
}

// Decrease quantity
function decreaseQty(id) {
    getCart((cart) => {
        let item = cart.find(x => x.CartID === id);

        if (item.CartQty > 1) {
            item.CartQty--;

            $.ajax({
                type: "PUT",
                url: "http://localhost:56642/api/Cart",

                data: {
                    CartID: item.CartID,
                    CartQty: item.CartQty
                },

                success: () => {
                    displayCart();
                    updateCartCounter()
                },

                error: (err) => {
                    alert(err);
                    console.log(err);
                }
            })
        }
        else {
            removeItem(id);
        }
    })
}

// Remove item
function removeItem(id) {
    $.ajax({
        type: "DELETE",
        url: "http://localhost:56642/api/Cart/" + id,

        success: () => {
            displayCart();
            updateCartCounter()
        },

        error: (err) => {
            alert(err);
            console.log(err);
        }
    })
}

// Run when page loads
$(document).ready(() => {
    if (document.getElementById("cartItemsContainer")) {
        displayCart();
    }
})