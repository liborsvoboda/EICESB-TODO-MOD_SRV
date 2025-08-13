using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;
using System;
using System.Runtime.InteropServices;
using System.Threading;
using System.Globalization;

namespace PssdiagConfig
{
    static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            UnhandledExceptionHandler eh = new UnhandledExceptionHandler();
            Application.ThreadException += new ThreadExceptionEventHandler(eh.OnThreadException);

            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new PssdiagConfig.fmDiagManager());

        }
    }

    internal class UnhandledExceptionHandler
    {
        public void OnThreadException(object sender, ThreadExceptionEventArgs t)
        {
            DialogResult result = DialogResult.Cancel;
            Globals.ExceptionEncountered = true;
            try
            {
                MessageBox.Show(t.Exception.ToString());
            }
            catch (Exception e)
            {
                System.Diagnostics.Debug.WriteLine("Exception has occurred" + e.Message);
                try
                {
                    result = this.ShowThreadExceptionDialog(t.Exception);
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine(ex.Message);
                    try
                    {
                        if (ex.Message.Contains("Could not load file or assembly"))
                        {

                        }
                        else
                            MessageBox.Show("Fatal Error", "Fatal Error", MessageBoxButtons.AbortRetryIgnore, MessageBoxIcon.Stop);
                    }
                    finally
                    {
                        Application.Exit();
                    }
                }
            }

            // Exits the program when the user clicks Abort.
            if (result == DialogResult.Abort)
                Application.Exit();
        }

        // Creates the error message and displays it.
        private DialogResult ShowThreadExceptionDialog(Exception e)
        {
            string errorMsg = "An error occurred please contact the adminstrator with the following information:\n\n";
            errorMsg = errorMsg + e.Message + "\n\nStack Trace:\n" + e.StackTrace;
            return MessageBox.Show(errorMsg, "Application Error", MessageBoxButtons.AbortRetryIgnore, MessageBoxIcon.Stop);
        }
    }

    enum ProgramExitCodes
    {
        UserCancel = -1,
        Normal = 0,
        Exception = 2
    }
}
