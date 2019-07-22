using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApp.Common.Constants;

namespace HeadSpring.Web.Controllers
{

    public class HomeController : Controller
    {
        [HandleError]
        public ActionResult Index()
        {
            return View();
        }
    }
}