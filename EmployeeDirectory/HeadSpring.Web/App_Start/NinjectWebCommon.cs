using System;
using System.Web;
using System.Web.Http;
using CommonServiceLocator.NinjectAdapter.Unofficial;
using Microsoft.Web.Infrastructure.DynamicModuleHelper;
using Ninject;
using Ninject.Extensions.Interception.Infrastructure.Language;
using Ninject.Web.Common;
using HeadSpring.Core.Infrastructure.Advisors;
using HeadSpring.Core.Infrastructure.Cache;
using HeadSpring.Web.Infrastructure.IoC;
using HeadSpring.Core.Services;
using Microsoft.Practices.ServiceLocation;
using HeadSpring.Core.Services.Employees;
using HeadSpring.Web.Infrastructure.Utils.Identity;
using HeadSpring.Web.Infrastructure.Utils;

[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(HeadSpring.Web.App_Start.NinjectWebCommon), "Start")]
[assembly: WebActivatorEx.ApplicationShutdownMethodAttribute(typeof(HeadSpring.Web.App_Start.NinjectWebCommon), "Stop")]

namespace HeadSpring.Web.App_Start
{
    public static class NinjectWebCommon
    {
        private static readonly Bootstrapper Bootstrapper = new Bootstrapper();

        /// <summary>
        /// Starts the application
        /// </summary>
        public static void Start()
        {
            DynamicModuleUtility.RegisterModule(typeof(OnePerRequestHttpModule));
            DynamicModuleUtility.RegisterModule(typeof(NinjectHttpModule));
            Bootstrapper.Initialize(CreateKernel);
        }

        /// <summary>
        /// Stops the application.
        /// </summary>
        public static void Stop()
        {
            Bootstrapper.ShutDown();
        }

        /// <summary>
        /// Creates the kernel that will manage your application.
        /// </summary>
        /// <returns>The created kernel.</returns>
        private static IKernel CreateKernel()
        {
            var settings = new NinjectSettings() { LoadExtensions = true };
            var kernel = new StandardKernel(settings);
            ServiceLocator.SetLocatorProvider(() => new NinjectServiceLocator(kernel));

            kernel.Bind<Func<IKernel>>().ToMethod(ctx => () => new Bootstrapper().Kernel);
            kernel.Bind<IHttpModule>().To<HttpApplicationInitializationHttpModule>();

            RegisterServices(kernel);

            GlobalConfiguration.Configuration.DependencyResolver = new NinjectResolver(kernel);

            return kernel;
        }

        /// <summary>
        /// Load your modules or register your services here!
        /// </summary>
        /// <param name="kernel">The kernel.</param>
        private static void RegisterServices(IKernel kernel)
        {
 
            var employeeService = kernel.Bind<IEmployeeService>().To<EmployeeService>();
            employeeService.Intercept().With<ModelValidatorInterceptor>();
            employeeService.Intercept().With<CacheInterceptor>();

            var identityService = kernel.Bind<IIdentityService>().To<IdentityService>();
            identityService.Intercept().With<ModelValidatorInterceptor>();
            identityService.Intercept().With<CacheInterceptor>();

        }
    }
}
