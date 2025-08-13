using EasyGitServer.Models;
using EasyGitServer.Repositories;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace EasyGitServer.Infrastructure
{
    public partial class GitServerContext : IdentityDbContext {
        //public GitServerContext() {
        //}

        public GitServerContext(DbContextOptions<GitServerContext> options)
            : base(options)
        {
        }

        public DbSet<AuthorizationLog> AuthorizationLogs { get; set; }
        public DbSet<GitDbRepository> Repositories { get; set; }
        public DbSet<SshKey> SshKeys { get; set; }
        public DbSet<TeamRepositoryRole> TeamRepositoryRoles { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserTeamRole> UserTeamRoles { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<TeamRepositoryRole>().HasKey(t => new { t.TeamID, t.RepositoryID });
            modelBuilder.Entity<UserTeamRole>().HasKey(t => new { t.UserID, t.TeamID });
        }
    }

}
