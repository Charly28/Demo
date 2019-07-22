using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Runtime.Serialization;
using WebApp.Common.Infrastructure.Linq;

namespace WebApp.Common.Infrastructure.Paging
{
    [Serializable]
    public class PagedContainer<T> where T : class
    {
        [DataMember]
        public IEnumerable<T> Rows { get; set; }
        [DataMember]
        public int TotalRows { get; set; }
        [DataMember]
        public int PageSize { get; set; }
        [DataMember]
        public int CurrentPage { get; set; }
        public int Records
        {
            get { return this.TotalPages; }
        }

        private int _defaultPageSize = string.IsNullOrWhiteSpace(ConfigurationManager.AppSettings["WebApp.Common.Paging.DefaultPageSize"]) ? 10 : int.Parse(ConfigurationManager.AppSettings["WebApp.Common.Paging.DefaultPageSize"]);

        public PagedContainer(IEnumerable<T> records, int totalRows, PagerInfo pagerData)
        {
            Rows = records.ToList();
            this.TotalRows = totalRows;
            this.PageSize = pagerData.SkipPaging ? totalRows : pagerData.Rows;
            this.CurrentPage = (pagerData.Page > 0) ? pagerData.Page : 1;
        }


        public PagedContainer(List<T> records, int totalRows, int? page, int? pageSize)
        {
            this.Rows = records;
            this.TotalRows = totalRows;
            this.PageSize = (pageSize.HasValue) ? pageSize.Value : _defaultPageSize;

            this.CurrentPage = (page.HasValue && page > 0) ? page.Value : 1;
        }

        public PagedContainer(IEnumerable<T> fullSet, PagerInfo pagerData)
        {
            var localQuery = fullSet.FilterSet<T>(pagerData);

            TotalRows = localQuery.Count();
            Rows = localQuery.PagedSet(pagerData).ToList();
            PageSize = pagerData.SkipPaging ? TotalRows : pagerData.Rows;
            CurrentPage = (pagerData.Page > 0) ? pagerData.Page : 1;
        }

        public int TotalPages
        {
            get
            {
                int result = 0;
                if (this.PageSize > 0)
                {
                    result = (int)Math.Ceiling(1.0 * this.TotalRows / this.PageSize);
                }

                return result;

            }
        }

    }
}
