import { DockerDiscovery, DiscoveredService } from './index';

export interface DiscoveryMemory {
  recordDiscovery(services: DiscoveredService[]): Promise<void>;
}

export class EnvDiscoveryBridge {
  private discovery: DockerDiscovery;
  private memory?: DiscoveryMemory;

  constructor(memory?: DiscoveryMemory) {
    this.discovery = new DockerDiscovery();
    this.memory = memory;
  }

  /**
   * Scans for services and populates process.env with the discovered endpoints.
   * This ensures the MCP tools and other parts of the system pick up the correct URLs.
   */
  async populateEnv(): Promise<void> {
    if (process.env.DISCOVERY_ENABLED !== 'true') {
      console.log('Discovery is disabled. Skipping env population.');
      return;
    }

    console.log('Running auto-discovery of local services...');
    const services = await this.discovery.scan();

    // Persist discovered services to memory if available
    if (this.memory && services.length > 0) {
      await this.memory.recordDiscovery(services);
    }

    services.forEach((service: DiscoveredService) => {
      const envKey = this.getEnvKey(service.type);
      if (envKey) {
        // Only set if not already defined (allow manual override via .env)
        if (!process.env[envKey]) {
          console.log(`Setting ${envKey}=${service.endpoint} (Discovered via ${service.name})`);
          process.env[envKey] = service.endpoint;
        } else {
          console.log(`Using existing ${envKey}=${process.env[envKey]} (Skipping discovered ${service.endpoint})`);
        }
      }
    });
  }

  private getEnvKey(type: DiscoveredService['type']): string | null {
    switch (type) {
      case 'ollama': return 'OLLAMA_BASE_URL';
      case 'nocodb': return 'NOCODB_BASE_URL';
      case 'appflowy': return 'APPFLOWY_BASE_URL';
      default: return null;
    }
  }
}
