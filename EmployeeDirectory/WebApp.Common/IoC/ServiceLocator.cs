using MsServiceLocator = Microsoft.Practices.ServiceLocation.ServiceLocator;

namespace WebApp.Common.IoC
{
    public class ServiceLocator
    {
        public static T Get<T>()
        {
            return MsServiceLocator.Current.GetInstance<T>();
        }

        public static T Get<T>(string key)
        {
            return MsServiceLocator.Current.GetInstance<T>(key);
        }
    }
}
