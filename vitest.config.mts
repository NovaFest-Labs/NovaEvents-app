import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    env: {
      // Empty string = same-origin API routes, which is the correct default
      // for the test environment. getApiBaseUrl() accepts "" but throws on
      // undefined, so this prevents false "missing variable" errors in tests.
      NEXT_PUBLIC_API_URL: "",
    },
  },
});
