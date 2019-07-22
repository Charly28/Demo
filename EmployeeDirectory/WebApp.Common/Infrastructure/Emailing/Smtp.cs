using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Text.RegularExpressions;

namespace WebApp.Common.Infrastructure
{
    public class Smtp
    {
        /// <summary>
        /// Sends an Email
        /// </summary>
        /// <param name="smtpPort"></param>
        /// <param name="smtpHost"></param>
        /// <param name="useSsl"> </param>
        /// <param name="from"></param>
        /// <param name="login"></param>
        /// <param name="password"></param>
        /// <param name="to"></param>
        /// <param name="subject"></param>
        /// <param name="body"></param>
        /// <param name="isHtml"></param>
        /// <param name="fromFriendlyName"> </param>
        public void Send(int smtpPort,
                        string smtpHost,
                        bool useSsl,
                        string from,
                        string login,
                        string password,
                        string to,
                        string subject,
                        string body,
                        bool isHtml,
                        string fromFriendlyName)
        {
            Send(smtpPort,
                smtpHost,
                useSsl,
                from,
                 login,
                 password,
                 to,
                 subject,
                 body,
                 isHtml,
                 null,
                 fromFriendlyName);
        }

        /// <summary>
        /// Sends an Email
        /// </summary>
        /// <param name="smtpPort"></param>
        /// <param name="smtpHost"></param>
        /// <param name="useSsl"> </param>
        /// <param name="from"></param>
        /// <param name="login"></param>
        /// <param name="password"></param>
        /// <param name="to"></param>
        /// <param name="subject"></param>
        /// <param name="body"></param>
        /// <param name="isHtml"></param>
        /// <param name="file"></param>
        /// <param name="fromFriendlyName"> </param>
        public void Send(int smtpPort,
                         string smtpHost,
                         bool useSsl,
                         string from,
                         string login,
                         string password,
                         string to,
                         string subject,
                         string body,
                         bool isHtml,
                         List<Attachment> file,
                         string fromFriendlyName)
        {
            try
            {
                var maFrom = string.IsNullOrWhiteSpace(fromFriendlyName) ? new MailAddress(from) : new MailAddress(from, fromFriendlyName);
                var maTo = new MailAddress(to);
                var mmMessage = new MailMessage(maFrom, maTo);

                mmMessage.ReplyToList.Add(maFrom);
                mmMessage.Subject = subject;
                mmMessage.SubjectEncoding = Encoding.UTF8;
                mmMessage.BodyEncoding = Encoding.UTF8;
                mmMessage.IsBodyHtml = isHtml;

                if (isHtml)
                {
                    var plainView = AlternateView.CreateAlternateViewFromString(Regex.Replace(body, @"<(.|\n)*?>", string.Empty), null, "text/plain");
                    var htmlView = AlternateView.CreateAlternateViewFromString(body, null, "text/html");
                    mmMessage.AlternateViews.Add(plainView);
                    mmMessage.AlternateViews.Add(htmlView);
                }
                else
                {
                    var plainView = AlternateView.CreateAlternateViewFromString(body);
                    mmMessage.AlternateViews.Add(plainView);
                }

                if (file != null)
                {
                    foreach (var f in file)
                    {
                        mmMessage.Attachments.Add(f);
                    }
                }

                var smtp = new SmtpClient
                {
                    Port = smtpPort,
                    Host = smtpHost,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    EnableSsl = useSsl,
                    Credentials = new NetworkCredential(login, password)
                };

                smtp.Send(mmMessage);
            }
            catch (Exception ex)
            {
                throw new Exception("Smpt - Error Send Function", ex);
            }
        }
    }
}
