$(document).ready(function () {

    $("#loginForm").submit(function (event) {

        event.preventDefault();

        let email = document.getElementById("email").value.trim();
        let password = document.getElementById("password").value.trim();


        if (email === "" || password === "") {
            alert("Email and password cannot be empty!");
            return;
        }


        let params = new URLSearchParams(window.location.search);
        let returnUrl = params.get("returnUrl");

        let pendingProduct = sessionStorage.getItem("pendingProduct");


        $.ajax({
            type: "POST",
            url: "http://localhost:56642/api/Login",

            data: {
                UserEmail: email,
                UserPassword: password
            },

            success: (response) => {

                if (response === 0) {
                    alert("Invalid email or password");
                    return;
                }

                alert("Logged in successfully");

                localStorage.setItem("loggedInUser", JSON.stringify({ UserID: response }));

                if (pendingProduct) {

                    let product = JSON.parse(pendingProduct);

                    $.ajax({
                        type: "POST",
                        url: "http://localhost:56642/api/Cart",

                        data: {
                            UserID: response,
                            ProductID: product.ProductID,
                            CartQty: 1
                        },

                        success: () => {

                            sessionStorage.removeItem("pendingProduct");

                            if (returnUrl) {
                                window.location.href = returnUrl;
                            }
                            else {
                                window.location.href = "index.html";
                            }
                        },

                        error: (err) => {
                            alert(err);
                            console.log(err);
                        }
                    });

                }
                else {

                    if (returnUrl) {
                        window.location.href = returnUrl;
                    }
                    else {
                        window.location.href = "index.html";
                    }

                }

            },

            error: (err) => {
                alert(err);
                console.log(err);
            }
        });

    });


    $("#togglePassword").click(function () {

        if ($("#password").attr("type") === "password") {

            $("#password").attr("type", "text");
            $("#togglePassword").removeClass("fa-eye");
            $("#togglePassword").addClass("fa-eye-slash");

        } else {

            $("#password").attr("type", "password");
            $("#togglePassword").removeClass("fa-eye-slash");
            $("#togglePassword").addClass("fa-eye");

        }

    });

});