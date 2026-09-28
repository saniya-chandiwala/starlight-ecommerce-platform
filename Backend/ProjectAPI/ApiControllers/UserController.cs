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

    public class UserController : ApiController
    {
        // to display name on welcome area
        public UserDetail GetUserByID(int id)
        {
            ProjectDBEntities db = new ProjectDBEntities();

            UserDetail user = db.UserDetails.Where(x => x.UserID == id).FirstOrDefault();

            return user;
        }

        public List<UserDetail> GetUsers()
        {
            ProjectDBEntities db = new ProjectDBEntities();

            List<UserDetail> userList = db.UserDetails.OrderBy(x => x.UserID).ToList();
            return userList;
        }

        // Add user
        public bool PostUser(UserDetail user)
        {
            ProjectDBEntities db = new ProjectDBEntities();

            UserDetail existingUser = db.UserDetails.Where(x => x.UserEmail == user.UserEmail).FirstOrDefault();

            if (existingUser != null)
            {
                return false;
            }

            db.UserDetails.Add(user);
            db.SaveChanges();

            return true;
        }


        // Update user
        public bool PutUser(UserDetail user)
        {
            ProjectDBEntities db = new ProjectDBEntities();

            UserDetail existingUser = db.UserDetails.Where(x => x.UserID == user.UserID).FirstOrDefault();

            if (existingUser == null)
            {
                return false;
            }

            existingUser.UserName = user.UserName;
            existingUser.UserEmail = user.UserEmail;
            existingUser.UserPassword = user.UserPassword;
            existingUser.TypeID = user.TypeID;

            db.SaveChanges();

            return true;
        }


        // Delete user
        public bool DeleteUser(int id)
        {
            ProjectDBEntities db = new ProjectDBEntities();

            UserDetail user = db.UserDetails.Where(x => x.UserID == id).FirstOrDefault();

            if (user == null)
            {
                return false;
            }

            db.UserDetails.Remove(user);
            db.SaveChanges();

            return true;
        }

    }
}
