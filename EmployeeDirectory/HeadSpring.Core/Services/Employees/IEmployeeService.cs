using HeadSpring.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebApp.Common.Infrastructure.Paging;

namespace HeadSpring.Core.Services.Employees
{
    public interface IEmployeeService
    {
        PagedContainer<EmployeeDto> GetEmployees(PagerInfo pager);
    }
}
