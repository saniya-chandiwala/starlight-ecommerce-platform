
// Fetch Navbar
fetch("navbar.html")
    .then(response => response.text())
    .then(data => {

        document.getElementById("navbar").innerHTML = data;

        updateAuthIcon();
        updateCartCounter();
        checkAdmin();

    })
    .catch(error => console.log("Error loading navbar:", error));


// Fetch Footer
fetch("footer.html")
    .then(response => response.text())
    .then(data => {

        document.getElementById("footer").innerHTML = data;

    })
    .catch(error => console.log("Error loading footer:", error));


// Login / Logout
function updateAuthIcon() {

    let user = JSON.parse(localStorage.getItem("loggedInUser"));
    let authIcon = document.getElementById("authIcon");

    if (user) {

        $.ajax({
            type: "GET",
            url: "http://localhost:56642/api/User/" + user.UserID,

            success: (response) => {

                authIcon.innerHTML = `
                    <div class="user-dropdown">

                        <button type="button"
                                class="user-menu-btn"
                                title="Account Menu"
                                onclick="toggleUserDropdown(event)">

                            <i class="fa-solid fa-bars-staggered"></i>

                        </button>

                        <div class="user-dropdown-menu" id="userDropdownMenu">

                            <div class="user-dropdown-header">

                                <span class="user-welcome">
                                    Welcome,
                                </span>

                                <strong class="user-name">${response.UserName}</strong>

                            </div>

                            <div class="user-dropdown-divider"></div>

                            <a href="orders.html" class="user-dropdown-item">

                                <i class="fa-solid fa-clock-rotate-left"></i>

                                Order History

                            </a>

                            <button type="button"
                                    class="user-dropdown-item logout-btn"
                                    onclick="logoutUser()">

                                <i class="fa-solid fa-right-from-bracket"></i>

                                Logout

                            </button>

                        </div>

                    </div>
                `;
            },

            error: (err) => {
                console.log(err);
            }
        });

    } else {

        authIcon.innerHTML = `
            <a href="#" onclick="goToLogin()" title="Login" class="user-menu-btn">
                <i class="fa-solid fa-user"></i>
            </a>
        `;
    }
}


// Check if logged-in user is an Admin
function checkAdmin() {

    let user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (user == null) {
        return;
    }

    $.ajax({
        type: "GET",
        url: "http://localhost:56642/api/User/" + user.UserID,

        success: (response) => {

            if (response.TypeID == 1) {
                $("#adminDashboardLink").show();
            }

        },

        error: (err) => {
            console.log(err);
        }
    });
}


// Toggle Dropdown on Click
function toggleUserDropdown(event) {

    if (event) {
        event.stopPropagation();
    }

    const dropdownMenu = document.getElementById("userDropdownMenu");

    if (dropdownMenu) {
        dropdownMenu.classList.toggle("show");
    }
}


// Close Dropdown when Clicking Anywhere Outside
window.addEventListener("click", (event) => {

    const dropdownMenu = document.getElementById("userDropdownMenu");
    const dropdownBtn = document.querySelector(".user-menu-btn");

    if (dropdownMenu && dropdownMenu.classList.contains("show")) {

        if (
            !dropdownMenu.contains(event.target) &&
            (!dropdownBtn || !dropdownBtn.contains(event.target))
        ) {

            dropdownMenu.classList.remove("show");

        }
    }
});


// Logout
function logoutUser() {

    localStorage.removeItem("loggedInUser");

    alert("Logged out successfully!");

    window.location.href = "index.html";
}


// Cart Counter
function updateCartCounter() {

    let user = JSON.parse(localStorage.getItem("loggedInUser"));

    let cartCount = document.getElementById("cart-count");
    let cartIcon = document.querySelector(".bag-link");

    if (user === null) {

        cartIcon.style.display = "none";

        return;
    }

    cartIcon.style.display = "inline-flex";

    $.ajax({
        type: "GET",
        url: "http://localhost:56642/api/Cart/" + user.UserID,

        success: (cart) => {

            if (cartCount) {

                let totalQty = 0;

                cart.forEach(item => {
                    totalQty += item.CartQty;
                });

                cartCount.textContent = totalQty;
            }
        },

        error: function (err) {
            console.log(err);
        }
    });
}


// Change URL when going to Login
function goToLogin() {

    let fullPath = window.location.pathname;
    let currentPage = fullPath.split("/").pop();

    window.location.href = "login.html?returnUrl=" + currentPage;
}
