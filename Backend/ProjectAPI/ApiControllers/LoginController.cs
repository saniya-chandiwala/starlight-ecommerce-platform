using ProjectAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ProjectAPI.ApiControllers
{
    public class LoginController : ApiController
    {
        // used in login.js for checking if user details from db
        public int PostForLogin(UserDetail user)
        {
            ProjectDBEntities db = new ProjectDBEntities();

            UserDetail userFound = db.UserDetails.Where(x => x.UserEmail == user.UserEmail && x.UserPassword == user.UserPassword).FirstOrDefault();

            if (userFound != null)
            {
                return userFound.UserID;
            }

            return 0;
        }
    }
}
