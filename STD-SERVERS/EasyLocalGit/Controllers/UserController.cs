using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using EasyGitServer.Models;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using EasyGitServer.Interfaces;
using EasyGitServer.Models;
using EasyGitServer.Infrastructure;

namespace EasyGitServer.Controllers
{    
    public class UserController : Controller
    {
        private IGitDbRepository<User> _user;
        private GitServerContext db;

        public UserController(GitServerContext dbContext, IGitDbRepository<User> user)
        {
            db = dbContext;
            _user = user;
        }
        public IActionResult Index()
        {
            return Content("ok");
        }
        public IActionResult Login()
        {
            return View();
        }


        //[HttpPost("/Github/Shared/Login")]
        [HttpPost]
        public async Task<IActionResult> Login(LoginModel model)
        {
            if (ModelState.IsValid)
            {
                var user = db.Users.Where(r => r.Name == model.Username && r.Password == model.Password).FirstOrDefault();
                if (user != null) {
                    var identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme, ClaimTypes.Name, ClaimTypes.Role);
                    identity.AddClaim(new Claim(ClaimTypes.PrimarySid, user.ID.ToString()));
                    identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.Name));
                    identity.AddClaim(new Claim(ClaimTypes.Name, user.Name));
                    identity.AddClaim(new Claim(ClaimTypes.Email, user.Email));
                    var principal = new ClaimsPrincipal(identity);
                    await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);
                    return Redirect("Github/Shared/Home");
                }
            }
            return View();
        }

        
        public IActionResult Register()
        {
            return View();
        }


        //[HttpPost("/Github/Shared/Register")]
        [HttpPost]
        public IActionResult Register(RegisterModel model)
        {
            if (ModelState.IsValid)
            {
                _user.Add(new User()
                {
                    UserTeamRoles = null,
                    Name = model.Username,
                    Email = model.Email,
                    Password = model.ConfirmPassword,
                    CreationDate = DateTime.Now,
                    IsSystemAdministrator = false,
                    Description = null,
                    Nickname = model.Username, 
                    WebSite = null
                }); 

                return Redirect("Github/Shared/Home");
            }
            return View();
        }
        public async Task<IActionResult> Signout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Redirect("/");
        }

    }
}