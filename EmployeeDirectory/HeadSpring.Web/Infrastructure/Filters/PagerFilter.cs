using System;
using System.Collections;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Formatters.Binary;
using System.Web;
using System.Web.Http.Filters;
using HeadSpring.Web.Infrastructure.Controllers;
using WebApp.Common.Infrastructure.Paging;

namespace HeadSpring.Web.Infrastructure.Filters
{
    public class PagerFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(System.Web.Http.Controllers.HttpActionContext actionContext)
        {
            IPagedComponent pagedComponent = actionContext.ControllerContext.Controller as IPagedComponent;

            if (pagedComponent != null)
            {
                var r = HttpUtility.ParseQueryString(actionContext.Request.RequestUri.Query);
                var pagingKeys = typeof(PagerInfo).GetProperties().Where(x => x.CanWrite);
                var arry = pagingKeys.Select(x => x.Name).ToArray();
                var outOfBoundsKeys = r.AllKeys.Except(arry).Where(x => x != "_" && x != null);
                PagerInfo pager = new PagerInfo();

                foreach (PropertyInfo pagingKey in pagingKeys.ToArray())
                {
                    var pagingValue = r[pagingKey.Name];
                    if (pagingValue != null)
                    {
                        object value = Convert.ChangeType(pagingValue, pagingKey.PropertyType);

                        pager.GetType().GetProperty(pagingKey.Name).SetValue(pager, value, null);
                    }
                }

                //Set outbound columns as filters
                foreach (string filterKey in outOfBoundsKeys)
                {
                    if (r[filterKey] == null) continue;

                    pager.Filters.Add(filterKey, r[filterKey]);
                }
                pagedComponent.PagerInfo = pager;
            }

            base.OnActionExecuting(actionContext);
        }

        //Ok so this is only for testing purposes, the thing here is to only include the columns that were requested as to not transfer everything
        //but just que columns that i want
        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            var requestedColumnNames = HttpUtility.ParseQueryString(actionExecutedContext.Request.RequestUri.Query)["fields"];

            //If and only if we have specific fields
            if (requestedColumnNames != null)
            {
                string[] requestedColums = requestedColumnNames.Split(',');
                //and our column count is valid aka gt 0

                if (requestedColums.Length == 0)
                {
                    base.OnActionExecuted(actionExecutedContext);
                    return;
                }

                //so this is the dangerous part, because we dig into a private property that might change overtime, so ding ding ding, its ok to feel dirty
                if (actionExecutedContext.Response == null)
                {
                    base.OnActionExecuted(actionExecutedContext);
                    return;
                }

                var privateProperty = ((ObjectContent)actionExecutedContext.Response.Content).Value;

                //If for any reason microsoft decided to change the name of our private variable, lets just skip the rest and continue as if nothing had happened
                if (privateProperty == null)
                {
                    base.OnActionExecuted(actionExecutedContext);
                    return;
                }

                var rows = privateProperty.GetType().GetProperty("Rows").GetValue(privateProperty, new object[] { });

                if (rows != null && (rows as IEnumerable == null))
                {
                    base.OnActionExecuted(actionExecutedContext);
                    return;
                }

                foreach (var row in rows as IEnumerable)
                {
                    //this is messy, get properties ( we fave nullable types )
                    var rowProperties = row.GetType().GetProperties();
                    // so we get the properties that we want to nullify
                    var filteredProperties = rowProperties.Where(x => !requestedColums.Contains(x.Name));
                    //foreach of this row properties that are NO in the requested column array, we nullify them
                    filteredProperties.ToList().ForEach(currentPropertyInfo => currentPropertyInfo.SetValue(row, null, null));
                }
            }

            base.OnActionExecuted(actionExecutedContext);
        }
    }
}