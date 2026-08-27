# Deploying designmd-forge as a remote connector

This mirrors the pattern used for `mcp.quran.us.kg` (quran-search-engine-mcp):
Streamable HTTP transport, no auth, exposed via Cloudflare Tunnel from the
home server.

## 1. Run the HTTP server

Either directly:

```bash
npm install
npm run build
PORT=3000 npm run start:http
```

Or via Docker:

```bash
docker build -t designmd-forge .
docker run -d --name designmd-mcp -p 3000:3000 --restart unless-stopped designmd-forge
```

**Not yet verified**: I don't have a Docker daemon available in the
environment I built this in, so the Dockerfile is untested — worth a
`docker build` locally before relying on it.

The server exposes:
- `GET /` — basic info/status JSON
- `GET /health` — plain "ok", for uptime checks
- `POST /` — the actual MCP endpoint (Streamable HTTP, stateless mode, served at the root path)

## 2. Point a Cloudflare Tunnel at it

Same shape as your existing tunnel config for other services on the home
server — add a route for the new subdomain to the local port:

```yaml
# in your cloudflared config.yml, alongside existing service entries
ingress:
  - hostname: mcp.designmd.<yourdomain>
    service: http://localhost:3000
  # ... existing entries ...
  - service: http_status:404
```

Then `cloudflared tunnel route dns <tunnel-name> mcp.designmd.<yourdomain>`
if that hostname isn't already routed, and restart/reload the tunnel.

## 3. Point an MCP client at it

Claude Desktop/Web, or any Streamable-HTTP-capable client, can connect
directly to `https://mcp.designmd.<yourdomain>/` with no auth — same
as the quran-search-engine-mcp remote connector (root-path endpoint).

## Notes on statelessness

The HTTP transport runs in stateless mode: a fresh `McpServer` +
`StreamableHTTPServerTransport` per request, no session ID, no shared
state between requests. This fits since every tool here is either a pure
read against the bundled local data or a one-shot lint call — there's
nothing to gain from a persistent session, and it means the service is
safe to restart, scale to multiple instances, or sit behind a load
balancer without any session-affinity concerns.

## Process management

For a long-running deployment outside Docker, wrap `npm run start:http`
with whatever you already use for the home server's other Node services
(pm2, a systemd unit, or the existing Tailscale/Cloudflare-fronted service
pattern) so it restarts on crash and on boot.
