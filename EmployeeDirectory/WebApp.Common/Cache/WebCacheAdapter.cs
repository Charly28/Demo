using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Caching;
using HttpCache = System.Web.Caching.Cache;

namespace WebApp.Common.Cache
{
    public class WebCacheAdapter : ICache
    {
        private readonly HttpCache _cache = HttpRuntime.Cache;

        public void Add<T>(string cacheKey, DateTime expiry, T dataToAdd) where T : class
        {
            if (dataToAdd != null)
            {
                _cache.Add(
                    cacheKey,
                    dataToAdd,
                    null,
                    expiry,
                    HttpCache.NoSlidingExpiration,
                    CacheItemPriority.Normal,
                    null);
            }
        }

        public void Add(string cacheKey, DateTime expiry, object dataToAdd)
        {
            Add<object>(cacheKey, expiry, dataToAdd);
        }

        public T Get<T>(string cacheKey) where T : class
        {
            var data = _cache.Get(cacheKey) as T;

            return data;
        }

        public object Get(string cacheKey)
        {
            return _cache.Get(cacheKey);
        }

        public void InvalidateCacheItem(string cacheKey)
        {
            if (_cache.Get(cacheKey) != null)
            {
                _cache.Remove(cacheKey);
            }
        }

        public string[] GetKeys()
        {
            var keys = _cache.GetEnumerator();
            var list = new List<string>();

            while (keys.MoveNext())
            {
                list.Add(keys.Key.ToString());
            }

            return list.ToArray();
        }
    }
}
