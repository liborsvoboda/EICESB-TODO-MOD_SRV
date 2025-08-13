﻿#pragma warning disable CS1591
#region License
/*
 **************************************************************
 *  Author: Rick Strahl 
 *          © West Wind Technologies, 2010-2011
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

using System;
using System.Globalization;
using System.Reflection;
using System.IO;
using Microsoft.CSharp;

namespace Westwind.RazorHosting
{


    /// <summary>
    /// Factory that creates a RazorHost instance in a remote 
    /// AppDomain that can be unloaded. This allows unloading of
    /// assemblies created through scripting.
    /// 
    /// Both static and instance loader methods are available. For
    /// AppDomain created hosts.
    /// 
    /// Note:
    /// Only works for a single AppDomain as this class holds on
    /// to the AppDomain as a Singleton.    
    /// </summary>
    /// <typeparam name="TBaseTemplateType">RazorTemplateBase based type</typeparam>
    public class RazorEngineFactory<TBaseTemplateType>
        where TBaseTemplateType : RazorTemplateBase
    {
        /// <summary>
        /// Internal instance of the AppDomain to hang onto when
        /// running in a separate AppDomain. Ensures the AppDomain
        /// stays alive.
        /// </summary>
        AppDomain LocalAppDomain = null;
        
        /// <summary>
        /// Internally managed instance of the HostFactory
        /// that ensures that the AppDomain stays alive and
        /// that it can be unloaded manually using the static
        /// methods.
        /// </summary>
        public static RazorEngineFactory<TBaseTemplateType> Current;

        public string ErrorMessage { get; set; }

        /// <summary>
        /// Create an instance of the RazorHost in the current
        /// AppDomain. No special handling...
        /// </summary>
        /// <returns></returns>
        public static RazorEngine<TBaseTemplateType> CreateRazorHost(CSharpCodeProvider codeProvider = null)
        {
            if (Current == null)
                Current = new RazorEngineFactory<TBaseTemplateType>(); 
            
            return Current.GetRazorHost(codeProvider);
        }

        /// <summary>
        /// Creates an instance of the RazorHost in a new AppDomain. This 
        /// version creates a static singleton that that is cached and you
        /// can call UnloadRazorHostInAppDomain to unload it.
        /// </summary>
        /// <returns></returns>
        public static RazorEngine<TBaseTemplateType> CreateRazorHostInAppDomain()
        {
            if (Current == null)            
                Current = new RazorEngineFactory<TBaseTemplateType>();

            return Current.GetRazorHostInAppDomain();
        }

        /// <summary>
        /// Unloads the Razor host if running in a separate appdomain by
        /// unloading the AppDomain.
        /// </summary>
        public static void UnloadRazorHostInAppDomain()
        {
            if (Current != null)
                Current.UnloadHost();
            Current = null;
        }

        /// <summary>
        /// Create a new instance of Razor Host in the current AppDomain.
        /// </summary>
        /// <param name="codeProvider"></param>
        /// <returns></returns>
        public RazorEngine<TBaseTemplateType> GetRazorHost(CSharpCodeProvider codeProvider = null)
        {
            return new RazorEngine<TBaseTemplateType>(codeProvider);
        }


        /// <summary>
        /// Instance method that creates a RazorHost in a new AppDomain.
        /// This method requires that you keep the Factory around in
        /// order to keep the AppDomain alive and be able to unload it.
        /// </summary>
        /// <returns></returns>
        public RazorEngine<TBaseTemplateType> GetRazorHostInAppDomain()
        {                        
            LocalAppDomain = CreateAppDomain(null);
            if (LocalAppDomain  == null)
                return null;
            
            // Create the instance inside of the new AppDomain
            // Note: remote domain uses local EXE's AppBasePath!!!
            RazorEngine<TBaseTemplateType> host  = null;       

            try
            {
                Assembly ass = Assembly.GetExecutingAssembly();
                string AssemblyPath = ass.Location;

                var templateType = typeof(RazorEngine<TBaseTemplateType>);
                
                object instance = LocalAppDomain.CreateInstanceFrom(AssemblyPath,templateType.FullName,false,BindingFlags.Default,null,
                                                                    new object [] {null}, CultureInfo.CurrentCulture, null)
                                                .Unwrap();

                host = instance as RazorEngine<TBaseTemplateType>;
            }
            catch (Exception ex)
            {
                ErrorMessage = ex.Message;
                return null;
            }

            Assembly[] assemblies = LocalAppDomain.GetAssemblies();            
            var count = assemblies.Length;

            return host;
        }

        /// <summary>
        /// Internally creates a new AppDomain in which Razor templates can
        /// be run.
        /// </summary>
        /// <param name="appDomainName"></param>
        /// <returns></returns>
        private AppDomain CreateAppDomain(string appDomainName)
        {
            if (appDomainName == null)
                appDomainName = "RazorHost_" + Guid.NewGuid().ToString("n");

            AppDomainSetup setup = new AppDomainSetup();

            // *** Point at current directory
            setup.ApplicationBase = AppDomain.CurrentDomain.BaseDirectory;

            AppDomain localDomain = AppDomain.CreateDomain(appDomainName, null, setup);

            // *** Need a custom resolver so we can load assembly from non current path
            //AppDomain.CurrentDomain.AssemblyResolve += new ResolveEventHandler(CurrentDomain_AssemblyResolve);

            return localDomain;
        }

        /// <summary>
        /// Allow for custom assembly resolution to local file paths for signed dependency
        /// assemblies.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="args"></param>
        /// <returns></returns>
        private  System.Reflection.Assembly CurrentDomain_AssemblyResolve(object sender, ResolveEventArgs args)
        {
            try
            {
                Assembly assembly = System.Reflection.Assembly.Load(args.Name);
                if (assembly != null)
                    return assembly;
            }
            catch { }

            // Try to load by filename - split out the filename of the full assembly name
            // and append the base path of the original assembly (ie. look in the same dir)
            // NOTE: this doesn't account for special search paths but then that never
            //       worked before either.
            string[] Parts = args.Name.Split(',');
            string File = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) + "\\" + Parts[0].Trim() + ".dll";

            return System.Reflection.Assembly.LoadFrom(File);
        }

        /// <summary>
        /// Allow unloading of the created AppDomain to release resources
        /// All internal resources in the AppDomain are released including
        /// in memory compiled Razor assemblies.
        /// </summary>
        public void UnloadHost()
        {
            if (LocalAppDomain != null)
            {
                AppDomain.Unload(LocalAppDomain);
                LocalAppDomain = null;
            }
        }
    }



    ///// <summary>
    ///// Factory that creates a RazorHost instance in a remote 
    ///// AppDomain that can be unloaded. This allows unloading of
    ///// assemblies created through scripting.
    ///// 
    ///// Both static and instance loader methods are available. For
    ///// AppDomain created hosts.
    ///// 
    ///// Note:
    ///// Only works for a single AppDomain as this class holds on
    ///// to the AppDomain as a Singleton.
    ///// </summary>
    ///// <typeparam name="TBaseTemplateType">RazorTemplateBase based type</typeparam>
    //public class RazorEngineFactory : RazorEngineFactory<RazorTemplateBase>
    //{
    //    /// <summary>
    //    /// Internally managed instance of the HostFactory
    //    /// that ensures that the AppDomain stays alive and
    //    /// that it can be unloaded manually using the static
    //    /// methods.
    //    /// </summary>
    //    public static RazorEngineFactory<RazorTemplateBase> Current;

    //    public string ErrorMessage { get; set; }

    //    /// <summary>
    //    /// Create an instance of the RazorHost in the current
    //    /// AppDomain. No special handling...
    //    /// </summary>
    //    /// <returns></returns>
    //    public static RazorEngine<RazorTemplateBase> CreateRazorHost()
    //    {
    //        if (Current == null)
    //            Current = new RazorEngineFactory<RazorTemplateBase>();

    //        return Current.GetRazorHost();
    //    }

    //    /// <summary>
    //    /// Creates an instance of the RazorHost in a new AppDomain. This 
    //    /// version creates a static singleton that that is cached and you
    //    /// can call UnloadRazorHostInAppDomain to unload it.
    //    /// </summary>
    //    /// <returns></returns>
    //    public static RazorEngine<RazorTemplateBase> CreateRazorHostInAppDomain()
    //    {
    //        if (Current == null)
    //            Current = new RazorEngineFactory<RazorTemplateBase>();

    //        return Current.GetRazorHostInAppDomain();
    //    }

    //    /// <summary>
    //    /// 
    //    /// </summary>
    //    public static void UnloadRazorHostInAppDomain()
    //    {
    //        if (Current != null)
    //            Current.UnloadHost();
    //        Current = null;
    //    }
    //}
}
