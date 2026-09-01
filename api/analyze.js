import { analyzeNarrative } from "../server/analyzeNarrative.js";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed." });
  }

  try {
    const analysis = await analyzeNarrative(request.body, process.env.OPENAI_API_KEY);
    return response.status(200).json(analysis);
  } catch (error) {
    console.error("Narrative analysis failed:", error.message);
    return response.status(500).json({ error: "The analysis could not be completed. Please try again." });
  }
}
