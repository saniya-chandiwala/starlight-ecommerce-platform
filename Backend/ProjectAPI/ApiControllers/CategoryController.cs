using ProjectAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ProjectAPI.ApiControllers
{
    public class CategoryController : ApiController
    {
        public List<Category> GetCategories()
        {
            ProjectDBEntities db = new ProjectDBEntities();
        
            List<Category> categoryList = db.Categories.OrderBy(x => x.CategoryID).ToList();
            return categoryList;
        }
    }
}
