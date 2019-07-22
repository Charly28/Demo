using System;
using System.Configuration;
using WebApp.Common.Constants;

namespace WebApp.Common.Infrastructure.Configuration
{
    public static class Config
    {
        #region Emailing

        public static string EmailAccount
        {
            get { return ConfigurationManager.AppSettings[ConfigKey.EmailAccount]; }
        }

        public static string EmailUsername
        {
            get { return ConfigurationManager.AppSettings[ConfigKey.EmailUsername]; }
        }

        public static string EmailPassword
        {
            get { return ConfigurationManager.AppSettings[ConfigKey.EmailPassword]; }
        }

        public static int EmailPort
        {
            get
            {
                var keyValue = ConfigurationManager.AppSettings[ConfigKey.EmailPort];

                if (keyValue == null)
                {
                    return 25;
                }

                return Convert.ToInt32(keyValue);
            }
        }

        public static string EmailHost
        {
            get { return ConfigurationManager.AppSettings[ConfigKey.EmailHost]; }
        }

        public static bool EmailUseSsl
        {
            get
            {
                var keyValue = ConfigurationManager.AppSettings[ConfigKey.EmailUseSsl];

                if (keyValue == null)
                {
                    return false;
                }

                return Convert.ToBoolean(keyValue);
            }
        }

        public static string EmailFromFriendlyName
        {
            get { return ConfigurationManager.AppSettings[ConfigKey.EmailFromFriendlyName]; }
        }

        #endregion

        #region Transactions

        public static bool UseTransactionCoordinator
        {
            get
            {
                var keyValue = ConfigurationManager.AppSettings[ConfigKey.UseTransactionCoordinator];

                if (keyValue == null)
                {
                    return false;
                }

                return Convert.ToBoolean(keyValue);
            }
        }

        #endregion

        #region Cache

        public static string CacheProvider
        {
            get { return ConfigurationManager.AppSettings[ConfigKey.CacheProvider]; }
        }

        #endregion

        #region Encryption

        public static string EncryptionKey
        {
            get { return ConfigurationManager.AppSettings[ConfigKey.EncryptionKey]; }
        }

        public static int CookieExprirationDays
        {
            get
            {
                var keyValue = ConfigurationManager.AppSettings[ConfigKey.CookieExprirationDays];

                if (keyValue == null)
                {
                    return 7;
                }

                return Convert.ToInt32(keyValue);
            }
        }

        #endregion

        #region Paging

        public static int DefaultPageSize
        {
            get
            {
                var keyValue = ConfigurationManager.AppSettings[ConfigKey.DefaultPageSize];

                if (keyValue == null)
                {
                    return 10;
                }

                return Convert.ToInt32(keyValue);
            }
        }

        public static int DefaultPageOffset
        {
            get
            {
                var keyValue = ConfigurationManager.AppSettings[ConfigKey.DefaultPageOffset];

                if (keyValue == null)
                {
                    return 1;
                }

                return Convert.ToInt32(keyValue);
            }
        }

        public static int DefaultRowsLimit
        {
            get
            {
                var keyValue = ConfigurationManager.AppSettings[ConfigKey.DefaultRowsLimit];

                if (keyValue == null)
                {
                    return 10;
                }

                return Convert.ToInt32(keyValue);
            }
        }

        #endregion

        #region Common 

        public static string AdminRole
        {
            get { return ConfigurationManager.AppSettings[ConfigKey.AdminRole]; }
        }

        public static string HRRole
        {
            get { return ConfigurationManager.AppSettings[ConfigKey.HRRole]; }
        }

        public static string InfoRole
        {
            get { return ConfigurationManager.AppSettings[ConfigKey.InfoRole]; }
        }


        #endregion
    }
}
