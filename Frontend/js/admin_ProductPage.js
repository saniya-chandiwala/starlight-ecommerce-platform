let allProducts = [];

$(document).ready(() => {

    loadAdminEmail();
    loadProducts();
    loadCategories();

    $("#selectCategory").change(() => {
        // Clear previous product search
        $("#productSearch").val("");

        // Category selected → enable search
        $("#productSearch").prop("disabled", false);
        $("#productSearch").attr("placeholder", "Select a product...");

        filterProducts();
    });

    // initially showing all prods
    $("#productSearch").focus(filterProducts);

    // filtering based on input txt
    $("#productSearch").on("input", () => {
        filterProducts();
    });

    // hiding dropdown when clicked elsewhere
    $(document).click((event) => {

        if (!$(event.target).closest(".product-search").length) {
            $("#productDropdown").hide();
        }

    });

    // on selecting product show all details and enabling all fields
    $("#productDropdown").on("click", function (event) {
        let productID = event.target.getAttribute("data-id");

        let product = allProducts.find(x => x.ProductID == productID);

        // Put product data into the form
        $("#productId").val(product.ProductID);
        $("#productName").val(product.ProductName);
        $("#productCategory").val(product.CategoryID);
        $("#productPrice").val(product.ProductPrice);
        $("#productStock").val(product.ProductQty);
        $("#productImage").val(product.ProductImg);
        $("#productDesc").val(product.ProductDesc);

        // Show product preview
        $("#previewContainer").show();

        // Show product image
        document.getElementById("productPreviewImg").src = product.ProductImg;
        $("#productPreviewImg").show();

        // Hide placeholder image icon
        $(".placeholder-icon").hide();

        // Enable form fields 
        setForm(false);

        // Enable Update and Delete
        document.getElementById("btnUpdate").disabled = false;
        document.getElementById("btnDelete").disabled = false;

        // Disable Save
        document.getElementById("btnSave").disabled = true;

        // Hide dropdown
        $("#productDropdown").hide();

        // Put selected product name in search box
        $("#productSearch").val(product.ProductName);
    });

    // update btn action
    $("#btnUpdate").click(() => {

        let product = {
            ProductID: $("#productId").val(),
            ProductName: $("#productName").val(),
            CategoryID: $("#productCategory").val(),
            ProductPrice: $("#productPrice").val(),
            ProductQty: $("#productStock").val(),
            ProductImg: $("#productImage").val(),
            ProductDesc: $("#productDesc").val()
        };

        if (validateProduct(product) === false) {
            return;
        }

        $.ajax({
            type: "PUT",
            url: "http://localhost:56642/api/Product",
            data: product,

            success: () => {
                alert("Product updated successfully!");
                loadProducts();
            },

            error: (err) => {
                alert(err);
                console.log(err);
            }
        });
    });

    // delete btn action
    $("#btnDelete").click(() => {

        let productID = $("#productId").val();

        if (!confirm("Are you sure you want to delete this product?")) {
            return;
        }

        $.ajax({
            type: "DELETE",
            url: "http://localhost:56642/api/Product/" + productID + "?forceDelete=false",

            success: (response) => {

                // Product had no orders and was deleted normally
                if (response == true) {
                    alert("Product deleted successfully!");

                    // Get fresh products
                    loadProducts();
                    clearForm();

                    return;
                }

                // Product is attached to existing orders
                if (!confirm(
                    "This product is attached to existing orders. Are you sure you want to delete it?")) {
                    return;
                }

                // Force delete
                $.ajax({
                    type: "DELETE",
                    url: "http://localhost:56642/api/Product/" + productID + "?forceDelete=true",

                    success: () => {

                        alert("Product and its order details were deleted successfully!");

                        loadProducts();
                        clearForm();
                    },

                    error: (err) => {
                        alert(err);
                        console.log(err);
                    }
                });
            },

            error: (err) => {
                alert(err);
                console.log(err);
            }
        });
    });

    // steps to perform when add new is clicked
    $("#btnAddNew").click(() => {

        // Clear old product data
        clearForm();

        // Enable form fields
        setForm(false);

        // Enable Save New
        document.getElementById("btnSave").disabled = false;

        // Disable Update and Delete
        document.getElementById("btnUpdate").disabled = true;
        document.getElementById("btnDelete").disabled = true;

        // Change search box
        $("#productSearch").val("");
        $("#productSearch").prop("disabled", true);
        $("#productSearch").attr("placeholder", "New product");

        // Completely hide preview area
        $(".form-preview").hide();
    });

    // save new prod details in db
    $("#btnSave").click(() => {

        let productName = $("#productName").val().trim();
        let categoryID = $("#productCategory").val();
        let productPrice = $("#productPrice").val();
        let productStock = $("#productStock").val();
        let productImage = $("#productImage").val().trim();
        let productDesc = $("#productDesc").val().trim();

        let product = {
            ProductName: productName,
            CategoryID: categoryID,
            ProductPrice: productPrice,
            ProductQty: productStock,
            ProductImg: productImage,
            ProductDesc: productDesc
        };

        // Check required fields
        if (validateProduct(product) === false) {
            return;
        }

        $.ajax({
            type: "POST",
            url: "http://localhost:56642/api/Product",
            data: product,

            success: () => {

                alert("Product added successfully!");

                loadProducts();
                clearForm();

                $("#productSearch").prop("disabled", false);
                $("#productSearch").attr("placeholder", "Select a product...");
            },

            error: (err) => {

                console.log(err);
                alert("Error adding product.");
            }
        });

    });

    // Reset button
    $("#btnClear").click(() => {

        clearForm();

        $("#productDropdown").hide();

        let categoryID = $("#selectCategory").val();

        if (categoryID == "") {
            $("#productSearch").prop("disabled", true);
            $("#productSearch").attr("placeholder", "Select a category first...");
        }
        else {
            $("#productSearch").prop("disabled", false);
            $("#productSearch").attr("placeholder", "Select a product...");
        }

        $("#btnSave").prop("disabled", true);

        $(".form-preview").show();
    });

});







function validateProduct(product) {
    if (
        product.ProductName === "" ||
        product.CategoryID === "" ||
        Number(product.ProductPrice) <= 0 ||
        Number(product.ProductQty) < 0 ||
        product.ProductImg === "" ||
        product.ProductDesc === ""
    ) {
        alert("Please enter valid product details.");
        return false;
    }

    let duplicate = allProducts.find(x =>
        x.ProductName.toLowerCase() === product.ProductName.toLowerCase() &&
        x.ProductID != product.ProductID
    );

    if (duplicate) {
        alert("A product with this name already exists.");
        return false;
    }

    return true;
}

function loadCategories() {

    $.ajax({
        type: "GET",
        url: "http://localhost:56642/api/Category",

        success: (response) => {
            response.forEach((category) => {

                $("#selectCategory").append(`
                    <option value="${category.CategoryID}">
                        ${category.CategoryName}
                    </option>
                `);

                $("#productCategory").append(`
                    <option value="${category.CategoryID}">
                        ${category.CategoryName}
                    </option>
                `);
            });
        },

        error: (err) => {
            alert(err);
            console.log(err);
        }
    });
}

// adding all products in an array
function loadProducts() {
    $.ajax({
        type: "GET",
        url: "http://localhost:56642/api/Product",

        success: (response) => {
            allProducts = response;
        },

        error: (err) => {
            alert(err);
            console.log(err);
        }
    });
}

// creating html to show prods
function showProducts(products) {
    let dropdown = $("#productDropdown");

    dropdown.html("");

    if (products.length === 0) {
        dropdown.html("<div class='product-dropdown-item'>No products found</div>");
        dropdown.show();
        return;
    }

    products.forEach((product) => {
        // to keep data safe frm injection attacks use .text
        let item = $("<div>");
        item.addClass("product-dropdown-item");
        item.attr("data-id", product.ProductID);
        item.text(product.ProductName);

        dropdown.append(item);
    });

    dropdown.show();
}

// showing only specific prods
function filterProducts() {
    let categoryID = $("#selectCategory").val();
    let searchText = $("#productSearch").val().trim().toLowerCase();

    let filteredProducts = allProducts.filter((product) =>
        (categoryID == "all" || product.CategoryID == categoryID) &&
        product.ProductName.toLowerCase().startsWith(searchText)
    );

    showProducts(filteredProducts);
}

// enabling/disabling form fields
function setForm(isDisabled) {
    document.getElementById("productName").disabled = isDisabled;
    document.getElementById("productCategory").disabled = isDisabled;
    document.getElementById("productPrice").disabled = isDisabled;
    document.getElementById("productStock").disabled = isDisabled;
    document.getElementById("productImage").disabled = isDisabled;
    document.getElementById("productDesc").disabled = isDisabled;
}

// clearing form after performing actions
function clearForm() {
    // Clear product data from the form
    $("#productId").val("");
    $("#productSearch").val("");
    $("#productName").val("");
    $("#productCategory").val("");
    $("#productPrice").val("");
    $("#productStock").val("");
    $("#productImage").val("");
    $("#productDesc").val("");

    // Hide product image
    document.getElementById("productPreviewImg").style.display = "none";

    // Show placeholder image icon
    $(".placeholder-icon").show();

    // Disable form fields
    setForm(true);

    // Disable Update and Delete
    document.getElementById("btnUpdate").disabled = true;
    document.getElementById("btnDelete").disabled = true;
}