using ProjectAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace ProjectAPI.ApiControllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*", exposedHeaders: "SampleHeader")]

    public class ProductController : ApiController
    {
        public List<Product> GetProducts()
        {
            ProjectDBEntities db = new ProjectDBEntities();
            List<Product> productList = db.Products.OrderBy(x => x.ProductID).ToList();
            return productList;
        }

        public void PostProduct(Product p)
        {
            ProjectDBEntities db = new ProjectDBEntities();
            db.Products.Add(p);
            db.SaveChanges();
        }

        public void PutProduct(Product p)
        {
            ProjectDBEntities db = new ProjectDBEntities();

            Product existing = db.Products.Where(x => x.ProductID == p.ProductID).FirstOrDefault();

            existing.ProductName = p.ProductName;
            existing.CategoryID = p.CategoryID;
            existing.ProductPrice = p.ProductPrice;
            existing.ProductQty = p.ProductQty;
            existing.ProductImg = p.ProductImg;
            existing.ProductDesc = p.ProductDesc;

            db.SaveChanges();
        }

        public bool DeleteProduct(int id, bool forceDelete)
        {
            ProjectDBEntities db = new ProjectDBEntities();

            Product product = db.Products.Where(x => x.ProductID == id).FirstOrDefault();

            if(product == null)
            {
                return false;
            }

            bool ordersConnected = db.BillDetails.Where(x => x.ProductID == id).Any();

            if(ordersConnected && forceDelete == false)
            {
                return false;
            }

            if (forceDelete)
            {
                List<int> billIDs = db.BillDetails.Where(x => x.ProductID == id).Select(x => x.BillID).Distinct().ToList();

                foreach (int billID in billIDs)
                {
                    Bill bill = db.Bills.Where(x => x.BillID == billID).FirstOrDefault();

                    if (bill != null)
                    {
                        db.Bills.Remove(bill);
                    }
                }
            }

            db.Products.Remove(product);
            db.SaveChanges();

            return true;
        }
    }
}
