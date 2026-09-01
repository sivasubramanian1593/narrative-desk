const SCORE_NAMES = [
  "audienceClarity",
  "problemClarity",
  "value",
  "differentiation",
  "credibility",
  "emotionalFit",
];

const analysisSchema = {
  name: "narrative_scorecard",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["scores", "alternatives"],
    properties: {
      scores: {
        type: "object",
        additionalProperties: false,
        required: SCORE_NAMES,
        properties: Object.fromEntries(
          SCORE_NAMES.map((name) => [
            name,
            {
              type: "object",
              additionalProperties: false,
              required: ["score", "explanation"],
              properties: {
                score: { type: "integer", minimum: 1, maximum: 5 },
                explanation: { type: "string" },
              },
            },
          ]),
        ),
      },
      alternatives: {
        type: "array",
        minItems: 3,
        maxItems: 3,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["title", "narrative"],
          properties: {
            title: { type: "string" },
            narrative: { type: "string" },
          },
        },
      },
    },
  },
};

export async function analyzeNarrative(input, apiKey) {
  if (!apiKey) {
    throw new Error("OpenAI is not configured.");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-5.4-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a rigorous product-marketing editor. First, score the submitted narrative from 1 (weak) to 5 (strong) in exactly six areas. Base every explanation on the submitted words and context, use plain English, and keep each explanation to one concise sentence. Then write exactly three improved alternate narratives. Keep each alternative within about 15% of the original word count, preserve every factual claim, fit the stated audience and desired emotion, and do not invent customers, figures, testimonials, certifications, or capabilities. Give each alternative a short title and make the three approaches meaningfully different.",
        },
        {
          role: "user",
          content: `Market type: ${input.marketType}\nIndustry and target persona: ${input.audience}\nDesired emotion: ${input.emotion}\n\nNarrative:\n${input.narrative}`,
        },
      ],
      response_format: { type: "json_schema", json_schema: analysisSchema },
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error?.message || "OpenAI could not analyze the narrative.");
  }

  const content = payload?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned an empty analysis.");
  }

  return JSON.parse(content);
}
