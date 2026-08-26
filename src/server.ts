import { createRequire } from 'node:module';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerBrowseTools } from './tools/browse.js';
import { registerGetDesignTool } from './tools/getDesign.js';
import { registerGuardrailsTool } from './tools/guardrails.js';
import { registerLintTool } from './tools/lint.js';
import { registerDiffTool } from './tools/diff.js';
import { registerAuthoringTools } from './tools/authoring.js';

// Derive name/version from package.json so they never drift from the npm
// manifest (works from src/ in dev and dist/ after build, both one level deep).
const require = createRequire(import.meta.url);
const pkg = require('../package.json') as { name: string; version: string };
export const SERVER_NAME = pkg.name;
export const SERVER_VERSION = pkg.version;

/**
 * Builds a fresh McpServer instance with all tools registered. Used by
 * both the stdio entry point (one long-lived server per process) and the
 * HTTP entry point (one server per request, in stateless mode).
 */
export function createServer(): McpServer {
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  registerBrowseTools(server);
  registerGetDesignTool(server);
  registerGuardrailsTool(server);
  registerLintTool(server);
  registerDiffTool(server);
  registerAuthoringTools(server);

  return server;
}
