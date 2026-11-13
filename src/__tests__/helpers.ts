import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createServer } from '../server.js';

export interface ToolResult {
  [key: string]: unknown;
  isError?: boolean;
  text?: string;
}

/**
 * Calls one tool through a real in-memory MCP client. Success returns the
 * structuredContent (so tests read `res.matches`); a tool-level error returns
 * `{ isError: true, text }` instead of throwing, so error paths are testable.
 */
export async function callTool(name: string, args: Record<string, unknown>): Promise<ToolResult> {
  const server = createServer();
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: 'test-client', version: '1.0.0' });
  await server.connect(serverTransport);
  await client.connect(clientTransport);

  try {
    const result = await client.callTool({ name, arguments: args });
    const content = (result.content ?? []) as Array<{ type: string; text?: string }>;
    const text = content.map((part) => part.text ?? '').join('\n');
    if (result.isError) return { isError: true, text };
    if (result.structuredContent) return result.structuredContent as ToolResult;
    return { text };
  } catch (error) {
    return { isError: true, text: error instanceof Error ? error.message : String(error) };
  } finally {
    await client.close();
    await server.close();
  }
}

export async function listToolNames(): Promise<string[]> {
  return (await listTools()).map((tool) => tool.name).sort();
}

export interface ToolInfo {
  name: string;
  description?: string;
  annotations?: { readOnlyHint?: boolean };
}

export async function listTools(): Promise<ToolInfo[]> {
  const server = createServer();
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: 'test-client', version: '1.0.0' });
  await server.connect(serverTransport);
  await client.connect(clientTransport);
  try {
    const { tools } = await client.listTools();
    return tools as ToolInfo[];
  } finally {
    await client.close();
    await server.close();
  }
}
