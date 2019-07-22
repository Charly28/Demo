using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(HeadSpring.Web.Startup))]
namespace HeadSpring.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
