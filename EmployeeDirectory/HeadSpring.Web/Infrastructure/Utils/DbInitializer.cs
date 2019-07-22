using HeadSpring.Core.Models;
using HeadSpring.Core.Services.Employees;
using HeadSpring.Data;
using HeadSpring.Web.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Ninject;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Linq;
using System.Transactions;
using System.Web;
using WebApp.Common.Constants;

namespace HeadSpring.Web.Infrastructure.Utils
{
    public class DbInitializer
    {
        public void CreateRolesAndDefaultAdminUser()
        {
            using (TransactionScope tscope = new TransactionScope())
            {
                using (HeadSpringDb db = new HeadSpringDb())
                {
                    ApplicationDbContext context = new ApplicationDbContext();

                    var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));
                    var UserManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));

                    if (!roleManager.RoleExists(ConfigurationManager.AppSettings[ConfigKey.AdminRole]))
                    {
                        var role = new IdentityRole();
                        role.Name = ConfigurationManager.AppSettings[ConfigKey.AdminRole];
                        roleManager.Create(role);

                        var user = new ApplicationUser();
                        user.UserName = ConfigurationManager.AppSettings[ConfigKey.EmailUsername].ToString();
                        user.Email = ConfigurationManager.AppSettings[ConfigKey.EmailUsername].ToString();

                        var chkUser = UserManager.Create(user, ConfigurationManager.AppSettings[ConfigKey.EmailPassword].ToString());

                        if (chkUser.Succeeded)
                        {
                            var result1 = UserManager.AddToRole(user.Id, ConfigurationManager.AppSettings[ConfigKey.AdminRole].ToString());

                            Employee employee = new Employee
                            {
                                UserId = user.Id,
                                Name = "Administrator",
                                LastName = "Admin",
                                MotherLastName = ".",
                                Email = ConfigurationManager.AppSettings[ConfigKey.EmailUsername].ToString(),
                                JobTitle = "Administrator",
                                Location = "Monterrey",
                                Phone = "88888888",
                                Active = true
                            };

                            db.Employees.Add(employee);
                        }
                    }

                    if (!roleManager.RoleExists(ConfigurationManager.AppSettings[ConfigKey.HRRole].ToString()))
                    {
                        var role = new IdentityRole();
                        role.Name = ConfigurationManager.AppSettings[ConfigKey.HRRole];
                        roleManager.Create(role);

                    }

                    if (!roleManager.RoleExists(ConfigurationManager.AppSettings[ConfigKey.InfoRole].ToString()))
                    {
                        var role = new IdentityRole();
                        role.Name = ConfigurationManager.AppSettings[ConfigKey.InfoRole];
                        roleManager.Create(role);
                    }

                    db.SaveChanges();
                }

                tscope.Complete();
            }
        }

    }
}