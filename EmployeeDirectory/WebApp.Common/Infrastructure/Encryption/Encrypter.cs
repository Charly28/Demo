using System.Security.Cryptography;
using System.Text;

namespace WebApp.Common.Infrastructure.Encryption
{
    public static class Encrypter
    {
        /// <summary>
        /// Encrypt the given string with the given key
        /// </summary>
        /// <param name="input"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static byte[] Encrypt(string input, string key)
        {
            var inputArray = Encoding.UTF8.GetBytes(input);

            using (var tripleDes = new TripleDESCryptoServiceProvider())
            {
                tripleDes.Key = Encoding.UTF8.GetBytes(key);
                tripleDes.Mode = CipherMode.ECB;
                tripleDes.Padding = PaddingMode.PKCS7;
                var cTransform = tripleDes.CreateEncryptor();
                var resultArray = cTransform.TransformFinalBlock(inputArray, 0, inputArray.Length);
                tripleDes.Clear();

                return resultArray;
            }
        }

        /// <summary>
        /// Decrypt the given input with the given key
        /// </summary>
        /// <param name="input"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static string Decrypt(byte[] input, string key)
        {
            using (var tripleDes = new TripleDESCryptoServiceProvider())
            {
                tripleDes.Key = Encoding.UTF8.GetBytes(key);
                tripleDes.Mode = CipherMode.ECB;
                tripleDes.Padding = PaddingMode.PKCS7;
                var cTransform = tripleDes.CreateDecryptor();
                var resultArray = cTransform.TransformFinalBlock(input, 0, input.Length);
                tripleDes.Clear();

                return Encoding.UTF8.GetString(resultArray);
            }
        }
    }
}
