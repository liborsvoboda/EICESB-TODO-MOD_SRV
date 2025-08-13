#region License
/*
 **************************************************************
 *  Author: Rick Strahl 
 *          � West Wind Technologies, 2010-2011
 *          http://www.west-wind.com/
 * 
 * Created: 1/4/2010
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 **************************************************************  
*/
#endregion

using System.IO;
using System;

namespace Westwind.RazorHosting
{
    /// <summary>
    /// Class that handles Response output generation inside of
    /// RazorTemplateBase implementation.
    /// </summary>
    public class RazorResponse : IDisposable        
    {

        /// <summary>
        /// Internal text writer - default to StringWriter()
        /// </summary>
        public TextWriter Writer = new StringWriter();

        /// <summary>
        /// Write single line output into the response stream
        /// </summary>
        /// <param name="value"></param>
        public virtual void Write(object value)
        {
            Writer.Write(value);
        }

        /// <summary>
        /// Writes a line with a CR/LF at the end
        /// </summary>
        /// <param name="value"></param>
        public virtual void WriteLine(object value)
        {
            Write(value);
            Write("\r\n");
        }

        /// <summary>
        /// Writes a format string into the Response Stream
        /// </summary>
        /// <param name="format"></param>
        /// <param name="args"></param>
        public virtual void WriteFormat(string format, params object[] args)
        {
            Write(string.Format(format, args));        
       }

        /// <summary>
        /// Clears the Response stream
        /// </summary>
        public virtual void Clear()
        {
            if (Writer != null)
                Writer.Close();

            Writer = new StringWriter();
        }

        /// <summary>
        /// Returns the Response content as a string
        /// </summary>
        /// <returns></returns>
        public override string ToString()
        {
            return Writer.ToString();
        }


        /// <summary>
        /// IDisposable implementation
        /// </summary>
        public virtual void Dispose()
        {
            Writer.Close();
        }

        /// <summary>
        /// Allows overriding the TextWriter used write output to.
        /// Note: This method MUST be called before any output has
        /// been written to the Response to capture the entire response.
        /// </summary>
        /// <param name="writer"></param>
        public virtual void SetTextWriter(TextWriter writer)
        {
            // Close original writer
            if (Writer != null)
                Writer.Close();
                        
            Writer = writer;
        }
    }
}
