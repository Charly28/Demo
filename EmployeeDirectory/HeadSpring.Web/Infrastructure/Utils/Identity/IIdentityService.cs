using HeadSpring.Core.Models;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HeadSpring.Web.Infrastructure.Utils.Identity
{
    public interface IIdentityService
    {
        void CreateIdentityUser(EmployeeDto employeeDto);

        void DeleteEmployee(int EmployeeId);

        EmployeeDto GetEmployee(int employeeId);
    }
}
