
let allOrders = [];

$(document).ready(() => {

    // Load orders and admin email when the page opens
    loadOrders();
    loadAdminEmail();

    // Search orders whenever the search input changes
    $("#orderSearchInput").on("input", () => {
        filterOrders();
    });

    // Close the order modal using the close button
    $("#btnCloseOrderModal").click(() => {
        $("#orderModalOverlay").removeClass("active");
    });

    // Close the order modal when clicking outside the modal
    $("#orderModalOverlay").click(function (event) {
        if (event.target == this) {
            $("#orderModalOverlay").removeClass("active");
        }
    });

    // Open order details when the View button is clicked
    $("#orderTableBody").on("click", ".view-order-action", function () {
        let billID = this.getAttribute("data-id");

        showOrderDetails(billID);
    });

});



// Load all orders
function loadOrders() {

    $.ajax({
        type: "GET",
        url: "http://localhost:56642/api/Bill",

        success: (response) => {

            allOrders = response;

            loadCustomerDetails();
        },

        error: (err) => {
            console.log(err);
            alert("Error loading orders.");
        }
    });
}


// Get customer information for the orders
// Get customer information for the orders
function loadCustomerDetails() {

    let completed = 0;

    if (allOrders.length == 0) {
        displayOrders([]);
        return;
    }

    allOrders.forEach((order) => {

        $.ajax({
            type: "GET",
            url: "http://localhost:56642/api/User/" + order.UserID,

            success: (user) => {

                order.CustomerName = user.UserName;
                order.CustomerEmail = user.UserEmail;

                completed++;

                if (completed == allOrders.length) {
                    filterOrders();
                }
            },

            error: (err) => {
                console.log(err);
                alert("Error loading customer details.");
            }
        });

    });
}

// Search orders
function filterOrders() {

    let searchText = $("#orderSearchInput").val().toLowerCase().trim();

    if (searchText == "") {
        $("#orderTableBody").html("");
        return;
    }

    let filteredOrders = allOrders.filter((order) => {

        return (
            order.BillID.toString().includes(searchText) ||
            order.CustomerName.toLowerCase().includes(searchText) ||
            order.CustomerEmail.toLowerCase().includes(searchText)
        );

    });

    displayOrders(filteredOrders);
}

// Display orders in the table
function displayOrders(orders) {

    let table = $("#orderTableBody");

    table.html("");

    orders.forEach((order) => {

        let orderDate = new Date(order.BillDate);

        table.append(`
            <tr>
                <td>
                    <strong>#${order.BillID}</strong>
                </td>

                <td>
                    <strong>${order.CustomerName}</strong><br>
                    <span>${order.CustomerEmail}</span>
                </td>

                <td>
                    ${orderDate.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    })}
                </td>

                <td>
                    <strong>
                        ₹ ${order.TotalBill.toLocaleString("en-IN", {
                            minimumFractionDigits: 2
                        })}
                    </strong>
                </td>

                <td style="text-align: right;">
                    <button type="button"
                        class="btn-table-action view-order-action"
                        data-id="${order.BillID}">
                        View
                    </button>
                </td>
            </tr>
        `);
    });
}

// Show selected order details
function showOrderDetails(billID) {

    let order = allOrders.find((x) => x.BillID == billID);

    if (order == null) {
        return;
    }

    $("#modalOrderTitle").text("Order #" + order.BillID);

    let orderDate = new Date(order.BillDate);

    $("#modalOrderDate").text(
        orderDate.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
        })
    );

    $("#modalCustomerName").text(order.CustomerName);
    $("#modalCustomerEmail").text(order.CustomerEmail);
    $("#modalPaymentStatus").text("Paid");

    $("#modalGrandTotal").text(
        "₹ " + order.TotalBill.toLocaleString("en-IN", {
            minimumFractionDigits: 2
        })
    );

    loadOrderDetails(order.BillID);

    $("#orderModalOverlay").addClass("active");
}

// Load the products purchased in the selected order
function loadOrderDetails(billID) {

    $.ajax({
        type: "GET",
        url: "http://localhost:56642/api/BillDetails/" + billID,

        success: (response) => {

            let table = $("#modalOrderItemsBody");

            table.html("");

            response.forEach((item) => {

                let subtotal = item.TotalAmt;

                table.append(`
                    <tr>
                        <td>
                            <strong>${item.Product.ProductName}</strong>
                        </td>

                        <td style="text-align: center;">
                            ₹ ${item.Product.ProductPrice.toLocaleString("en-IN")}
                        </td>

                        <td style="text-align: center;">
                            ${item.Qty}
                        </td>

                        <td style="text-align: right;">
                            ₹ ${subtotal.toLocaleString("en-IN")}
                        </td>
                    </tr>
                `);
            });
        },

        error: (err) => {
            console.log(err);
            alert("Error loading order details.");
        }
    });
}
