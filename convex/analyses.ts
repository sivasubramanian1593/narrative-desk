import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const score = v.object({
  score: v.number(),
  explanation: v.string(),
});

const requireUserId = async (ctx: { auth: { getUserIdentity: () => Promise<{ subject: string } | null> } }) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  return identity.subject;
};

export const save = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    return ctx.db.insert("analyses", {
      ...args,
      userId,
      createdAt: Date.now(),
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    return ctx.db
      .query("analyses")
      .withIndex("by_user_created_at", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});
