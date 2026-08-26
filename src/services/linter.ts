import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFile, unlink, mkdtemp } from "node:fs/promises";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));

// Resolve the locally installed CLI binary rather than shelling out to npx,
// so linting/diffing works offline after `npm install` and doesn't silently
// fetch a different version at call time. On Windows the npm bin is a `.cmd`
// wrapper that `execFile` only resolves if the extension is explicit.
const CLI_BIN =
  process.platform === "win32"
    ? join(__dirname, "..", "..", "node_modules", ".bin", "designmd.cmd")
    : join(__dirname, "..", "..", "node_modules", ".bin", "designmd");

export interface LintFinding {
  severity: "error" | "warning" | "info";
  message: string;
  path?: string;
  rule?: string;
}

export interface LintResult {
  findings: LintFinding[];
  summary: { errors: number; warnings: number; infos: number };
}

/**
 * Runs the official @google/design.md CLI (npm: @google/design.md, binary:
 * designmd) with `lint` on the given content. The CLI can exit non-zero on
 * findings while still printing valid JSON to stdout, so we parse stdout on
 * both success and non-zero exit paths. Writes content to a temp file for
 * portability across platforms.
 */
export async function lintDesignMdContent(content: string): Promise<LintResult> {
  const dir = await mkdtemp(join(tmpdir(), "designmd-lint-"));
  const filePath = join(dir, "DESIGN.md");
  try {
    await writeFile(filePath, content, "utf-8");
    const { stdout } = await execFileAsync(CLI_BIN, ["lint", "--format", "json", filePath], {
      timeout: 15000,
    });
    return JSON.parse(stdout) as LintResult;
  } catch (err: unknown) {
    const asExecError = err as { stdout?: string; message?: string };
    if (asExecError.stdout) {
      try {
        return JSON.parse(asExecError.stdout) as LintResult;
      } catch {
        // fall through to rethrow below
      }
    }
    throw new Error(`designmd lint CLI failed: ${asExecError.message ?? String(err)}`);
  } finally {
    await unlink(filePath).catch(() => {});
  }
}

export interface DiffResult {
  tokens: Record<string, { added: string[]; removed: string[]; modified: string[] }>;
  findings: {
    before: { errors: number; warnings: number; infos: number };
    after: { errors: number; warnings: number; infos: number };
    delta: { errors: number; warnings: number };
  };
  regression: boolean;
}

/**
 * Compares two DESIGN.md documents with the official @google/design.md CLI's
 * `diff` command. It diffs declared tokens (colors, typography, rounded,
 * spacing, components) and reports a `regression` flag (exit 1 = regression).
 * Returns the parsed JSON it prints to stdout.
 */
export async function diffDesignMdContent(beforeContent: string, afterContent: string): Promise<DiffResult> {
  const dir = await mkdtemp(join(tmpdir(), "designmd-diff-"));
  const beforePath = join(dir, "before.DESIGN.md");
  const afterPath = join(dir, "after.DESIGN.md");
  try {
    await writeFile(beforePath, beforeContent, "utf-8");
    await writeFile(afterPath, afterContent, "utf-8");
    const { stdout } = await execFileAsync(CLI_BIN, ["diff", beforePath, afterPath], {
      timeout: 15000,
    });
    return JSON.parse(stdout) as DiffResult;
  } catch (err: unknown) {
    // Non-zero exit on regression still prints the JSON to stdout.
    const asExecError = err as { stdout?: string; message?: string };
    if (asExecError.stdout) {
      try {
        return JSON.parse(asExecError.stdout) as DiffResult;
      } catch {
        // fall through to rethrow below
      }
    }
    throw new Error(`designmd diff CLI failed: ${asExecError.message ?? String(err)}`);
  } finally {
    await unlink(beforePath).catch(() => {});
    await unlink(afterPath).catch(() => {});
  }
}