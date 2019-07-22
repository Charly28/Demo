using System.Collections.Generic;
using WebApp.Common.Infrastructure.Paging;

namespace HeadSpring.Web.Models
{
    public class HttpResult<T> where T : class
    {
        public HttpResult()
        {
        }

        public HttpResult(PagedContainer<T> container)
        {
            Rows = container.Rows;
            CurrentPage = container.CurrentPage;
            Records = container.TotalRows;
            TotalPages = container.TotalPages;
            PageSize = container.PageSize;
        }

        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public int Records { get; set; }
        public IEnumerable<T> Rows { get; set; }
    }
}