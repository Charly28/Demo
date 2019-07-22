using System;
using System.Collections.Generic;
using System.Net.Mail;
using System.Threading;

namespace WebApp.Common.Infrastructure.Emailing
{
    public class Email
    {
        #region Private Class Variables

        private int _smtpPort = 25;
        private string _smptHost = string.Empty;
        private bool _useSsl;
        private string _from = string.Empty;
        private string _login = string.Empty;
        private string _password = string.Empty;
        private string _subject = string.Empty;
        private string _to = string.Empty;
        private string _body = string.Empty;
        private string _fromFriendlyName = string.Empty;
        private List<Attachment> _attachedFile;

        #endregion

        #region Public Properties

        public int SmtpPort
        {
            get { return _smtpPort; }
            set { _smtpPort = value; }
        }

        public bool UseSsl
        {
            get { return _useSsl; }
            set { _useSsl = value; }
        }

        public string FromFriendlyName
        {
            get { return _fromFriendlyName; }
            set { _fromFriendlyName = value; }
        }

        public string SmptHost
        {
            get { return _smptHost; }
            set { _smptHost = value; }
        }

        public string From
        {
            get { return _from; }
            set { _from = value; }
        }

        public string Login
        {
            get { return _login; }
            set { _login = value; }
        }

        public string Password
        {
            get { return _password; }
            set { _password = value; }
        }

        public string Subject
        {
            get { return _subject; }
            set { _subject = value; }
        }

        public string To
        {
            get { return _to; }
            set { _to = value; }
        }

        public string Body
        {
            get { return _body; }
            set
            {
                _body = value;
            }
        }

        public List<Attachment> AttachedFile
        {
            get { return _attachedFile ?? (_attachedFile = new List<Attachment>()); }
            set { _attachedFile = value; }
        }

        #endregion

        #region Public Async Send Methods

        /// <summary>
        /// Sends an Email Async
        /// </summary>
        /// <returns></returns>
        public bool SendAsync()
        {
            ThreadStart start = SendThreadProc;
            var thread = new Thread(start) { Priority = ThreadPriority.Normal };
            thread.Start();

            return true;
        }

        /// <summary>
        /// 
        /// </summary>
        private void SendThreadProc()
        {
            try
            {
                var smtp = new Smtp();

                smtp.Send(
                    _smtpPort,
                    _smptHost,
                    _useSsl,
                    _from,
                    _login,
                    _password,
                    _to,
                    _subject,
                    _body,
                    true,
                    _fromFriendlyName);
            }
            catch (Exception)
            {
                // TODO: Log the exception
            }
        }

        /// <summary>
        /// Sends an Email with Attachment Async
        /// </summary>
        /// <returns></returns>
        public bool SendWithAttachmentAsync()
        {
            ThreadStart start = SendThreadProcWithAttachment;
            var thread = new Thread(start) { Priority = ThreadPriority.Normal };
            thread.Start();

            return true;
        }

        /// <summary>
        /// 
        /// </summary>
        private void SendThreadProcWithAttachment()
        {
            try
            {
                var smtp = new Smtp();

                smtp.Send(
                    _smtpPort,
                    _smptHost,
                    _useSsl,
                    _from,
                    _login,
                    _password,
                    _to,
                    _subject,
                    _body,
                    true,
                    _attachedFile,
                    _fromFriendlyName);
            }
            catch (Exception)
            {
                // TODO: Log the exception
            }
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Sends an Email
        /// </summary>
        public bool Send()
        {
            try
            {
                var smtp = new Smtp();

                smtp.Send(
                    _smtpPort,
                    _smptHost,
                    _useSsl,
                    _from,
                    _login,
                    _password,
                    _to,
                    _subject,
                    _body,
                    true,
                    _fromFriendlyName);

                return true;
            }
            catch (Exception)
            {
                // TODO: Log the exception
                return false;
            }
        }

        #endregion
    }
}
