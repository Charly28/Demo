using System.Collections;
using WebApp.Common.Infrastructure.Configuration;

namespace WebApp.Common.Infrastructure.Paging
{
    public class PagerInfo
    {
        public PagerInfo()
        {
            page = Config.DefaultPageOffset;
            rows = Config.DefaultRowsLimit;
            sidx = string.Empty;
            sord = "asc";
            fullSet = false;
            fields = string.Empty;
            filters = new Hashtable();
        }

        public Hashtable filters { private get; set; }
        public int page { private get; set; }
        public int rows { private get; set; }
        public string sidx { private get; set; }
        public string sord { private get; set; }
        public bool fullSet { private get; set; }
        public string fields { private get; set; }

        public int Page
        {
            get { return page; }
        }

        public int Rows
        {
            get { return rows; }
        }

        public string SortColumn
        {
            get { return sidx; }
        }

        public string SortDirection
        {
            get { return sord; }
        }

        public bool SkipPaging
        {
            get { return fullSet; }
        }

        public Hashtable Filters
        {
            get { return filters; }
        }
    }
}
