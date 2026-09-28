--CREATE DATABASE ProjectDB

USE ProjectDB


-- TYPE/ROLES TABLE
CREATE TABLE UserType(
TypeID INT PRIMARY KEY IDENTITY(1,1),
TypeName VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO UserType (TypeName) 
VALUES ('Admin'), ('Customer');



-- USER DETIAILS TABLE
CREATE TABLE UserDetails
(
UserID INT PRIMARY KEY IDENTITY(1,1),
TypeID INT NOT NULL,
UserName VARCHAR(100) NOT NULL,
UserEmail VARCHAR(100) NOT NULL UNIQUE,
UserPassword VARCHAR(100) NOT NULL,

FOREIGN KEY (TypeID) REFERENCES UserType (TypeID)
);

INSERT INTO UserDetails (TypeID, UserName, UserEmail, UserPassword)
VALUES 
(1, 'admin', 'admin@gmail.com', '1234'),
(2, 'user', 'user@gmail.com', '1234');



-- ADDRESS TABLE
--CREATE TABLE ADDRESS
--(
--AddressID INT PRIMARY KEY IDENTITY(1,1),
--UserID INT NOT NULL,

--ReceiverName VARCHAR(100) NOT NULL,
--ReceiverPhone VARCHAR(10) NOT NULL CHECK(LEN(ReceiverPhone) = 10),

--AddressLine VARCHAR(500) NOT NULL,
--City VARCHAR(100) NOT NULL,
--State VARCHAR(100) NOT NULL,
--Pincode VARCHAR(6) NOT NULL CHECK(LEN(Pincode) = 6),

--FOREIGN KEY (UserID) REFERENCES UserDetails (UserID) ON DELETE CASCADE
--);



-- CATEGORY TABLE
CREATE TABLE Categories
(
CategoryID INT PRIMARY KEY IDENTITY(1,1),
CategoryName VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO Categories (CategoryName)
VALUES ('Necklaces'), ('Earrings'), ('Rings'), ('Bracelets');



-- PRODUCTS TABLE
CREATE TABLE Products
(
ProductID INT PRIMARY KEY IDENTITY(1,1),

ProductName VARCHAR(100) NOT NULL UNIQUE,

CategoryID INT NOT NULL,

ProductPrice DECIMAL(10,2) NOT NULL CHECK (ProductPrice > 0),
ProductDesc VARCHAR(255),
ProductImg VARCHAR(200),
ProductQty INT NOT NULL CHECK (ProductQty >= 0),

    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID) ON DELETE CASCADE
);

INSERT INTO Products
( ProductName, CategoryID, ProductPrice, ProductDesc, ProductImg, ProductQty )
VALUES
('Diamond Halo Necklace', 1, 45000.00, 'Elegant diamond necklace', 'Images\Necklaces\necklace1.jpg', 10);



-- CART TABLE
CREATE TABLE Cart
(
CartID INT PRIMARY KEY IDENTITY(1,1),

UserID INT NOT NULL,
ProductID INT NOT NULL,

CartQty INT NOT NULL CHECK (CartQty > 0),

Price DECIMAL(10,2) NOT NULL CHECK (Price > 0),

UNIQUE (UserID, ProductID),

FOREIGN KEY (UserID) REFERENCES UserDetails(UserID) ON DELETE CASCADE,
FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE
);



-- PAYMENT MODE TABLE
--CREATE TABLE PaymentMode
--(
--PaymentModeID INT PRIMARY KEY IDENTITY(1,1),
--PaymentModeName VARCHAR(50) NOT NULL UNIQUE
--);

--INSERT INTO PaymentMode (PaymentModeName)
--VALUES
--('UPI'),
--('Credit Card'),
--('Debit Card');



-- BILL TABLE
CREATE TABLE Bill (
BillID INT PRIMARY KEY IDENTITY(1,1),

UserID INT NOT NULL,

--AddressID INT NOT NULL,
--PaymentModeID INT NOT NULL,

TotalBill DECIMAL(10,2) NOT NULL CHECK (TotalBill > 0),
BillDate DATETIME NOT NULL DEFAULT GETDATE(),

FOREIGN KEY (UserID) REFERENCES UserDetails(UserID),

--FOREIGN KEY (AddressID) REFERENCES Address(AddressID),
--FOREIGN KEY (PaymentModeID) REFERENCES PaymentMode(PaymentModeID)
);



-- BILL DETAILS TABLE
CREATE TABLE BillDetails(
BillDetailsID INT PRIMARY KEY IDENTITY(1,1),

BillID INT NOT NULL,
ProductID INT NOT NULL,

Qty INT NOT NULL CHECK(Qty > 0),
TotalAmt DECIMAL(10,2) NOT NULL CHECK(TotalAmt > 0),

FOREIGN KEY (BillID) REFERENCES Bill(BillID) ON DELETE CASCADE,
FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE
);

USE ProjectDB;

SELECT * FROM UserType;
SELECT * FROM UserDetails;

SELECT * FROM Categories;
SELECT * FROM Products;

SELECT * FROM Cart;

select* from Bill;
select * from BillDetails;


INSERT INTO Products (ProductName, CategoryID, ProductPrice, ProductDesc, ProductImg, ProductQty)
VALUES
-- =============================================
-- Category 1: Necklaces & Pendants
-- =============================================
('Imber Y necklace', 1, 21000.00, 'Round cut, White, 18K rose gold finish', 'images/necklaces/neck1.avif', 15),
('Imber necklace', 1, 21000.00, 'Round cut, Scattered design, White, 18K gold finish', 'images/necklaces/neck2.avif', 15),
('Dextera necklace', 1, 13900.00, 'Round cut, White, Stainless steel', 'images/necklaces/neck3.avif', 15),
('Mesmera choker', 1, 31000.00, 'Marquise cut, White, Rhodium plated', 'images/necklaces/neck4.avif', 15),
('Starlight necklace', 1, 21000.00, 'Mixed cuts, Star, White, Rhodium plated', 'images/necklaces/neck5.avif', 15),
('Swan pendant', 1, 13900.00, 'Swan, Pink, 18K rose gold finish', 'images/necklaces/neck6.avif', 15),

-- =============================================
-- Category 2: Earrings
-- =============================================
('Constella hoop earrings', 2, 9290.00, 'Round cut, White, Rhodium plated', 'images/earrings/ear1.avif', 15),
('Mesmera earrings', 2, 9290.00, 'Marquise cut, White, Rhodium plated', 'images/earrings/ear2.avif', 15),
('Constella stud earrings', 2, 11900.00, 'Round cut, White, 18K rose gold finish', 'images/earrings/ear3.avif', 15),
('Swan drop earrings', 2, 11900.00, 'Mixed cuts, Swan, White, Rhodium plated', 'images/earrings/ear4.avif', 15),

-- =============================================
-- Category 3: Rings
-- =============================================
('Una Angelic halo ring', 3, 15900.00, 'Cushion cut, White, Rhodium plated', 'images/rings/ring1.avif', 15),
('Chroma ring', 3, 10290.00, 'Mixed cuts, Star, White, Rhodium plated', 'images/rings/ring2.avif', 15),
('Idyllia motif ring', 3, 10290.00, 'Mixed cuts, Heart, Pink, Mixed metal finish', 'images/rings/ring3.avif', 15),
('Matrix Vittore ring', 3, 10140.00, 'Pear cut, White, 18K rose gold finish', 'images/rings/ring4.avif', 15),
('Stilla ring', 3, 26000.00, 'Set (2), Round cut, White, 18K gold finish', 'images/rings/ring5.avif', 15),
('Una Angelic motif ring', 3, 15900.00, 'Mixed cuts, Heart, White, Rhodium plated', 'images/rings/ring6.avif', 15),

-- =============================================
-- Category 4: Bracelets
-- =============================================
('Magic bracelet', 4, 11900.00, 'Mixed cuts, Snowflake, White, 18K gold finish', 'images/bracelets/bracelet1.avif', 15),
('Symbolica bracelet', 4, 10290.00, 'Round cut, Moon, White, Mixed Plating', 'images/bracelets/bracelet2.avif', 15),
('Dreamy bracelet', 4, 11900.00, 'Round cut, Moon, White, 18K gold finish', 'images/bracelets/bracelet3.avif', 15),
('Imber bracelet', 4, 10290.00, 'Crystal pearl, Round cut, White, Rhodium plated', 'images/bracelets/bracelet4.avif', 15),
('Emily Tennis bracelet', 4, 12900.00, 'Round cut, White, Rhodium plated', 'images/bracelets/bracelet5.avif', 15);
GO
