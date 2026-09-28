using ProjectAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ProjectAPI.ApiControllers
{
    public class RegisterController : ApiController
    {
        // used in signup.js for checking if user is already present in db if now then registering
        public bool PostForSignUp(UserDetail user)
        {
            ProjectDBEntities db = new ProjectDBEntities();

            UserDetail existingUser = db.UserDetails.Where(x => x.UserEmail == user.UserEmail).FirstOrDefault();

            if (existingUser != null)
            {
                return false;
            }

            user.TypeID = 2;

            db.UserDetails.Add(user);
            db.SaveChanges();

            return true;
        }
    }
}
