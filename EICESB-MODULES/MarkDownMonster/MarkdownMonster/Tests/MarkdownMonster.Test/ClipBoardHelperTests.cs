﻿using System;
using System.Text;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Windows;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Westwind.Utilities;
using System.Windows.Media;
using System.Drawing.Imaging;
using MarkdownMonster.Windows;
using System.Runtime.CompilerServices;

namespace MarkdownMonster.Test
{
    /// <summary>
    /// Summary description for ClipBoardHelper
    /// </summary>
    [TestClass]
    public class ClipBoardHelperTests
    {
      
        [TestMethod]
        public void CopyHtmlToClipboard()
        {
            string initialText = "<b>Hello World</b>";
            ClipboardHelper.CopyHtmlToClipboard(initialText,initialText);

            var htmlFragmentText = Clipboard.GetData(DataFormats.Html) as string;

            Assert.IsNotNull(htmlFragmentText);
            Console.WriteLine(htmlFragmentText);

            string html = StringUtils.ExtractString(htmlFragmentText, "<!--StartFragment-->", "<!--EndFragment-->");
            Assert.AreEqual(initialText,html);
        }

        [TestMethod]
        public void GetClipboardHtml()
        {
            var text = Clipboard.GetText();
            Console.WriteLine(text);

            var html = Clipboard.GetData(DataFormats.Html) as string;
            html = StringUtils.ExtractString(html, "<!--StartFragment-->", "<!--EndFragment-->");
            Console.WriteLine(html);
        }

        [TestMethod]
        public void GetClipboardHtmlText()
        {
            string html = ClipboardHelper.GetHtmlFromClipboard();
            Console.WriteLine(html);
        }

        [TestMethod]
        public void ImageTransparencyTest()
        {
            // Before running copy an image from SnagIt's editor with transparency
            var data = System.Windows.Clipboard.GetDataObject();
            var formats = data.GetFormats();

            //foreach (var f in formats)
            //    Console.WriteLine(" - " + f.ToString());

            string file = @"c:\temp\test.png";

            //var imgSource = System.Windows.Clipboard.GetImage();  // this won't display in a WPF Image control from SnagIt
            //using (var img = WindowUtilities.BitmapSourceToBitmap(imgSource))
            //{
            using (var img = ClipboardHelper.GetImage())
            {
                Assert.IsNotNull(img, "Image is null - no image data on the clipboard?");

                File.Delete(file);
                img.Save(file, ImageFormat.Png);
            }

            ShellUtils.ShellExecute(file);
        }
    }
}
