import Docker from 'dockerode';

export * from './env-bridge';
export * from './manager';

export interface DiscoveredService {
  id: string;
  name: string;
  type: 'ollama' | 'nocodb' | 'appflowy' | 'unknown';
  endpoint: string;
  status: 'running' | 'stopped';
  labels: Record<string, string>;
}

export class DockerDiscovery {
  private docker: Docker;

  constructor() {
    this.docker = new Docker({ socketPath: '/var/run/docker.sock' });
  }

  /**
   * Scans for running containers and identifies LocalFlow-compatible services.
   */
  async scan(): Promise<DiscoveredService[]> {
    try {
      const containers = await this.docker.listContainers({ all: false });
      return containers
        .map(container => this.identifyService(container))
        .filter((service): service is DiscoveredService => service !== null);
    } catch (error) {
      console.error('Failed to scan Docker socket:', error);
      return [];
    }
  }

  private identifyService(container: Docker.ContainerInfo): DiscoveredService | null {
    const labels = container.Labels || {};
    const name = container.Names[0].replace('/', '');
    const image = container.Image;

    let type: DiscoveredService['type'] = 'unknown';

    // 1. Check explicit labels
    if (labels['localflow.discovery.type']) {
      type = labels['localflow.discovery.type'] as DiscoveredService['type'];
    } 
    // 2. Check known image names
    else if (image.includes('ollama/ollama')) {
      type = 'ollama';
    } else if (image.includes('nocodb/nocodb')) {
      type = 'nocodb';
    } else if (image.includes('appflowy/appflowy')) {
      type = 'appflowy';
    }

    // If type is still unknown, we don't include it unless explicitly enabled by label
    if (type === 'unknown' && !labels['localflow.discovery.enabled']) {
      return null;
    }

    // Determine endpoint
    // By default, services in Docker are reached via container name within the same network,
    // or via mapped ports on host.docker.internal.
    const portMapping = container.Ports.find(p => p.PublicPort);
    const endpoint = portMapping 
      ? `http://host.docker.internal:${portMapping.PublicPort}`
      : `http://${name}:${container.Ports[0]?.PrivatePort || 80}`;

    return {
      id: container.Id,
      name,
      type,
      endpoint,
      status: container.State === 'running' ? 'running' : 'stopped',
      labels,
    };
  }
}
