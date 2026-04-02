# LocalFlow - Tool Auto-Discovery Strategy

LocalFlow is designed to be a "Zero Config" platform that automatically finds and connects to your local AI and productivity tools. This document outlines the technical strategy for auto-discovery.

## 1. Discovery Mechanisms

### A. Docker Socket Scanning (Priority 1)
For users running LocalFlow via the provided `docker-compose.yml`, the platform will have access to `/var/run/docker.sock`. 
- **Goal:** Scan other running containers on the same Docker host.
- **Criteria:** Look for containers with specific:
  - **Labels:** `localflow.discovery.type=ollama` or `localflow.discovery.enabled=true`
  - **Image Names:** `ollama/ollama`, `nocodb/nocodb`, `appflowy/appflowy`
  - **Exposed Ports:** `11434` (Ollama), `8080` (NocoDB), `8000` (AppFlowy)
- **Networking:** LocalFlow will automatically attempt to join the same Docker networks or communicate via `host.docker.internal`.

### B. MDNS / Zeroconf (Priority 2)
For tools running natively on the host or other devices in the local network.
- **Goal:** Listen for MDNS advertisements.
- **Service Types:** `_ollama._tcp.local`, `_http._tcp.local`, `_appflowy._tcp.local`
- **Action:** If found, resolve the IP address and verify the service version.

### C. LAN Port Scanning (Priority 3)
A lightweight port scan of common tools on the local network (e.g., `192.168.1.0/24`).
- **Goal:** Find services that are not advertising via MDNS or Docker.
- **Ports to Scan:**
  - `11434` - Ollama
  - `8080/8000` - NocoDB, AppFlowy
  - `3000/3001` - Additional Agent tools
- **Rate Limiting:** Scans will be performed on-demand or with a slow trickle to avoid network congestion.

### D. Default Fallback Configuration
LocalFlow will always attempt to connect to these standard locations by default:
- `http://host.docker.internal:11434` (Ollama)
- `http://localhost:11434` (Ollama, if running natively)

## 2. Discovery Registry

Once a service is discovered, it is added to the internal **Discovery Registry**:
- **Status:** `PENDING_VERIFICATION` | `ACTIVE` | `OFFLINE`
- **Metadata:** Service type, version, endpoint URL, latency.
- **UI:** A notification will appear in LocalFlow asking the user to confirm the connection: 
  > *"LocalFlow found an Ollama instance at 192.168.1.5:11434. Connect now?"*

## 3. Implementation Roadmap (DevOps)

1. **Phase 1:** Implement Docker socket polling in the `localflow-core` container using the `dockerode` library.
2. **Phase 2:** Integrate `mdns` or `bonjour-service` for network-wide discovery.
3. **Phase 3:** Develop a simple dashboard in the UI to manage discovered services and their authentication keys (if any).

## 4. Security Considerations
- **Permissions:** Auto-discovery is opt-in and can be disabled via `DISCOVERY_ENABLED=false`.
- **Docker Socket:** Access to `/var/run/docker.sock` should be handled carefully; the core service will use a read-only client where possible.
- **Trust:** LocalFlow will not send sensitive data to discovered services until they are explicitly trusted by the user.
