using Microsoft.AspNet.Identity;
using System.Text;
using System.Web.Mvc;
using System.Configuration;
using WebApp.Common.Constants;

namespace HeadSpring.Web.Infrastructure
{
    public static class HtmlHelpers
    {
        public static MvcHtmlString CustomMenu(this HtmlHelper helper)
        {
            var user = System.Web.HttpContext.Current.User;

            StringBuilder sb = new StringBuilder(200);
            sb.Append("<ul class=\"nav navbar-nav\">");
            if (user.IsInRole(ConfigurationManager.AppSettings[ConfigKey.AdminRole].ToString()))
            {
                sb.AppendFormat("<li><a href='/Employees/Index' Title='Employees List'>Employees</a></li>");
               // sb.AppendFormat("<li><a href='/Admin/Index' Title='Admin'>Admin</a></li>");
            }

            if (user.IsInRole(ConfigurationManager.AppSettings[ConfigKey.HRRole].ToString()) || user.IsInRole(ConfigurationManager.AppSettings[ConfigKey.InfoRole].ToString()))
            {
                sb.AppendFormat("<li><a href='/Employees/Index' Title='Employees List'>Employees</a></li>");
            }

            sb.Append("</ul>");


            return MvcHtmlString.Create(sb.ToString());
        }

        public static MvcHtmlString Toolbar(this HtmlHelper helper)
        {
            var user = System.Web.HttpContext.Current.User;

            StringBuilder sb = new StringBuilder(800);
            sb.Append("<div class=\"error-actions\">");
            if (user.IsInRole(ConfigurationManager.AppSettings[ConfigKey.AdminRole].ToString()) || user.IsInRole(ConfigurationManager.AppSettings[ConfigKey.HRRole].ToString()))
            {
                sb.AppendFormat("<a title=\"Add\" class=\"btn btn-primary btn-sm add\"><span class=\"glyphicon glyphicon-plus\"></span></a>");
                sb.AppendFormat("&nbsp;");
                sb.AppendFormat("<a title=\"Edit\" class=\"btn btn-primary btn-sm edit\"><span class=\"glyphicon glyphicon-pencil\"></span></a>");
                sb.AppendFormat("&nbsp;");
                sb.AppendFormat("<a title=\"Delete\" class=\"btn btn-primary btn-sm delete\"><span class=\"glyphicon glyphicon-trash\"></span></a>");
                sb.AppendFormat("&nbsp;");
                sb.AppendFormat("<a title=\"Info\" class=\"btn btn-primary btn-sm info\"><span class=\"glyphicon glyphicon-info-sign\"></span></a>");
            }

            else if (user.IsInRole(ConfigurationManager.AppSettings[ConfigKey.InfoRole].ToString()))
            {
                sb.AppendFormat("<a title=\"Info\" class=\"btn btn-primary btn-sm info\"><span class=\"glyphicon glyphicon-info-sign\"></span></a>");
            }

            sb.Append("</div>");

            return MvcHtmlString.Create(sb.ToString());
        }
    }
}