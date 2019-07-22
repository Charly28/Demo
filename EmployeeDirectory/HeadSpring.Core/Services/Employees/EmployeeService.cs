using HeadSpring.Core.Exceptions;
using HeadSpring.Core.Models;
using HeadSpring.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Transactions;
using WebApp.Common.Infrastructure.Linq;
using WebApp.Common.Infrastructure.Paging;


namespace HeadSpring.Core.Services.Employees
{
    public class EmployeeService : IEmployeeService
    {
        public AspNetUser GetCurrentUser(string userName)
        {
            using (HeadSpringDb db = new HeadSpringDb())
            {
                return db.AspNetUsers.SingleOrDefault(x => x.UserName == userName);
            }
        }

        public PagedContainer<EmployeeDto> GetEmployees(PagerInfo pager)
        {
            using (HeadSpringDb db = new HeadSpringDb())
            {
                var user = System.Web.HttpContext.Current.User;
                AspNetUser identityUser = GetCurrentUser(user.Identity.Name);

                IQueryable<EmployeeDto> query = (from e in db.Employees
                                                 select new EmployeeDto
                                                 {
                                                     EmployeeId = e.EmployeeId,
                                                     UserId = e.UserId,
                                                     Name = e.Name,
                                                     Location = e.Location,
                                                     LastName = e.LastName,
                                                     Email = e.Email,
                                                     Active = e.Active,
                                                     RequiresUser = string.IsNullOrEmpty(e.UserId) ? false : true
                                                 }).FilterSet<EmployeeDto>(pager);

                int count = query.Count();

                List<EmployeeDto> results = (from p in query
                                             select p).PagedSet(pager).ToList();

                return new PagedContainer<EmployeeDto>(results, count, pager);
            }
        }

    }
}
