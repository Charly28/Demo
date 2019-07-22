using HeadSpring.Core.Exceptions;
using HeadSpring.Web.Models;
using log4net;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http.Filters;

namespace HeadSpring.Web.Infrastructure
{
    public class ExceptionFilter : ExceptionFilterAttribute
    {
        public override void OnException(HttpActionExecutedContext actionExecutedContext)
        {
            var logger = LogManager.GetLogger(typeof(ExceptionFilter));

            if (actionExecutedContext.Response == null)
            {
                actionExecutedContext.Response = new HttpResponseMessage();
                var errorType = actionExecutedContext.Exception.GetType();

                if (errorType == typeof(BusinessException))
                {
                    var errors = new List<ValidationError>();
                    var error = new ValidationError();

                    errors.Add(error);
                    error.Name = "BusinessException";
                    error.Message = actionExecutedContext.Exception.Message;
                    actionExecutedContext.Response = actionExecutedContext.Request.CreateResponse(HttpStatusCode.BadRequest, errors);
                    logger.Warn("Business Exception", actionExecutedContext.Exception);
                }

                else if (errorType == typeof(ValidationException))
                {
                    var ex = actionExecutedContext.Exception as ValidationException;
                    ValidationError error = new ValidationError();
                    error.Name = "ValidationException";
                    error.Message = ex.Message;
                    actionExecutedContext.Response = actionExecutedContext.Request.CreateResponse(HttpStatusCode.BadRequest, error);
                    logger.Error("Model Validation Exception", actionExecutedContext.Exception);
                }

                else
                {
                    actionExecutedContext.Response.StatusCode = HttpStatusCode.InternalServerError;
                    actionExecutedContext.Response.Content = new StringContent("Internal Server Error");
                    logger.Error("Application Exception", actionExecutedContext.Exception);
                }
            }
            base.OnException(actionExecutedContext);
        }
    }
}