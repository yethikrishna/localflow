import { DockerDiscovery, DiscoveredService } from './index';
import { EnvDiscoveryBridge } from './env-bridge';

export interface DiscoveryOptions {
  pollingIntervalMs?: number;
  autoPopulateEnv?: boolean;
}

export class DiscoveryManager {
  private discovery: DockerDiscovery;
  private envBridge: EnvDiscoveryBridge;
  private interval: NodeJS.Timeout | null = null;
  private services: DiscoveredService[] = [];
  private options: Required<DiscoveryOptions>;

  constructor(options: DiscoveryOptions = {}) {
    this.discovery = new DockerDiscovery();
    this.envBridge = new EnvDiscoveryBridge();
    this.options = {
      pollingIntervalMs: options.pollingIntervalMs || 60000, // Default 1 minute
      autoPopulateEnv: options.autoPopulateEnv ?? true,
    };
  }

  /**
   * Starts the auto-discovery polling loop.
   */
  async start(): Promise<void> {
    if (this.interval) return;

    console.log(`Starting LocalFlow Discovery Manager (Interval: ${this.options.pollingIntervalMs}ms)`);
    
    // Initial scan
    await this.tick();

    this.interval = setInterval(() => this.tick(), this.options.pollingIntervalMs);
  }

  /**
   * Stops the auto-discovery polling loop.
   */
  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      console.log('Discovery Manager stopped.');
    }
  }

  private async tick(): Promise<void> {
    try {
      const newServices = await this.discovery.scan();
      
      // Compare with previous state to detect changes
      const hasChanged = this.compareServices(this.services, newServices);
      this.services = newServices;

      if (hasChanged && this.options.autoPopulateEnv) {
        await this.envBridge.populateEnv();
      }

    } catch (error) {
      console.error('Error during discovery tick:', error);
    }
  }

  private compareServices(oldServices: DiscoveredService[], newServices: DiscoveredService[]): boolean {
    if (oldServices.length !== newServices.length) return true;
    
    // Basic comparison by ID and Endpoint
    const oldKeys = oldServices.map(s => `${s.id}-${s.endpoint}`).sort().join(',');
    const newKeys = newServices.map(s => `${s.id}-${s.endpoint}`).sort().join(',');
    
    return oldKeys !== newKeys;
  }

  public getDiscoveredServices(): DiscoveredService[] {
    return [...this.services];
  }
}
