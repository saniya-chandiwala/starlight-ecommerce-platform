using ProjectAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ProjectAPI.ApiControllers
{
    public class BillDetailsController : ApiController
    {
        public List<BillDetail> GetBillDetails(int id)
        {
            ProjectDBEntities db = new ProjectDBEntities();
            return db.BillDetails.Where(x => x.BillID == id).ToList();
        }
    }
}
