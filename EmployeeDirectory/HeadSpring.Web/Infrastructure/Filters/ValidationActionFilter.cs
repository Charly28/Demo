using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http.Filters;
using HeadSpring.Web.Models;


namespace HeadSpring.Web.Infrastructure.Filters
{
	public class ValidationActionFilter : ActionFilterAttribute
	{

		public override void OnActionExecuting(System.Web.Http.Controllers.HttpActionContext actionContext)
		{
			if (!actionContext.ModelState.IsValid)
			{
				var errors = actionContext.ModelState
					.Where(e => e.Value.Errors.Count > 0)
					.Select(e => new ValidationError
					{
						Name = e.Key,
						Message = e.Value.Errors.First().ErrorMessage
					}).ToArray();

				actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.BadRequest, errors);
			}
		}
	}
}