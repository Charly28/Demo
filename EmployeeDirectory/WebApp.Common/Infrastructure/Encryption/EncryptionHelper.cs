using System;
using System.Globalization;
using System.Web;
using WebApp.Common.Infrastructure.Configuration;

namespace WebApp.Common.Infrastructure.Encryption
{
    public class EncryptionHelper
    {
        /// <summary>
        /// Gets the Encryption Key from the App Config
        /// </summary>
        private static string Key
        {
            get
            {
                return Config.EncryptionKey;
            }
        }

        private static int CookieExpirationDays
        {
            get
            {
                return Config.CookieExprirationDays;
            }
        }

        /// <summary>
        /// Encrypt the given string value
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static string Encrypt(string value)
        {
            return HttpServerUtility.UrlTokenEncode(Encrypter.Encrypt(value, Key));
        }

        /// <summary>
        /// Encrypt the integer value
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static string Encrypt(int value)
        {
            return Encrypt(value.ToString(CultureInfo.InvariantCulture));
        }

        /// <summary>
        /// Decrypt the given string value
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static string Decrypt(string value)
        {
            return Encrypter.Decrypt(HttpServerUtility.UrlTokenDecode(value), Key);
        }

        /// <summary>
        /// Crypt the given key / value pair into a Cookie - Default Expiration : 7 days
        /// </summary>
        /// <param name="response"></param>
        /// <param name="key"></param>
        /// <param name="value"></param>
        public static void CryptCookie(HttpResponseBase response, string key, object value)
        {
            var cookie = new HttpCookie(Encrypt(key), Encrypt(value.ToString()))
            {
                Expires = DateTime.Now.AddDays(CookieExpirationDays)
            };

            response.Cookies.Add(cookie);
        }

        /// <summary>
        /// Crypt the given key / value pair into a Cookie - Needs to specify an expiration day, 
        /// If not takes DateTime.MaxValue
        /// </summary>
        /// <param name="response"></param>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <param name="expireDays"></param>
        public static void CryptCookie(HttpResponseBase response, string key, object value, int? expireDays)
        {
            var cookie = new HttpCookie(Encrypt(key), Encrypt(value.ToString()))
            {
                Expires = expireDays.HasValue ? DateTime.Now.AddDays(expireDays.Value) : DateTime.MaxValue
            };

            response.Cookies.Add(cookie);
        }
    }
}
