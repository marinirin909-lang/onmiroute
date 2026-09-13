/**
 * Client-safe half of `cursorAgentCliVersion.ts`.
 *
 * The full module walks the filesystem (`node:fs` / `node:os` / `node:path`) to
 * detect an installed Cursor Agent CLI build. That machinery must never reach a
 * browser bundle, but `src/lib/oauth/constants/oauth.ts` needs the pinned build
 * id — and oauth.ts IS reachable from client components:
 *
 *   ModelSelectModal → @/shared/constants/models → open-sse providerModels
 *     → providerRegistry → providers/index → registry/codebuddy-cn → oauth.ts
 *
 * Importing the fs-bearing module from there dragged `node:fs` into the client
 * chunk graph, which Turbopack rejects while writing the page endpoint:
 *
 *   the chunking context (unknown) does not support external modules
 *   (request: node:fs)   →   /login and /dashboard fail to compile (500)
 *
 * Keep this file free of Node builtins. `cursorAgentCliVersion.ts` re-exports
 * the constant, so its public API is unchanged.
 */

/**
 * Pinned Agent CLI build id used when no local install is found (typical
 * headless OmniRoute). Bump when refreshing Cursor CLI impersonation.
 */
export const CURSOR_AGENT_CLI_VERSION = "2026.07.08-0c04a8a";
