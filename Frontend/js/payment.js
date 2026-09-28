$(document).ready(function () {

    let user = JSON.parse(localStorage.getItem("loggedInUser"));

    // Make sure the user is logged in 
    if (user == null) {
        window.location.href = "login.html";
        return;
    }

    // Get logged-in user's name and email
    $.ajax({
        type: "GET",
        url: "http://localhost:56642/api/User/" + user.UserID,

        success: (response) => {
            $("#fullName").val(response.UserName);
            $("#email").val(response.UserEmail);
        },

        error: (err) => {
            console.log(err);
            alert("Error loading customer details.");
        }
    });

    // Get cart total
    $.ajax({
        type: "GET",
        url: "http://localhost:56642/api/Cart/" + user.UserID,

        success: (response) => {

            let grandTotal = 0;

            response.forEach((item) => {
                grandTotal += item.Price * item.CartQty;
            });

            $("#payBtn").text(
                "Pay ₹ " + grandTotal.toLocaleString("en-IN", {
                    minimumFractionDigits: 2
                })
            );
        },

        error: (err) => {
            console.log(err);
            alert("Error loading cart total.");
        }
    });

    $("#payBtn").click(() => {

        let paymentMethod = document.querySelector(
            'input[name="paymentMethod"]:checked'
        );

        let fullName = $("#fullName").val().trim();
        let email = $("#email").val().trim();
        let phone = $("#phone").val().trim();
        let address = $("#address").val().trim();
        let city = $("#city").val().trim();
        let state = $("#state").val().trim();
        let pincode = $("#pincode").val().trim();

        if (
            fullName == "" || email == "" ||
            phone == "" || phone.length != 10 || isNaN(phone) ||
            address == "" || city == "" || state == "" ||
            pincode == "" || pincode.length != 6 || isNaN(pincode) ||
            !paymentMethod
        ) {
            alert("Please enter valid details.");
            return;
        }

        $.ajax({
            type: "POST",
            url: "http://localhost:56642/api/Bill/" + user.UserID,

            success: (response) => {

                if (response == false) {
                    alert("Error occurred. Couldn't proceed to checkout.");
                    return;
                }

                alert("Payment Successful!");
                window.location.href = "index.html";
            },

            error: (err) => {
                console.log(err);
            }
        });

    });

});