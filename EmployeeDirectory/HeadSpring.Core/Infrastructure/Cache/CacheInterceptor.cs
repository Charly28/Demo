using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;
using Ninject;
using Ninject.Extensions.Interception;
using System.Linq;
using WebApp.Common.Cache;
using WebApp.Common.Infrastructure.Paging;

namespace HeadSpring.Core.Infrastructure.Cache
{
    public abstract class BaseCacheAttribute : Attribute
    {

    }

    [AttributeUsage(AttributeTargets.All, AllowMultiple = false, Inherited = true)]
    public class CacheItemPropertiesAttribute : BaseCacheAttribute
    {
        public string SlotName { get; set; }
        public double PermissionCacheMinutes { get; set; }
    }

    [AttributeUsage(AttributeTargets.All, AllowMultiple = true, Inherited = true)]
    public class ClearCacheItemPropertiesAttribute : BaseCacheAttribute
    {
        public string SlotName { get; set; }
        public string[] Args { get; set; }
    }

    [AttributeUsage(AttributeTargets.All, AllowMultiple = true, Inherited = true)]
    public class ClearCacheKeysStartingWithAttribute : BaseCacheAttribute
    {
        public string SlotName { get; set; }
    }

    public class CacheInterceptor : IInterceptor
    {
        [Inject]
        public CacheManager CacheManager { get; set; }

        public void Intercept(IInvocation invocation)
        {
            IEnumerable<object> clearCacheItems = null;
            IEnumerable<object> clearCacheItemsStarWith = null;
            object[] attrs = invocation.Request.Method.GetCustomAttributes(typeof(BaseCacheAttribute), true);
            object cacheItems = attrs.SingleOrDefault(x => x.GetType().Name == "CacheItemPropertiesAttribute");

            if (cacheItems == null)
            {
                clearCacheItems =
                    attrs.Where(x => x.GetType().Name == "ClearCacheItemPropertiesAttribute").AsEnumerable();
                clearCacheItemsStarWith =
                    attrs.Where(x => x.GetType().Name == "ClearCacheKeysStartingWithAttribute").AsEnumerable();
            }

            if (attrs.Length == 0)
            {
                invocation.Proceed();
                return;
            }

            if (cacheItems != null)
            {
                BaseCacheAttribute cacheItemProperty = cacheItems as BaseCacheAttribute;
                ICache appCache = CacheManager.GetCache();

                CacheItemPropertiesAttribute cacheItemProperties = cacheItemProperty as CacheItemPropertiesAttribute;
                string key = getKey(invocation, cacheItemProperties);

                if (appCache.Get(key) == null)
                {
                    invocation.Proceed();
                    DateTime cacheTimeSpan =
                        DateTime.Now.AddMinutes(cacheItemProperties.PermissionCacheMinutes > 0
                            ? cacheItemProperties.PermissionCacheMinutes
                            : 60);

                    appCache.Add(key, cacheTimeSpan, invocation.ReturnValue);
                }
                else
                {
                    invocation.ReturnValue = appCache.Get(key);
                }
            }

            if (clearCacheItems != null)
            {
                foreach (object attr in clearCacheItems)
                {
                    BaseCacheAttribute cacheItemProperty = attr as BaseCacheAttribute;
                    ICache appCache = CacheManager.GetCache();

                    string key = getClearKey(invocation, cacheItemProperty as ClearCacheItemPropertiesAttribute);

                    string[] keys = appCache.GetKeys();

                    keys.Where(x => x.Contains(key)).ToList().ForEach(appCache.InvalidateCacheItem);

                    appCache.InvalidateCacheItem(key);
                }

                invocation.Proceed();
            }

            if (clearCacheItemsStarWith != null)
            {
                foreach (object attr in clearCacheItemsStarWith)
                {
                    BaseCacheAttribute cacheItemProperty = attr as BaseCacheAttribute;
                    ICache appCache = CacheManager.GetCache();

                    string key = getClearKeyStartsWith(cacheItemProperty as ClearCacheKeysStartingWithAttribute);

                    string[] keys = appCache.GetKeys();

                    List<string> cacheItemsRemoved = keys.Where(x => x.StartsWith(key)).ToList();

                    foreach (string item in cacheItemsRemoved)
                    {
                        appCache.InvalidateCacheItem(item);
                    }
                }
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="invocation"></param>
        /// <param name="clearCacheItemProperties"></param>
        /// <returns></returns>
        private string getClearKey(IInvocation invocation, ClearCacheItemPropertiesAttribute clearCacheItemProperties)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendFormat("cache://{0}", clearCacheItemProperties.SlotName);

            ParameterInfo[] methodParameters = invocation.Request.Method.GetParameters();

            foreach (string argumentName in clearCacheItemProperties.Args)
            {
                //We want to support one level of nested properties (just one as-of today)
                if (argumentName.IndexOf('.') > 0)
                {
                    string[] split = argumentName.Split('.');
                    string left = split[0];
                    string right = split[1];
                    int index = methodParameters.Where(x => x.Name == left).Select(x => x.Position).SingleOrDefault();
                    object argumentValue = invocation.Request.Arguments[index];
                    object propValue = argumentValue.GetType().GetProperty(right).GetValue(argumentValue, null);
                    sb.AppendFormat("/{0}", propValue);
                }
                else
                {
                    int methodIndex = methodParameters.Where(x => x.Name.Equals(argumentName)).Select(x => x.Position).SingleOrDefault();
                    object parameterVal = invocation.Request.Arguments[methodIndex];
                    sb.AppendFormat("/{0}", parameterVal);
                }
            }

            sb.Append("/");
            return sb.ToString();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="clearCacheItemProperties"></param>
        /// <returns></returns>
        private string getClearKeyStartsWith(ClearCacheKeysStartingWithAttribute clearCacheItemProperties)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendFormat("cache://{0}", clearCacheItemProperties.SlotName);
            return sb.ToString();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="invocation"></param>
        /// <param name="cacheItemProperty"></param>
        /// <returns></returns>
        private string getKey(IInvocation invocation, CacheItemPropertiesAttribute cacheItemProperty)
        {

            StringBuilder sb = new StringBuilder();
            sb.AppendFormat("cache://{0}", cacheItemProperty.SlotName);
            foreach (object argument in invocation.Request.Arguments)
            {
                if (argument is PagerInfo)
                {
                    var hashtable = ((PagerInfo)argument).Filters;
                    var keys = hashtable.Keys.Cast<string>().OrderBy(x => x);
                    foreach (string entry in keys)
                    {
                        sb.AppendFormat("/{0}={1}", entry, hashtable[entry]);
                    }
                }
                else
                {
                    sb.AppendFormat("/{0}", argument);
                }
            }

            sb.Append("/");
            return sb.ToString();
        }
    }
}
