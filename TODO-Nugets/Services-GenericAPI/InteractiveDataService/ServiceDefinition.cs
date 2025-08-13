using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;


namespace EasyITCenter.Plugin.Database {

   



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

            using (var scope = _serviceProvider.CreateScope()) {
                object? DbContextForMigration = scope.ServiceProvider.GetRequiredService(userContext.GetType());
                //await DbContextForMigration.Database.MigrateAsync();

                //Stop Migrator After Done
                await StopAsync(new CancellationToken()).ConfigureAwait(false);
            }
        }

        //public Task StartAsync(CancellationToken cancellationToken) {
        //    throw new NotImplementedException();
        //}

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;

    }
}
