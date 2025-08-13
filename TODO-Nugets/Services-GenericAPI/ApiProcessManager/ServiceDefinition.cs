using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;

namespace EasyITCenter.Plugin.Services {

    /// <summary>
    /// Server Database Migrator Service
    /// With Custom Defined DbContextType
    /// Using Definition: Runtime
    /// </summary>
    public class MigratorHostedService : IHostedService {
        private readonly IServiceProvider _serviceProvider;
        public MigratorHostedService(IServiceProvider serviceProvider) {
            _serviceProvider = serviceProvider;
        }


        /// <summary>
        /// Start Controlled DbMigration 
        /// With Custom Defined DbContextType
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="dbContextName"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task StartAsync(CancellationToken cancellationToken) {
            using (var scope = _serviceProvider.CreateScope()) {
                var DbContextForMigration = scope.ServiceProvider.GetRequiredService<DbContext>();
                await DbContextForMigration.Database.MigrateAsync();

                //Stop Migrator After Done
                await StopAsync(new CancellationToken());
            }
        }

        

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    }
}
