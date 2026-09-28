
// Load Admin Dashboard
$(document).ready(function () {

    loadAdminEmail();
    loadDashboardData();

});


// Display logged-in admin email
function loadAdminEmail() {

    let user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (user == null) {
        return;
    }

    $.ajax({
        type: "GET",
        url: "http://localhost:56642/api/User/" + user.UserID,

        success: (response) => {

            document.getElementById("adminEmail").textContent = response.UserEmail;

        },

        error: (err) => {
            console.log("Error loading admin email:", err);
        }
    });
}


// Load Dashboard Data
function loadDashboardData() {

    // Get Products
    $.ajax({
        type: "GET",
        url: "http://localhost:56642/api/Product",

        success: (products) => {

            // Total Products
            $("#totalProducts").text(products.length);


            // Low Stock Products
            let lowStockProducts = products.filter(x => x.ProductQty <= 2);

            $("#lowStockProducts").text(lowStockProducts.length);

        },

        error: (err) => {
            console.log("Error loading products:", err);
        }
    });


    // Get Categories
    $.ajax({
        type: "GET",
        url: "http://localhost:56642/api/Category",

        success: (categories) => {

            // Total Categories
            $("#totalCategories").text(categories.length);

        },

        error: (err) => {
            console.log("Error loading categories:", err);
        }
    });


    // Get Users
    $.ajax({
        type: "GET",
        url: "http://localhost:56642/api/User",

        success: (users) => {

            // Total Users
            $("#totalUsers").text(users.length);


            // Admin Users
            let admins = users.filter(x => x.TypeID == 1);

            $("#totalAdmins").text(admins.length);


            // Customer Users
            let customers = users.filter(x => x.TypeID == 2);

            $("#totalCustomers").text(customers.length);

        },

        error: (err) => {
            console.log("Error loading users:", err);
        }
    });


    // Get Bills
    $.ajax({
        type: "GET",
        url: "http://localhost:56642/api/Bill",

        success: (bills) => {

            // Total Orders
            $("#totalOrders").text(bills.length);


            // Total Revenue
            let revenue = 0;

            bills.forEach(bill => {
                revenue += bill.TotalBill;
            });


            $("#totalRevenue").text(revenue.toLocaleString("en-IN"));

        },

        error: (err) => {
            console.log("Error loading bills:", err);
        }
    });

}

// Logout
function logoutUser() {

    localStorage.removeItem("loggedInUser");

    alert("Logged out successfully!");

    window.location.href = "index.html";
}

