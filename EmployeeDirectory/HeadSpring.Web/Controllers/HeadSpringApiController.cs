using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using AttributeRouting;
using AttributeRouting.Web.Http;
using Ninject;
using HeadSpring.Core.Services.Employees;
using WebApp.Common.Infrastructure.Paging;
using HeadSpring.Core.Models;
using HeadSpring.Web.Models;
using HeadSpring.Web.Infrastructure;
using HeadSpring.Web.Infrastructure.Filters;
using HeadSpring.Web.Infrastructure.Utils.Identity;

namespace HeadSpring.Web.Controllers
{
    public class HeadSpringApiController : BaseApiController
    {
        [Inject]
        public IEmployeeService Services { get; set; }

        [Inject]
        public IIdentityService IdentityService { get; set; }

        [GET("/rest/Employees")]
        [HttpGet]
        [Authorize]
        [PagerFilter]
        public HttpResponseMessage Employees()
        {

            var result = Services.GetEmployees(_pagerInfo);
            return Request.CreateResponse(HttpStatusCode.OK, new HttpResult<EmployeeDto>(result));
        }

        [GET("/rest/Employees/{EmployeeId}")]
        [HttpGet]
        public HttpResponseMessage GetEmployee(int employeeId)
        {
            EmployeeDto result = IdentityService.GetEmployee(employeeId);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [POST("/rest/Employees")]
        [HttpPost]
        [Authorize]
        public HttpResponseMessage Add([FromBody]EmployeeDto employeeDto)
        {
            IdentityService.CreateIdentityUser(employeeDto);
            return Request.CreateResponse(HttpStatusCode.Created);
        }

        [PUT("/rest/Employees/{EmployeeId}")]
        [HttpPut]
        public HttpResponseMessage Update([FromBody]EmployeeDto employeeDto, string EmployeeId)
        {
            IdentityService.CreateIdentityUser(employeeDto);
            return Request.CreateResponse(HttpStatusCode.Created);
        }

        [DELETE("/rest/Employees/{EmployeeId}")]
        [HttpDelete]
        [Authorize]
        public HttpResponseMessage Delete(int employeeId)
        {
            IdentityService.DeleteEmployee(employeeId);

            return Request.CreateResponse(HttpStatusCode.NoContent);
        }
    }
}
