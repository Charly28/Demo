using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Metadata.Edm;
using System.Data.Objects;
using System.Linq;
using System.Text;
using System.Threading;
using WebApp.Common.Infrastructure.Paging;

namespace WebApp.Common.Infrastructure.Linq
{
    public static class QueriablesExtensions
    {
        private static string GetFilter(PagerInfo pagerInfo, EntityType elementType)
        {
            var sb = new StringBuilder();
            sb.Append(" 1 == 1 ");

            foreach (DictionaryEntry filter in pagerInfo.Filters)
            {
                EdmType type = null;
                // Damn, it turns out navigateable properties can be also included !! :|
                if (filter.Key.ToString().Contains("."))
                {
                    // Navigateable property
                    var filterVal = filter.Key.ToString().Split('.');
                    if (filterVal.Length != 2)
                        continue;

                    if (elementType.NavigationProperties.Contains(filterVal[0]))
                    {
                        if (elementType.NavigationProperties.Contains(filterVal[0]))
                        {
                            var navprop = elementType.NavigationProperties[filterVal[0]];

                            if (((EntityType)navprop.TypeUsage.EdmType).Properties.Contains(filterVal[1]))
                            {
                                type =
                                    ((EntityType)navprop.TypeUsage.EdmType).Properties[filterVal[1]].TypeUsage.EdmType;
                            }
                        }
                        else
                        {
                            continue;
                        }
                    }
                }
                else
                {
                    //Direct Normal Property
                    if (!elementType.Properties.Contains(filter.Key.ToString()))
                    {
                        continue;
                    }

                    type = elementType.Properties[filter.Key.ToString()].TypeUsage.EdmType;
                }

                if (type == null)
                {
                    continue;
                }

                switch (type.Name)
                {
                    case "Boolean":
                        sb.AppendFormat("&& it.{0}={1} ", filter.Key, filter.Value.Equals("1"));
                        break;
                    case "Int32":
                    case "Int64":
                        if (filter.Value.ToString().IndexOf(",") > 0)
                        {
                            sb.AppendFormat("&& it.{0} in {{{1}}} ", filter.Key, filter.Value);
                        }
                        else
                        {
                            sb.AppendFormat("&& it.{0}={1} ", filter.Key, filter.Value);
                        }
                        break;
                    case "String":
                        sb.AppendFormat("&& it.{0} like '%{1}%' ", filter.Key, filter.Value);
                        break;
                    case "Guid":
                        sb.AppendFormat("&& it.{0}=GUID '{1}' ", filter.Key, filter.Value);
                        break;
                    case "DateTime":
                        if (filter.Value.ToString().IndexOf(",") > 0)
                        {
                            var dateParts = filter.Value.ToString().Split(',');
                            var startDate = DateTime.Parse(dateParts[0],
                                Thread.CurrentThread.CurrentUICulture.DateTimeFormat);
                            var endDate = DateTime.Parse(dateParts[1],
                                Thread.CurrentThread.CurrentUICulture.DateTimeFormat);

                            sb.AppendFormat(
                                "&& (it.{0} >= DATETIME'{1} 00:00:00' && it.{0} <= DATETIME'{2} 23:59:59.999')",
                                filter.Key, startDate.ToString("yyyy-M-dd"), endDate.ToString("yyyy-M-dd"));
                        }
                        else
                        {
                            var t = DateTime.Parse(filter.Value.ToString(),
                                Thread.CurrentThread.CurrentUICulture.DateTimeFormat);
                            sb.AppendFormat(
                                "&& (it.{0} >= DATETIME'{1} 00:00:00' && it.{0} <= DATETIME'{1} 23:59:59.999')",
                                filter.Key, t.ToString("yyyy-M-dd"));
                        }
                        break;
                }
            }

            return (sb.ToString());
        }

        public static ObjectQuery<T> FilterSet<T>(this ObjectSet<T> source, PagerInfo pagerData) where T : class
        {
            var t = source.Where(GetFilter(pagerData, source.EntitySet.ElementType));

            return t;
        }

        public static IQueryable<T> PagedSet<T>(this IQueryable<T> source, PagerInfo pagerData) where T : class
        {
            IQueryable<T> r = source;

            if (pagerData.SortColumn != String.Empty)
            {
                var sortColumn = String.Format("it.{0}", pagerData.SortColumn);
                r = pagerData.SortDirection.Equals("asc")
                    ? source.OrderBy(sortColumn)
                    : source.OrderBy(sortColumn + " desc");
            }
            else
            {
                var sortProp = r.ElementType.GetProperty("Name") != null
                    ? "Name"
                    : String.Format("{0}Id", r.ElementType.Name);

                r = pagerData.SortDirection.Equals("asc")
                    ? r.OrderBy(sortProp)
                    : r.OrderBy(sortProp + " desc");
            }

            if (pagerData.SkipPaging)
            {
                return r;
            }

            return Queryable.Take(Queryable.Skip(r, ((Math.Abs(pagerData.Page - 1)) * pagerData.Rows)), pagerData.Rows);
        }

        public static IEnumerable<TSource> DistinctBy<TSource, TKey>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector)
        {
            var seenKeys = new HashSet<TKey>();

            foreach (var element in source)
            {
                if (seenKeys.Add(keySelector(element)))
                {
                    yield return element;
                }
            }
        }

        public static IQueryable<T> FilterSet<T>(this IEnumerable enumerable, PagerInfo pagerInfo)
        {
            var sb = new StringBuilder();
            sb.Append(" 1 == 1 ");

            var type = enumerable.GetType().GetGenericArguments()[0];

            foreach (DictionaryEntry filter in pagerInfo.Filters)
            {
                var property = type.GetProperty(filter.Key.ToString());
                if (property == null)
                {
                    continue;
                }

                switch (property.PropertyType.Name)
                {
                    case "Boolean":
                        sb.AppendFormat("&& it.{0}={1} ", filter.Key, filter.Value.Equals("1"));
                        break;
                    case "Int32":
                    case "Int64":
                        sb.AppendFormat("&& it.{0}={1} ", filter.Key, filter.Value);
                        break;
                    case "String":
                        sb.AppendFormat("&& it.{0}.ToLower().Contains(\"{1}\") ", filter.Key,
                            filter.Value.ToString().ToLower());
                        break;
                    case "Guid":
                        sb.AppendFormat("&& it.{0}=\"{1}\" ", filter.Key, filter.Value);
                        break;
                    case "DateTime":
                        var t = DateTime.Parse(filter.Value.ToString(),
                            Thread.CurrentThread.CurrentUICulture.DateTimeFormat);

                        sb.AppendFormat(
                            "&& (it.{0} >= DATETIME'{1} 00:00:00' && it.{0} <= DATETIME'{1} 23:59:59.999')", filter.Key,
                            t.ToString("yyyy-M-dd"));
                        break;
                }
            }

            return (IQueryable<T>)enumerable.AsQueryable().Where(sb.ToString());
        }
    }
}
