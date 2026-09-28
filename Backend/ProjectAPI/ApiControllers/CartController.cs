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

    public class CartController : ApiController
    {
        // get particular users cart
        public List<Cart> GetCartByID(int id)
        {
            ProjectDBEntities db = new ProjectDBEntities();
            List<Cart> cart = db.Carts.Where(x => x.UserID == id).ToList();

            return cart;
        }

        // save cart
        public bool PostCart(Cart c)
        {
            ProjectDBEntities db = new ProjectDBEntities();

            Product product = db.Products.Where(x => x.ProductID == c.ProductID).FirstOrDefault();

            Cart existing = db.Carts.Where(x => x.UserID == c.UserID && x.ProductID == c.ProductID).FirstOrDefault();

            if (existing != null)
            {
                if(existing.CartQty + c.CartQty > product.ProductQty)
                {
                    return false;
                }
                existing.CartQty += c.CartQty;
            }
            else
            {
                if(c.CartQty > product.ProductQty)
                {
                    return false;
                }

                c.Price = product.ProductPrice;
                db.Carts.Add(c);
            }

            db.SaveChanges();

            return true;
        }

        // save increase and decrease chngs
        public bool PutCart(Cart c)
        {
            ProjectDBEntities db = new ProjectDBEntities();
            Cart existing = db.Carts.Where(x => x.CartID == c.CartID).FirstOrDefault();
            Product product = db.Products.Where(x => x.ProductID == existing.ProductID).FirstOrDefault();

            if (c.CartQty > existing.CartQty)
            {
                if (c.CartQty > product.ProductQty)
                {
                    return false;
                }
            }

            existing.CartQty = c.CartQty;
            db.SaveChanges();

            return true;
        }

        // remove the entire row
        public void DeleteCartByID(int id)
        {
            ProjectDBEntities db = new ProjectDBEntities();

            Cart c = db.Carts.Where(x => x.CartID == id).FirstOrDefault();

            db.Carts.Remove(c);
            db.SaveChanges();
        }

        

    }
}
