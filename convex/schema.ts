import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const score = v.object({
  score: v.number(),
  explanation: v.string(),
});

export default defineSchema({
  analyses: defineTable({
    userId: v.string(),
    narrative: v.string(),
    marketType: v.string(),
    audience: v.string(),
    emotion: v.string(),
    scores: v.object({
      audienceClarity: score,
      problemClarity: score,
      value: score,
      differentiation: score,
      credibility: score,
      emotionalFit: score,
    }),
    alternatives: v.array(
      v.object({
        title: v.string(),
        narrative: v.string(),
      }),
    ),
    createdAt: v.number(),
  }).index("by_user_created_at", ["userId", "createdAt"]),
});
