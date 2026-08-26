#!/usr/bin/env node
import express, { type Request, type Response, type NextFunction } from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createServer, SERVER_NAME, SERVER_VERSION } from './server.js';

const PORT = Number(process.env.PORT ?? 3000);
const MCP_PATH = process.env.MCP_PATH ?? '/mcp';

const app = express();
app.use(express.json({ limit: '2mb' }));

// Permissive CORS so browser-based MCP clients (e.g. Claude web) can
// connect directly, matching the no-auth remote-connector pattern used
// for mcp.quran.us.kg. Tighten this (specific origins) if you'd rather
// not allow arbitrary browser origins.
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Mcp-Session-Id, Mcp-Protocol-Version'
  );
  res.setHeader('Access-Control-Expose-Headers', 'Mcp-Session-Id');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: SERVER_NAME,
    version: SERVER_VERSION,
    transport: 'streamable-http',
    mcp_endpoint: MCP_PATH,
    status: 'ok',
  });
});

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).send('ok');
});

// Stateless mode: a fresh McpServer + transport per request. No session
// state is needed since every tool here is a pure read (or a lint call
// with no cross-request memory), so there's nothing to gain from holding
// a session open, and it keeps the deployment simple (no session store,
// safe behind a load balancer / restart without losing in-flight state).
app.post(MCP_PATH, async (req: Request, res: Response) => {
  try {
    const server = createServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    res.on('close', () => {
      transport.close();
      server.close();
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error('MCP request error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: { code: -32603, message: 'Internal server error' },
        id: null,
      });
    }
  }
});

// Stateless mode has no session to resume or close, so GET (server-push
// streams) and DELETE (session termination) aren't meaningful here.
app.get(MCP_PATH, (_req: Request, res: Response) => {
  res.status(405).json({
    jsonrpc: '2.0',
    error: { code: -32000, message: 'Method not allowed: this server runs in stateless mode' },
    id: null,
  });
});

app.delete(MCP_PATH, (_req: Request, res: Response) => {
  res.status(405).json({
    jsonrpc: '2.0',
    error: { code: -32000, message: 'Method not allowed: this server runs in stateless mode' },
    id: null,
  });
});

app.listen(PORT, () => {
  console.error(`${SERVER_NAME} (Streamable HTTP) listening on port ${PORT}, endpoint ${MCP_PATH}`);
});
