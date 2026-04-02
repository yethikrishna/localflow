import { DiscoveryManager } from './manager';

async function testDiscovery() {
  const manager = new DiscoveryManager({ pollingIntervalMs: 2000 });
  console.log('Starting LocalFlow Discovery Manager (Polling every 2s)...');
  
  await manager.start();

  // Run for 10 seconds to observe polling
  let count = 0;
  const timer = setInterval(() => {
    const services = manager.getDiscoveredServices();
    console.log(`[Tick ${++count}] Found ${services.length} service(s).`);
    services.forEach(service => {
      console.log(`  - [${service.type.toUpperCase()}] ${service.name} at ${service.endpoint}`);
    });

    if (count >= 5) {
      clearInterval(timer);
      manager.stop();
      process.exit(0);
    }
  }, 2000);
}

if (require.main === module) {
  testDiscovery().catch(console.error);
}
