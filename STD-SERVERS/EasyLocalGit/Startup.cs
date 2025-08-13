using EasyGitServer.Services;
using EasyGitServer.Settings;
using Microsoft.Extensions.Configuration;
using EasyGitServer.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using Microsoft.AspNetCore.Authentication.Cookies;
using EasyGitServer.Handlers;
using EasyGitServer.Interfaces;
using EasyGitServer.Repositories;
using EasyGitServer.Models;
using Microsoft.Extensions.Hosting;
using System.IO;
using System.Reflection;
using System.Security.Cryptography.X509Certificates;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using EasyGitServer.Settings;
using IConfiguration = Microsoft.Extensions.Configuration.IConfiguration;
using Microsoft.AspNetCore.Identity;



namespace EasyGitServer {
    
    public class Startup {

        public Startup(IConfiguration configuration) { Configuration = configuration; }
        public IConfiguration Configuration { get; }


        public void ConfigureServices(IServiceCollection services) {


            //var connectionType = Configuration.GetConnectionString("ConnectionType");
            //string connectionString = Configuration.GetConnectionString("DefaultConnection");
            //switch (connectionType)
            //{
            //    case "Sqlite":
            //        services.AddDbContext<GitServerContext>(options => options.UseSqlite(connectionString)); break;
            //    case "MSSQL":
            //        services.AddDbContext<GitServerContext>(options => options.UseSqlServer(connectionString)); 
            //    break;
            //    case "MySQL":
            //        services.AddDbContext<GitServerContext>(options => options.UseMySQL(connectionString)); break;
            //    default:
            //        services.AddDbContext<GitServerContext>(options => options.UseSqlite(connectionString)); break;
            //}


            string json = File.ReadAllText(Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), "Data", "config.txt"));
            services.AddDbContext<GitServerContext>(options => options.UseSqlServer(json));



            // Add framework services.

            services.AddMvc(option => {
                option.EnableEndpointRouting = false;
            }).AddRazorPagesOptions(opt => {
                opt.RootDirectory = "/Github";
                //opt.Conventions.AuthorizeFolder("/DefaultWebPages/GlobalLogin");
            }); ;
            services.AddRazorPages().AddRazorRuntimeCompilation();
            services.AddOptions();

            services.AddAuthentication(options => {
                options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            }).AddCookie(options => {
                options.AccessDeniedPath = "/Github/Login";
                options.LoginPath = "/Github/Login";
            }).AddBasic();
            services.AddAuthentication(IdentityConstants.ApplicationScheme).AddIdentityCookies();
            services.AddSession().AddResponseCompression().AddResponseCaching().AddLogging();
            services.AddEndpointsApiExplorer();
            services.AddRazorPages().AddRazorRuntimeCompilation();
            services.AddDirectoryBrowser();
            services.AddControllersWithViews();

         

            // Add settings
            services.Configure<GitSettings>(options =>
            {
                options.BasePath = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), "EasyGitServer");
                options.GitPath = "git";
            });

            // Add git services
            services.AddTransient<GitRepositoryService>();
            services.AddTransient<GitFileService>();
            services.AddTransient<IGitDbRepository<User>, GitDbRepository<User>>();
            services.AddTransient<IGitDbRepository<GitDbRepository>, GitDbRepository<GitDbRepository>>();
            services.AddRouting();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, GitServerContext gitServerContext) {
            try
            {
                if (gitServerContext.Users.Count() == 0) { }
            } catch
            {
                gitServerContext.Database.EnsureCreated();
                gitServerContext.Users.Add(new User() { Name = "admin", Password = "admin", Nickname = "admin", Email = "", WebSite = "", IsSystemAdministrator = true, CreationDate = DateTime.UtcNow });
                gitServerContext.SaveChanges();
            }

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/error");
            }

            app.UseHsts();
            app.UseRouting().UseCookiePolicy().UseSession().UseResponseCompression();
            app.UseAuthentication().UseAuthorization();

            app.UseWelcomePage().UseDeveloperExceptionPage().UseStatusCodePages().UseFileServer();
            app.UseExceptionHandler().UseHttpLogging();
            app.UseWebAssemblyDebugging();

            app.UseStaticFiles();
            app.UseDefaultFiles();
            
            app.UseMvc(routes => RouteConfig.RegisterRoutes(routes));
            //app.UseRouter(routes => RouteConfig.RegisterRoutes(routes));

            
            
            app.UseEndpoints(endpoints => {
                endpoints.MapControllers();
                endpoints.MapRazorPages();
                endpoints.MapDefaultControllerRoute();
                //endpoints.MapControllerRoute(name: "sites", pattern: "{controller=sites}/{action=Index}/{id?}");
            });

            
        }

        //Functions Part
        /// <summary>
        /// Set Imported Certificate from file on Server for Https 
        /// File must has Valid path from Startup Data Path
        /// </summary>
        /// <returns></returns>
        public static X509Certificate2 GetSelfSignedCertificateFromFile(string certificateFilename, string password) {
            byte[]? certificate = null;
            try
            {
                certificate = File.ReadAllBytes(Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), "Data", certificateFilename));
                return new X509Certificate2(certificate, password.Length > 0 ? password : "");
            } catch (Exception Ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(Environment.NewLine + Ex.Message + Environment.NewLine);
            }
            return GetSelfSignedCertificate(certificateFilename);
        }

        /// <summary>
        /// Gets the self signed certificate For API Security HTTPS.
        /// </summary>
        /// <param name="password">The password.</param>
        /// <returns></returns>
        public static X509Certificate2 GetSelfSignedCertificate(string password) {
            var commonName = Program.CheckDomain().Length > 0 ? Program.CheckDomain() : "localhost";
            var rsaKeySize = 2048;
            var years = 10;
            var hashAlgorithm = HashAlgorithmName.SHA256;

            using (var rsa = RSA.Create(rsaKeySize))
            {
                var request = new CertificateRequest($"cn={commonName}", rsa, hashAlgorithm, RSASignaturePadding.Pkcs1);

                SubjectAlternativeNameBuilder subjectAlternativeNameBuilder = new();
                subjectAlternativeNameBuilder.AddDnsName(Assembly.GetExecutingAssembly().GetName().FullName);

                X509BasicConstraintsExtension extension = new();

                request.CertificateExtensions.Add(
                    new X509KeyUsageExtension(X509KeyUsageFlags.DataEncipherment | X509KeyUsageFlags.KeyEncipherment | X509KeyUsageFlags.DigitalSignature | X509KeyUsageFlags.KeyCertSign, false)
                );

                request.CertificateExtensions.Add(
                    new X509EnhancedKeyUsageExtension(
                    new OidCollection { new Oid("1.3.6.1.5.5.7.3.1"), new Oid("1.3.6.1.5.5.7.3.2") }, false)
                );

                var notAfter = DateTimeOffset.Now.AddYears(years);
                var certificate = request.CreateSelfSigned(DateTimeOffset.Now.AddDays(-1), notAfter);
                if (OperatingSystem.IsWindows()) { certificate.FriendlyName = Assembly.GetExecutingAssembly().GetName().FullName; }

                try
                { //Saving Autogenerate Certificate
                    byte[] exportedData = certificate.Export(X509ContentType.Pfx, password);
                    File.WriteAllBytes(Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), "Data", "AutoGeneratedCertificate.pfx"), exportedData);
                } catch { }

                return new X509Certificate2(certificate.Export(X509ContentType.Pfx, password), password, X509KeyStorageFlags.Exportable);
            }
        }

    }   
}
