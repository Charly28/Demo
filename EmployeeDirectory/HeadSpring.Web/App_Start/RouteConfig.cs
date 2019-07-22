using System.Web.Mvc;
using System.Web.Routing;
using AttributeRouting.Web.Http;
using AttributeRouting.Web.Http.WebHost;
using AttributeRouting.Web.Mvc;
using System.Web.Http;


namespace HeadSpring.Web
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Account", action = "Login", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Api",
                url: "rest/{action}",
                namespaces: new[] { "HeadSpring.Web.Controllers" });

             routes.MapAttributeRoutes();
        }
    }
}
