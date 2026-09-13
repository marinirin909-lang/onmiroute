import { createErrorResponse, createErrorResponseFromUnknown } from "@/lib/api/errorResponse";
import { requireManagementAuth } from "@/lib/api/requireManagementAuth";
import { readPoolEgressObservation } from "@/lib/proxyPoolEgressObservation";

// Observed egress spread of a proxy pool, read from the proxy log (numbers only). Kept
// apart from GET /api/settings/proxies/pool on purpose: a failure here answers null and
// can never break the pool editor. Same management-auth tier as the pool route.
//
//   GET ?scope=&scopeId= -> { connections, distinctExits, maxConnectionsOnOneExit, windowHours }
//                           | null (read failed or PROXY_POOL_EGRESS_OBSERVATION=false)

export async function GET(request: Request) {
  const authError = await requireManagementAuth(request);
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope");
    if (!scope) {
      return createErrorResponse({
        status: 400,
        message: "scope is required",
        type: "invalid_request",
      });
    }
    const scopeId = searchParams.get("scopeId")?.trim() || null;
    if (scope !== "global" && !scopeId) {
      return createErrorResponse({
        status: 400,
        message: "scopeId is required for provider/account/combo/key scope",
        type: "invalid_request",
      });
    }
    return Response.json(readPoolEgressObservation(scope, scope === "global" ? null : scopeId));
  } catch (error) {
    return createErrorResponseFromUnknown(error, "Failed to load pool egress observation");
  }
}
