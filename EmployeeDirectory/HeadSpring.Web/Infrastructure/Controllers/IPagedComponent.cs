
using WebApp.Common.Infrastructure.Paging;

namespace HeadSpring.Web.Infrastructure.Controllers
{
    public interface IPagedComponent
    {
        PagerInfo PagerInfo { set; }
    }
}