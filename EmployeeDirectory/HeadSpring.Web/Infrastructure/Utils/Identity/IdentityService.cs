using HeadSpring.Core.Exceptions;
using HeadSpring.Core.Models;
using HeadSpring.Data;
using HeadSpring.Web.App_GlobalResources;
using HeadSpring.Web.Infrastructure.Utils.Identity;
using HeadSpring.Web.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using WebApp.Common.Constants;
using WebApp.Common.Transactions;

namespace HeadSpring.Web.Infrastructure.Utils
{
    public class IdentityService : IIdentityService
    {
        public void CreateIdentityUser(EmployeeDto employeeDto)
        {
            using (var tScope = TransactionFactory.GetScope(90))
            {
                using (HeadSpringDb db = new HeadSpringDb())
                {
                    ApplicationDbContext context = new ApplicationDbContext();
                    var UserManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));
                    ApplicationUser user = new ApplicationUser();

                    if (!Utilities.IsValidEmail(employeeDto.Email))
                    {
                        throw new BusinessException(Global.Email_Invalid_Error);
                    }

                    if (employeeDto.EmployeeId <= 0 || employeeDto.EmployeeId == null)
                    {
                        Employee employee = new Employee
                        {
                            Name = employeeDto.Name,
                            LastName = employeeDto.LastName,
                            MotherLastName = employeeDto.MotherLastName,
                            Email = employeeDto.Email,
                            Phone = employeeDto.Phone,
                            JobTitle = employeeDto.JobTitle,
                            Location = employeeDto.Location,
                            Active = employeeDto.Active
                        };

                        if (employeeDto.RequiresUser)
                        {
                            if (db.AspNetUsers.Any(x => x.UserName == employeeDto.Email))
                            {
                                throw new BusinessException(Global.User_Exists_Error);
                            }

                            if (string.IsNullOrEmpty(employeeDto.RoleName))
                            {
                                throw new BusinessException(Global.Role_Error_Required);
                            }

                            user.UserName = employeeDto.Email;
                            user.Email = employeeDto.Email;

                            var chkUser = UserManager.Create(user, ConfigurationManager.AppSettings[ConfigKey.EmailPassword].ToString());

                            if (chkUser.Succeeded)
                            {
                                employee.UserId = user.Id;
                                var result1 = UserManager.AddToRole(user.Id, employeeDto.RoleName);
                            }

                            else
                            {
                                throw new BusinessException(Global.User_Invalid_Error);
                            }
                        }

                        db.Employees.Add(employee);
                    }

                    else
                    {
                        Employee employee = db.Employees.SingleOrDefault(x => x.EmployeeId == employeeDto.EmployeeId);
                        string roleId = string.Empty;
                        AspNetRole role;

                        employee.Name = employeeDto.Name;
                        employee.LastName = employeeDto.LastName;
                        employee.MotherLastName = employeeDto.MotherLastName;
                        employee.Phone = employeeDto.Phone;
                        employee.Location = employeeDto.Location;
                        employee.JobTitle = employeeDto.JobTitle;
                        employee.Active = employeeDto.Active;

                        //Updating Role 
                        if (!string.IsNullOrEmpty(employee.UserId) && employeeDto.RequiresUser)
                        {
                            user = UserManager.FindById(employeeDto.UserId);
                            if (user.Roles.Any())
                            {
                                roleId = user.Roles.SingleOrDefault().RoleId;
                                role = db.AspNetRoles.SingleOrDefault(x => x.Id == roleId);
                                if (role.Name != employeeDto.RoleName)
                                {
                                    UserManager.RemoveFromRole(user.Id, role.Name);
                                    UserManager.AddToRole(user.Id, employeeDto.RoleName);
                                }
                            }
                        }

                        //Creating user for existing employee
                        if (employeeDto.RequiresUser && string.IsNullOrEmpty(employee.UserId))
                        {
                            if (db.AspNetUsers.Any(x => x.UserName == employeeDto.Email))
                            {
                                throw new BusinessException(Global.User_Exists_Error);
                            }

                            if (string.IsNullOrEmpty(employeeDto.RoleName))
                            {
                                throw new BusinessException(Global.Role_Error_Required);
                            }

                            user.UserName = employeeDto.Email;
                            user.Email = employeeDto.Email;

                            var chkUser = UserManager.Create(user, ConfigurationManager.AppSettings[ConfigKey.EmailPassword].ToString());

                            if (chkUser.Succeeded)
                            {
                                employee.UserId = user.Id;
                                var result1 = UserManager.AddToRole(user.Id, employeeDto.RoleName);
                            }

                            else
                            {
                                throw new BusinessException(Global.User_Invalid_Error);
                            }

                        }

                        //Deleting user for existing employee
                        else if (!employeeDto.RequiresUser && !string.IsNullOrEmpty(employee.UserId))
                        {
                            employee.UserId = string.Empty;
                            user = UserManager.FindById(employeeDto.UserId);
                            if (user.Roles.Any())
                            {
                                roleId = user.Roles.SingleOrDefault().RoleId;
                                role = db.AspNetRoles.SingleOrDefault(x => x.Id == roleId);
                                UserManager.AddToRole(user.Id, role.Name);
                            }
                            UserManager.Delete(user);
                        }
                    }

                    db.SaveChanges();
                }

                tScope.Complete();
            }
        }

        public void DeleteEmployee(int EmployeeId)
        {
            using (HeadSpringDb db = new HeadSpringDb())
            {
                Employee employee = db.Employees.SingleOrDefault(x => x.EmployeeId == EmployeeId);

                if (employee != null)
                {
                    if (string.IsNullOrEmpty(employee.UserId))
                    {
                        ApplicationDbContext context = new ApplicationDbContext();
                        var UserManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));
                        ApplicationUser user = UserManager.FindById(employee.UserId);

                        var roles = UserManager.GetRoles(user.Id);
                        if (roles.Any())
                        {
                            UserManager.RemoveFromRolesAsync(user.Id, roles.ToArray());
                        }
                        UserManager.Delete(user);
                    }

                    db.Employees.Remove(employee);
                    db.SaveChanges();
                }
            }
        }

        public EmployeeDto GetEmployee(int employeeId)
        {
            using (HeadSpringDb db = new HeadSpringDb())
            {
                EmployeeDto employeeDto = new EmployeeDto();
                Employee employee = db.Employees.SingleOrDefault(x => x.EmployeeId == employeeId);
                if (employee != null)
                {
                    employeeDto = (from e in db.Employees
                                   where e.EmployeeId == employeeId
                                   select new EmployeeDto
                                   {
                                       EmployeeId = e.EmployeeId,
                                       Name = e.Name,
                                       LastName = e.LastName,
                                       MotherLastName = e.MotherLastName,
                                       Location = e.Location,
                                       JobTitle = e.JobTitle,
                                       Phone = e.Phone,
                                       Email = e.Email,
                                       Active = e.Active,
                                       RequiresUser = false,
                                   }).SingleOrDefault();

                    //Check if employee has a user
                    if (!string.IsNullOrEmpty(employee.UserId))
                    {
                        ApplicationDbContext context = new ApplicationDbContext();
                        var UserManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));
                        ApplicationUser user = UserManager.FindById(employee.UserId);
                        string roleId = user.Roles.SingleOrDefault().RoleId;

                        employeeDto.UserId = employee.UserId;
                        employeeDto.RoleName = (from r in db.AspNetRoles
                                                where r.Id == roleId
                                                select r).SingleOrDefault().Name;

                        employeeDto.RequiresUser = true;
                    }
                }

                return employeeDto;
            }
        }
    }
}