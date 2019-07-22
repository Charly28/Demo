using System;
using System.Transactions;

namespace WebApp.Common.Transactions
{
    public static class TransactionFactory
    {
        /// <summary>
        /// Gets a Default Transaction Scope with Timeout of 30 seconds
        /// </summary>
        /// <returns></returns>
        public static TransactionScope GetScope()
        {
            return GetScope(30);
        }

        /// <summary>
        /// Gets a Transaction Scope with the given seconds for Timeout
        /// </summary>
        /// <param name="secondsTimeout"></param>
        /// <returns></returns>
        public static TransactionScope GetScope(int secondsTimeout)
        {
            TransactionOptions options = new TransactionOptions
            {
                IsolationLevel = IsolationLevel.ReadCommitted,
                Timeout = new TimeSpan(0, 0, secondsTimeout)
            };

            return new TransactionScope(TransactionScopeOption.Required, options);
        }
    }
}
