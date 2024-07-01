import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../server/src/shared/trpc";
import { apiBase } from "./config";
import { getStoredAccessToken } from "./utils/auth";
import SuperJSON from "superjson";

export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: SuperJSON,
  links: [
    httpBatchLink({
      url: apiBase,

      headers: () => {
        const token = getStoredAccessToken(localStorage);

        if (!token) return {};

        return {
          Authorization: `Bearer ${token}`,
        };
      },
    }),
  ],
});
