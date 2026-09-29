# Starlight E-Commerce Jewellery Platform

A full-stack, multi-tier e-commerce web application built with an ASP.NET Web API backend, Entity Framework 6, Microsoft SQL Server, and an asynchronous JavaScript client. The platform implements role-based access control (Admin vs. Customer), relational integrity with explicit database constraints, and dynamic frontend state management.

---

## Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript (ES6+), jQuery
* **Backend:** ASP.NET Web API 2 (.NET Framework), C#
* **Database & ORM:** Microsoft SQL Server, Entity Framework 6 (Database-First)
* **Architecture:** RESTful API with CORS & Role-Based Access Control

---

##  Features

* **Storefront:** Dynamic product catalog (Necklaces, Earrings, Rings, Bracelets) hydrated via asynchronous Fetch API calls.
* **Cart & Checkout:** Real-time cart state management, composite key constraint preventing duplicates, and relational order generation (`Bill` + `BillDetails`).
* **Admin Dashboard:** Inventory management (CRUD operations on stock, pricing, and categories), order tracking, and user account oversight.
* **Authentication:** Role-based access control separating Customer accounts from Admin dashboards.

---

##  Database Design

Built on normalized 3NF schema in `ProjectDB`:

* `UserType` ➔ `UserDetails` (Role management: Admin vs Customer)
* `Categories` ➔ `Products` (Catalog taxonomy with price/quantity CHECK constraints)
* `UserDetails` + `Products` ➔ `Cart` (Transient cart mapped with unique user-item pairing)
* `UserDetails` ➔ `Bill` ➔ `BillDetails` (Order header and line-item transaction receipts)

---

## Setup

1. **Database:** Open `SQL_File.sql` in SSMS and run it to create `ProjectDB` and seed the catalog.
2. **Backend:** 
   * Open `Backend/ProjectAPI.sln` in Visual Studio.
   * Update the connection string in `Web.config` with your SQL server name.
   * Restore NuGet packages and run via IIS Express (`Ctrl + F5`).
3. **Frontend:** Open the `Frontend` folder in VS Code and run `index.html` with Live Server.
