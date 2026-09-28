$(document).ready(function () {

    $("#registerForm").submit(function (event) {

        event.preventDefault();

        let fullName = document.getElementById("fullName").value.trim();
        let useremail = document.getElementById("email").value.trim();
        let userpass = document.getElementById("password").value.trim();
        let confirmPassword = document.getElementById("confirmPassword").value.trim();


        // Validation
        if (fullName === "" || useremail === "" || userpass === "" || confirmPassword === "") {
            alert("All fields are required!");
            return;
        }


        // Check passwords
        if (userpass !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // Send data to API
        $.ajax({
            type: "POST",
            url: "http://localhost:56642/api/Register",

           data: {
                UserName: fullName,
                UserEmail: useremail,
                UserPassword: userpass
            },

            success: (response) => {

                if (response === false) {
                    alert("An account with this email already exists");
                    return;
                }

                alert("Signup successful!");
                window.location.href = "login.html";
            },

            error: function (err) {
                alert(err);
                console.log(err);
            }
        });


    });


    // Password toggle
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


    // Confirm password toggle
    $("#toggleConfirmPassword").click(function () {

        if ($("#confirmPassword").attr("type") === "password") {

            $("#confirmPassword").attr("type", "text");

            $("#toggleConfirmPassword").removeClass("fa-eye");
            $("#toggleConfirmPassword").addClass("fa-eye-slash");

        } else {

            $("#confirmPassword").attr("type", "password");

            $("#toggleConfirmPassword").removeClass("fa-eye-slash");
            $("#toggleConfirmPassword").addClass("fa-eye");

        }

    });

});