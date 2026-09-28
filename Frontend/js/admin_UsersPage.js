let allUsers = [];

$(document).ready(() => {

    // Load admin email and all users
    loadAdminEmail();
    loadUsers();

    // Select user type
    $("#selectUserRole").change(() => {

        // Clear previous user search
        $("#userSearchInput").val("");

        // Enable user search
        $("#userSearchInput").prop("disabled", false);
        $("#userSearchInput").attr("placeholder", "Select a user...");

        // Show users based on selected role
        showUserSearchResults();
    });

    // Show users when search box is focused
    $("#userSearchInput").focus(() => {
        showUserSearchResults();
    });

    // Search users while typing
    $("#userSearchInput").on("input", () => {
        showUserSearchResults();
    });

    // Hide dropdown when clicked somewhere else
    $(document).click((event) => {

        if (!$(event.target).closest(".product-search").length) {
            $("#userDropdown").hide();
        }

    });

    // Select user from dropdown
    $("#userDropdown").on("click", function (event) {

        let userID = event.target.getAttribute("data-id");

        let selectedUser = allUsers.find(x => x.UserID == userID);

        if (selectedUser == null) {
            return;
        }

        // Show selected user's details
        displayUsers([selectedUser]);

        // Put selected email in search box
        $("#userSearchInput").val(selectedUser.UserEmail);

        // Hide dropdown
        $("#userDropdown").hide();
    });


    // New user button, preparing an empty form
    $("#btnNewUser").click(() => {

        // Clear old user data
        $("#userId").val("");
        $("#userName").val("");
        $("#userEmail").val("");
        $("#userPassword").val("");

        // Default role
        $("#userRole").val("Customer");

        // Button states
        $("#btnSaveUser").prop("disabled", false);
        $("#btnUpdateUser").prop("disabled", true);
        $("#btnDeleteUser").prop("disabled", true);

        // Change modal title
        $("#modalTitle").text("Add New User");

        // Show popup
        $("#userModalOverlay").addClass("active");
    });


    // Save new user in db
    $("#btnSaveUser").click(() => {

        let typeID;

        if ($("#userRole").val() == "Admin") {
            typeID = 1;
        }
        else {
            typeID = 2;
        }

        let user = {
            UserName: $("#userName").val(),
            UserEmail: $("#userEmail").val(),
            UserPassword: $("#userPassword").val(),
            TypeID: typeID
        };

        if (validateUser(user) === false) {
            return;
        }

        $.ajax({
            type: "POST",
            url: "http://localhost:56642/api/User",
            data: user,

            success: (response) => {

                if (response == false) {
                    alert("A user with this email already exists.");
                    return;
                }

                alert("User added successfully!");

                // Reload users
                loadUsers();

                // Close popup
                $("#userModalOverlay").removeClass("active");
            },

            error: (err) => {
                alert(err);
                console.log(err);
            }
        });
    });


    // Edit button in table
    $("#userTableBody").on("click", ".edit-action", function () {

        let userID = this.getAttribute("data-id");

        $.ajax({
            type: "GET",
            url: "http://localhost:56642/api/User/" + userID,

            success: (user) => {

                // Fill popup with details
                $("#userId").val(user.UserID);
                $("#userName").val(user.UserName);
                $("#userEmail").val(user.UserEmail);
                $("#userPassword").val(user.UserPassword);

                $("#userRole").val(getRoleName(user.TypeID));

                let loggedInUser =
                    JSON.parse(localStorage.getItem("loggedInUser"));

                let isLoggedInUser =
                    loggedInUser != null &&
                    user.UserID == loggedInUser.UserID;

                $("#btnSaveUser").prop("disabled", true);
                $("#btnUpdateUser").prop("disabled", false);
                $("#btnDeleteUser").prop("disabled", isLoggedInUser);

                $("#modalTitle").text("Edit User");

                $("#userModalOverlay").addClass("active");
            },

            error: (err) => {
                alert(err);
                console.log(err);
            }
        });
    });


    // Delete button in table
    $("#userTableBody").on("click", ".delete-action", function () {

        // Get UserID from button
        let userID = this.getAttribute("data-id");

        deleteUser(userID);
    });


    // Close popup using X
    $("#btnCloseModal").click(() => {
        $("#userModalOverlay").removeClass("active");
    });


    // Close popup by clicking outside
    $("#userModalOverlay").click(function (event) {

        if (event.target == this) {
            $("#userModalOverlay").removeClass("active");
        }

    });


    // Update user
    $("#btnUpdateUser").click(() => {

        let typeID;

        if ($("#userRole").val() == "Admin") {
            typeID = 1;
        }
        else {
            typeID = 2;
        }

        let user = {
            UserID: $("#userId").val(),
            UserName: $("#userName").val(),
            UserEmail: $("#userEmail").val(),
            UserPassword: $("#userPassword").val(),
            TypeID: typeID
        };

        if (validateUser(user) === false) {
            return;
        }

        $.ajax({
            type: "PUT",
            url: "http://localhost:56642/api/User",
            data: user,

            success: (response) => {

                if (response == false) {
                    alert("User not found.");
                    return;
                }

                alert("User updated successfully!");

                // Reload users
                loadUsers();

                // Close popup
                $("#userModalOverlay").removeClass("active");
            },

            error: (err) => {
                alert(err);
                console.log(err);
            }
        });
    });


    // Delete user from popup
    $("#btnDeleteUser").click(() => {

        let userID = $("#userId").val();

        deleteUser(userID);
    });

});


// Load all users from API
function loadUsers() {

    $.ajax({
        type: "GET",
        url: "http://localhost:56642/api/User",

        success: (response) => {

            allUsers = response;

            // Keep table empty until a user is selected
            $("#userTableBody").html("");
        },

        error: (err) => {
            alert(err);
            console.log(err);
        }
    });
}


// Validate user details
function validateUser(user) {

    if (
        user.UserName === "" ||
        user.UserEmail === "" ||
        user.UserPassword === ""
    ) {
        alert("Please enter valid user details.");
        return false;
    }

    let duplicate = allUsers.find(x =>
        x.UserEmail.toLowerCase() === user.UserEmail.toLowerCase() &&
        x.UserID != user.UserID
    );

    if (duplicate) {
        alert("A user with this email already exists.");
        return false;
    }

    return true;
}


// Show users matching selected role and typed email
function showUserSearchResults() {

    let selectedRole = $("#selectUserRole").val();
    let searchText = $("#userSearchInput").val().trim().toLowerCase();

    let filteredUsers = allUsers.filter((user) => {

        let roleMatches =
            selectedRole == "All" ||
            (selectedRole == "Admin" && user.TypeID == 1) ||
            (selectedRole == "Customer" && user.TypeID == 2);

        let emailMatches =
            user.UserEmail.toLowerCase().startsWith(searchText);

        return roleMatches && emailMatches;
    });

    showUsers(filteredUsers);
}


// Create dropdown items for matching users
function showUsers(users) {

    let dropdown = $("#userDropdown");

    dropdown.html("");

    if (users.length === 0) {

        dropdown.html(
            "<div class='product-dropdown-item'>No users found</div>"
        );

        dropdown.show();

        return;
    }

    users.forEach((user) => {

        // Create dropdown item
        let item = $("<div>");

        item.addClass("product-dropdown-item");
        item.attr("data-id", user.UserID);
        item.text(user.UserEmail);

        dropdown.append(item);
    });

    dropdown.show();
}


// Display role name instead of number
function getRoleName(typeID) {

    if (typeID == 1) {
        return "Admin";
    }

    return "Customer";
}


// Delete user
function deleteUser(userID) {

    if (!confirm("Are you sure you want to delete this user?")) {
        return;
    }

    $.ajax({
        type: "DELETE",
        url: "http://localhost:56642/api/User/" + userID,

        success: (response) => {

            if (response == false) {
                alert("User not found.");
                return;
            }

            alert("User deleted successfully!");

            // Reload users
            loadUsers();

            // Close popup if it is open
            $("#userModalOverlay").removeClass("active");
        },

        error: (err) => {
            alert(err);
            console.log(err);
        }
    });
}


// Display selected users in table
function displayUsers(users) {

    let table = $("#userTableBody");

    // Get currently logged-in user
    let loggedInUser =
        JSON.parse(localStorage.getItem("loggedInUser"));

    // Clear existing rows
    table.html("");

    users.forEach((user) => {

        let roleName = getRoleName(user.TypeID);

        // Check if this row belongs to the logged-in user
        let isLoggedInUser =
            loggedInUser != null &&
            user.UserID == loggedInUser.UserID;

        table.append(`
            <tr>
                <td><strong>#${user.UserID}</strong></td>

                <td>${user.UserName}</td>

                <td>${user.UserEmail}</td>

                <td>${user.UserPassword}</td>

                <td>
                    <span class="badge-role ${roleName === "Admin"
                ? "badge-admin"
                : "badge-customer"}">
                        ${roleName}
                    </span>
                </td>

                <td>
                    <div class="table-actions">

                        <button type="button"
                            class="btn-table-action edit-action"
                            title="Edit User"
                            data-id="${user.UserID}">
                            <i class="fa-regular fa-pen-to-square"></i>
                        </button>

                        <button type="button"
                            class="btn-table-action delete-action"
                            title="${isLoggedInUser
                ? "You cannot delete your own account"
                : "Delete User"}"
                            data-id="${user.UserID}"
                            ${isLoggedInUser ? "disabled" : ""}>
                            <i class="fa-regular fa-trash-can"></i>
                        </button>

                    </div>
                </td>
            </tr>
        `);
    });
}
