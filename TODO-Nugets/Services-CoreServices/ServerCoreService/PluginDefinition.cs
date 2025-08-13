using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using GroupwareSolution.Plugin;
using System;

namespace EasyITCenter.Plugin {


    /// <summary>
    /// 
    /// </summary>
    public class TimerService {
        private readonly Task _completedTask = Task.CompletedTask;

        private readonly ILogger _logger;
        private readonly Config _config;
        private Timer _timer;


        public TimerService(ILogger logger, Config config) {
            _logger = logger;
            _config = config;
        }


        public Task StartAsync(CancellationToken stoppingToken) {
            _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromSeconds(5));

            return _completedTask;
        }

        private void DoWork(object? state) {
            //TODO
        }

        public Task StopAsync(CancellationToken stoppingToken) {

            _timer.DisposeAsync();

            return _completedTask;
        }

        public async ValueTask DisposeAsync() {
            if (_timer is IAsyncDisposable timer) {
                await timer.DisposeAsync();
            }

            _timer = null;
        }


    }
    
}
