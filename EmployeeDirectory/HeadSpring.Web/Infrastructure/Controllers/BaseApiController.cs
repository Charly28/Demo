using HeadSpring.Web.Infrastructure.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using WebApp.Common.Infrastructure.Paging;

namespace HeadSpring.Web.Infrastructure
{
    public class BaseApiController : ApiController, IPagedComponent
    {
        protected PagerInfo _pagerInfo;

        public PagerInfo PagerInfo
        {
            set { _pagerInfo = value; }
        }
    }
}