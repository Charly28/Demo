using System;
using System.Linq;
using System.Net.Mail;
using WebApp.Common.Infrastructure.Configuration;

namespace WebApp.Common.Infrastructure.Emailing
{
    public class EmailSender
    {
        public void SendEmail(string mailBody, string attachmentPath, string to, string subject)
        {
            try
            {
                var mail = new Email
                {
                    From = Config.EmailAccount,
                    To = to,
                    Subject = subject,
                    Login = Config.EmailAccount,
                    Password = Config.EmailPassword,
                    SmtpPort = Config.EmailPort,
                    SmptHost = Config.EmailHost,
                    UseSsl = Config.EmailUseSsl,
                    FromFriendlyName = Config.EmailFromFriendlyName,
                    Body = mailBody
                };

                if (!(String.IsNullOrEmpty(attachmentPath) || String.IsNullOrWhiteSpace(attachmentPath)))
                {
                    mail.AttachedFile.Add(new Attachment(attachmentPath));
                }

                if (!mail.AttachedFile.Any())
                {
                    mail.SendAsync();
                }
                else
                {
                    mail.SendWithAttachmentAsync();
                }
            }
            catch (Exception)
            {
                // TODO: Log the exception
            }
        }
    }
}
