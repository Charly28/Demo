using System.Web;
using System.Web.Optimization;

namespace HeadSpring.Web
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                                        "~/Scripts/HeadSpring.js",
                                        "~/Scripts/namespace.js",
                                        "~/Scripts/plugins/remedial.js",
                                        "~/Scripts/jquery-2.1.4.js",
                                        "~/Scripts/plugins/jquery-migrate-1.0.0.js",
                                        "~/Scripts/jquery-ui-1.12.1.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                                         "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                                         "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                                         "~/Scripts/bootstrap.min.js",
                                         "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                                         "~/Content/boostrap-theme.min.css",
                                        "~/Content/themes/base/jquery-ui.min.css",
                                        "~/Content/ui.jqgrid-bootstrap.css",
                                        "~/Content/bootstrap.min.css",
                                        "~/Content/bootstrap-toggle.min.css",
                                        //"~/Content/ui.jqgrid.css",
                                        "~/Content/site.css"));


            bundles.Add(new ScriptBundle("~/bundles/plugins").Include(
                                         "~/Scripts/plugins/jqGrid/grid.locale-en.js",
                                         "~/Scripts/plugins/jqGrid/jquery.jqGrid.min.js",
                                         "~/Scripts/plugins/knockout-3.4.2.js",
                                         "~/Scripts/plugins/knockout-3.4.2.debug.js",
                                         "~/Scripts/plugins/jquery.validate.min.js",
                                         "~/Scripts/plugins/bootstrap-toggle.min.js",
                                        "~/Scripts/plugins/KoBinders.js"));

            bundles.Add(new ScriptBundle("~/bundles/controls").Include(
                                         "~/Scripts/Controls/Grid.js",
                                          "~/Scripts/Controls/GridFormatter.js",
                                          "~/Scripts/Controls/Common.js"));

            bundles.Add(new ScriptBundle("~/bundles/views").Include(
                                         "~/Scripts/Employees/Index.js",
                                         "~/Scripts/Employees/Form.js",
                                          "~/Scripts/Employees/Info.js"));
        }
    }
}
