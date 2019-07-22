using WebApp.Common.Infrastructure.Configuration;
using Locator = WebApp.Common.IoC.ServiceLocator;

namespace WebApp.Common.Cache
{
    public class CacheManager
    {
        public ICache GetCache()
        {
            return Locator.Get<ICache>(Config.CacheProvider);
        }
    }
}
