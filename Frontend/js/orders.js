$(document).ready(() => {

    let user = JSON.parse(localStorage.getItem("loggedInUser"));

    $.ajax({
        type: "GET",
        url: "http://localhost:56642/api/Bill/" + user.UserID,

        success: (orders) => {

            let container = document.getElementById("ordersContainer");

            if (orders.length === 0) {
                container.innerHTML = "<p>No orders found</p>";
                return;
            }

            let html = "";

            orders.forEach((order) => {

                let orderDate = new Date(order.BillDate);

                let formattedDate = orderDate.toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                });

                html +=`
                    <div class="order-group">

                        <div class="order-card">

                            <div class="order-card-header">
                                <span class="order-id">
                                    Order ID: <strong>#${order.BillID}</strong>
                                </span>

                                <span class="order-date">
                                    ${formattedDate}
                                </span>
                            </div>

                            <div class="order-items-list">
                   `;             

                order.BillDetails.forEach((detail) => {

                                    html += `
                        <div class="order-item-row">

                            <div class="item-img-wrapper">
                                <img src="${detail.Product.ProductImg}"
                                     alt="${detail.Product.ProductName}">
                            </div>

                            <div class="item-details">

                                <h4 class="item-name">
                                    ${detail.Product.ProductName}
                                </h4>

                                <p class="item-meta">
                                    Qty: ${detail.Qty}
                                </p>

                                <span class="item-price">
                                    ₹ ${detail.TotalAmt.toLocaleString('en-IN')}
                                </span>

                            </div>

                        </div>
                    `;
                });

                                html += `
                            </div>

                            <div class="order-card-footer">
                                <div class="total-paid">
                                    <span>Total Paid:</span>
                                    <strong>
                                        ₹ ${order.TotalBill.toLocaleString('en-IN')}
                                    </strong>
                                </div>
                            </div>

                        </div>
                    </div>
                `;
            });

            container.innerHTML = html;
        },

        error: (err) => {
            console.log(err);
        }
    });
});