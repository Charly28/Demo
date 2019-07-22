using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Ninject.Extensions.Interception;

namespace HeadSpring.Core.Infrastructure.Advisors
{
    public class ModelValidatorInterceptor : SimpleInterceptor
    {
        protected override void BeforeInvoke(IInvocation invocation)
        {
            foreach (object argument in invocation.Request.Arguments)
            {
                if (argument != null && argument.GetType().FullName.Contains(".Model."))
                {
                    ValidationContext ctx = new ValidationContext(argument, null, null);
                    var errors = new List<ValidationResult>();
                    Validator.ValidateObject(argument, ctx);
                }
            }

            base.BeforeInvoke(invocation);
        }
    }
}
