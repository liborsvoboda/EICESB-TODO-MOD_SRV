using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Runtime.CompilerServices;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
namespace EasyITCenter.Plugin.Database {


    //  dotnet ef migrations add<Migration Name> --project./Migrations/BoxedSoftware.Sqlite -- --provider Sqlite
    // dotnet ef migrations add <Migration Name> --project./Migrations/BoxedSoftware.Postgres -- --provider Postgres

    /*
     * builder.Services.AddDbContext<VehiclesContext>(options =>
{
    var provider = config.GetValue("provider", Sqlite.Name);

    if (provider == Sqlite.Name)
    {
        options.UseSqlite(
            config.GetConnectionString(Sqlite.Name)!,
            x => x.MigrationsAssembly(Sqlite.Assembly)
        );
    }

    if (provider == Postgres.Name) {
        options.UseNpgsql(
            config.GetConnectionString(Postgres.Name)!,
            x => x.MigrationsAssembly(Postgres.Assembly)
        );
    }
});
     * */



    /// <summary>
    /// Server Database Migrator Service
    /// With Custom Defined DbContextType
    /// Using Definition: Runtime
    /// </summary>
    public class MigratorHostedService : IHostedService {
        private readonly IServiceProvider _serviceProvider;
        public DbContext userContext;

        public  MigratorHostedService(IServiceProvider serviceProvider, DbContext _userContext) {
            _serviceProvider = serviceProvider;
            userContext = _userContext;
        }

        /// Start Controlled DbMigration 
        /// With Custom Defined DbContextType
        public async Task StartAsync(CancellationToken cancellationToken) {
            Type? selectedDbContextName = Activator.CreateInstance<>();
            using (var scope = _serviceProvider.CreateScope()) {
               object? DbContextForMigration = scope.ServiceProvider.GetRequiredService(selectedDbContextName);
                await DbContextForMigration.Database.MigrateAsync();

                //Stop Migrator After Done
                await StopAsync(CancellationToken cancellationToken = default);
            }
        }

        //public Task StartAsync(CancellationToken cancellationToken) {
        //    throw new NotImplementedException();
        //}

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;

    }
}
