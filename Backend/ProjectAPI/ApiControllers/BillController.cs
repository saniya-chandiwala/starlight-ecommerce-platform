using ProjectAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ProjectAPI.ApiControllers
{
    public class BillController : ApiController
    {
        // get all bills
        public List<Bill> GetBills()
        {
            ProjectDBEntities db = new ProjectDBEntities();

            List<Bill> bills = db.Bills.OrderByDescending(x => x.BillDate).ToList();
            return bills;
        }

        // get a particular users bill
        public List<Bill> GetBillByID(int id)
        {
            ProjectDBEntities db = new ProjectDBEntities();
            List<Bill> bills = db.Bills.Where(x => x.UserID == id).OrderByDescending(x => x.BillDate).ToList();

            return bills;
        }

        // generate bill
        public bool PostBill(int id)
        {
            ProjectDBEntities db = new ProjectDBEntities();

            List<Cart> cartList = db.Carts.Where(x => x.UserID == id).ToList();

            if (cartList.Count == 0)
            {
                return false;
            }

            // creating a bill
            Bill bill = new Bill();
            bill.UserID = id;
            bill.TotalBill = 0;
            bill.BillDate = DateTime.Now;

            db.Bills.Add(bill);
            db.SaveChanges();

            decimal totalBill = 0;

            // to add items in bill details table
            foreach (Cart item in cartList)
            {
                Product p = db.Products.Where(x => x.ProductID == item.ProductID).FirstOrDefault();

                // HttpResponseMessage
                if (p.ProductQty < item.CartQty)
                {
                    return false;
                }

                decimal itemTotal = p.ProductPrice * item.CartQty;

                BillDetail details = new BillDetail();

                details.BillID = bill.BillID;
                details.ProductID = p.ProductID;
                details.Qty = item.CartQty;
                details.TotalAmt = itemTotal;

                db.BillDetails.Add(details);

                totalBill += itemTotal;

                p.ProductQty -= item.CartQty;
            }

            bill.TotalBill = totalBill;

            db.Carts.RemoveRange(cartList);

            db.SaveChanges();

            return true;
        }
    }
}
