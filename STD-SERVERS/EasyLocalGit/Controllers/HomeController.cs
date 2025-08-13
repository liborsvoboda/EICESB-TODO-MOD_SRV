using System.Linq;
using EasyGitServer.Services;
using EasyGitServer.Settings;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authorization;
using EasyGitServer.Interfaces;
using EasyGitServer.Models;
using System.IO;
using System;
using System.Security.Claims;

namespace EasyGitServer.Controllers
{
    
    public class HomeController : GitControllerBase
    {
        private IGitDbRepository<GitDbRepository> _repository;

        public HomeController(
            IOptions<GitSettings> gitOptions,
            GitRepositoryService repoService,
            IGitDbRepository<GitDbRepository> repository
        )
            : base(gitOptions, repoService)
        {
            _repository = repository;
        }

        [Authorize]
        public IActionResult Home()
        {
            var username = HttpContext.User.Identity.Name;
            var reps = _repository.List(r => r.UserName == username).ToList();
            return View(reps);
        }

        [Authorize]
        public IActionResult Shared() {
            var reps = _repository.List(r => r.IsPrivate == false).ToList();
            return View(reps);
        }

        public IActionResult Public() {
            var reps = _repository.List(r => r.IsMirror == true).ToList();
            return View(reps);
        }

        [Authorize]
        public IActionResult Create()
        {
            return View();
        }

        [Authorize]
        [HttpPost]
        public IActionResult Create(string name, string isPrivate, string isMirror, string remoteurl, string description)
        {
            LibGit2Sharp.Repository result = null;
            name = name.Trim();
            var username = HttpContext.User.Identity.Name;
            var reps = _repository.List(r => r.UserName == username).ToList();
            //if (reps.Count > 9)
            //    return View(new { error = "You have Max Limit Repositories 9 " });
            if (reps.Exists(r => r.Name == name))
                return View(new { error = "GitDbRepository with same Name Exist" });
            if (!string.IsNullOrEmpty(name) && string.IsNullOrEmpty(remoteurl))
            {
                result = RepositoryService.CreateRepository(Path.Combine(username, name));
            }
            else if (!string.IsNullOrEmpty(remoteurl))
            {
                remoteurl = remoteurl.Trim();
                result = RepositoryService.CreateRepository(Path.Combine(username, name), remoteurl);
            }
            if (result != null)
            {
                var rep = new GitDbRepository() {
                    Name = name,
                    Description = description,
                    CreationDate = DateTime.Now,
                    DefaultBranch = "master",
                    UserID = int.Parse(HttpContext.User.Claims.First(a => a.Type == ClaimTypes.PrimarySid).Value),
                    UserName = username,
                    IsPrivate = isPrivate == "on" ? true : false,
                    IsMirror = isMirror == "on" ? true : false,  //used for Public 
                    UpdateTime = DateTime.Now
                };
                _repository.Add(rep);
                return Redirect("/");
            }
            return View();
        }

        [Authorize]
        [HttpPost]
        public IActionResult DeleteRepository(int id) {
            LibGit2Sharp.Repository result = null;
            var username = HttpContext.User.Identity.Name;
            var reps = _repository.List(r => r.UserName == username).ToList();
            if (reps.Exists(r => r.ID == id)) {
                RepositoryService.DeleteRepository(Path.Combine(username, reps.First(a => a.ID == id).Name));
                _repository.Delete(reps.First(a => a.ID == id));
            }
            return Redirect("/");
        }
    }
}