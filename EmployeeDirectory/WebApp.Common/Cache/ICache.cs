using System;

namespace WebApp.Common.Cache
{
    public interface ICache
    {
        void Add<T>(string cacheKey, DateTime expiry, T dataToAdd) where T : class;
        T Get<T>(string cacheKey) where T : class;
        void Add(string cacheKey, DateTime expiry, object dataToAdd);
        object Get(string cacheKey);
        void InvalidateCacheItem(string cacheKey);
        string[] GetKeys();
    }
}
