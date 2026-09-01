import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { analyzeNarrative } from "./server/analyzeNarrative.js";

function localAnalysisApi(apiKey) {
  return {
    name: "local-analysis-api",
    configureServer(server) {
      server.middlewares.use("/api/analyze", async (request, response) => {
        if (request.method !== "POST") {
          response.statusCode = 405;
          response.end(JSON.stringify({ error: "Method not allowed." }));
          return;
        }

        let body = "";
        request.on("data", (chunk) => {
          body += chunk;
        });
        request.on("end", async () => {
          response.setHeader("Content-Type", "application/json");
          try {
            const result = await analyzeNarrative(JSON.parse(body), apiKey);
            response.end(JSON.stringify(result));
          } catch (error) {
            console.error("Narrative analysis failed:", error.message);
            response.statusCode = 500;
            response.end(JSON.stringify({ error: "The analysis could not be completed. Please try again." }));
          }
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), localAnalysisApi(env.OPENAI_API_KEY)],
  };
});
