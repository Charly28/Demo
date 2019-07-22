using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HeadSpring.Web.Controllers
{
    public class EmployeesController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [Authorize(Roles = "HR,Admin")]
        public ActionResult Form()
        {
            return View();
        }

        public ActionResult Info()
        {
            return View();
        }
    }
}