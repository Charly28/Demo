using System.Text.RegularExpressions;

namespace WebApp.Common.Extensions
{
    public static class StringExtensions
    {
        /// <summary>
        /// Remove accents for the current string
        /// </summary>
        /// <param name="input"></param>
        /// <returns>Returns a string without accents</returns>
        public static string RemoveAccents(this string input)
        {
            input = input.ToLower();
            var replaceAAccents = new Regex("[á|à|ä|â]", RegexOptions.Compiled);
            var replaceEAccents = new Regex("[é|è|ë|ê]", RegexOptions.Compiled);
            var replaceIAccents = new Regex("[í|ì|ï|î]", RegexOptions.Compiled);
            var replaceOAccents = new Regex("[ó|ò|ö|ô]", RegexOptions.Compiled);
            var replaceUAccents = new Regex("[ú|ù|ü|û]", RegexOptions.Compiled);

            input = replaceAAccents.Replace(input, "a");
            input = replaceEAccents.Replace(input, "e");
            input = replaceIAccents.Replace(input, "i");
            input = replaceOAccents.Replace(input, "o");
            input = replaceUAccents.Replace(input, "u");

            return input;
        }
    }
}
