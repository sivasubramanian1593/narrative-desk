# Product Narrative Analyzer — V1 Scope

## 1. Product summary

Product Narrative Analyzer helps product marketers evaluate a draft product narrative, understand what is working or unclear, and generate three stronger alternatives they can use for a launch.

## 2. Problem

Product marketers often know the product and audience but struggle to turn that knowledge into a clear, differentiated, emotionally effective launch narrative. Reviewing and rewriting the narrative manually is slow, and it can be difficult to judge whether the message will resonate.

## 3. Primary user

A product marketer preparing a product launch narrative.

Example: Siva writes a launch narrative but is not confident that it communicates the problem, value, and differentiation clearly. Siva submits it to the product, reviews structured feedback, and chooses one of three alternate narratives.

## 4. Core promise

Paste a product narrative and receive a clear assessment plus three launch-ready alternatives that stay close to the original length.

## 5. Success definition

The core action is successful when a user copies one of the alternate narratives with the intention of using or adapting it for a launch.

V1 should track:

- Percentage of completed analyses where an alternate narrative is copied.
- Which of the three alternatives is copied.
- Percentage of users who return and analyze another narrative.

The riskiest assumption is that a product marketer will trust an AI-generated rewrite enough to ship or adapt it. Copying an alternative is the first useful signal, but future user research should confirm whether it was actually used.

## 6. User journey

1. The user signs in with Google.
2. The user opens the narrative analyzer.
3. The user chooses B2B or B2C.
4. The user enters a short target-audience description containing the exact industry and target persona, such as “Healthcare CFOs” or “Software marketing leaders.”
5. The user chooses the desired emotion.
6. The user pastes a narrative of no more than 1,000 words.
7. The user submits the narrative for analysis.
8. The product shows six scores, structured feedback, and three alternate narratives.
9. The user copies a preferred alternate narrative.
10. The analysis is saved automatically and can be reopened from history.

## 7. V1 inputs

### Market type

Required dropdown with two options:

- B2B
- B2C

### Target audience

Required short text field. The prompt should ask for both:

- Exact industry, such as healthcare, software, or financial services.
- Target persona, such as CFO, finance leader, or marketing head.

Example placeholder: “Healthcare CFOs responsible for reducing operating costs.”

### Desired emotion

Required dropdown with these fixed options:

- Trust
- Urgency
- Excitement
- Curiosity
- Confidence
- Aspiration

### Narrative

Required text box with:

- A live word count.
- A maximum of 1,000 words.
- A disabled Analyze button when the limit is exceeded.
- A clear message explaining that the narrative must be shortened to 1,000 words or fewer.

## 8. V1 output

### Narrative scorecard

Score each area from 1 to 5, where 1 is weak and 5 is strong:

1. Audience clarity
2. Problem clarity
3. Value
4. Differentiation
5. Credibility
6. Emotional fit

Each score must include a short explanation tied to the submitted narrative. The tool must not present a score without explaining why it received that score.

### Feedback

Feedback must appear in this order:

1. What works
2. What is unclear
3. How to improve

Feedback should be specific to the submitted narrative, market type, audience, and selected emotion. It should avoid generic writing advice.

### Alternate narratives

Generate exactly three alternatives. Each alternative must:

- Stay close to the original narrative’s length.
- Preserve accurate product facts from the original.
- Address the weaknesses identified in the feedback.
- Fit the selected audience and desired emotion.
- Have its own Copy button.

The product must not invent customer names, performance figures, testimonials, certifications, or product capabilities that were not in the submitted narrative.

## 9. Accounts and saved history

- Users sign in with Google.
- Every completed analysis is saved automatically to the signed-in user’s account.
- A history page lists previous analyses, newest first.
- Each history item shows enough information to identify it, including the date and a short excerpt of the original narrative.
- Opening a history item shows the original inputs, six scores, feedback, and all three alternatives.
- One user cannot access another user’s saved narratives.

## 10. Main screens

V1 contains four main screens:

1. Google sign-in
2. Narrative analyzer form
3. Analysis results
4. Saved analysis history and detail

## 11. Required states

The product must clearly handle:

- Empty required fields.
- A narrative over 1,000 words.
- Analysis in progress.
- Analysis failure with a retry option.
- No saved analyses yet.
- A saved analysis loading or failing to load.
- Copy success confirmation.

## 12. Out of scope for V1

- Exporting results to files or other tools.
- Languages other than English.
- Team accounts, shared workspaces, or collaboration.
- Custom scoring criteria.
- User-edited emotion options.
- Side-by-side editing or document version control.
- Claims that an alternate narrative is guaranteed to perform better.

## 13. Acceptance criteria

V1 is ready when all of the following are true:

- A user can sign in with Google and sign out.
- A signed-in user can select B2B or B2C, describe an industry and persona, select one of the six emotions, and paste a narrative.
- The interface shows a live word count and blocks submission above 1,000 words.
- A valid submission returns six explained scores, the three agreed feedback sections, and exactly three alternate narratives.
- Each alternate stays close to the original length and can be copied separately.
- Copying an alternative records which option was copied and confirms the action on screen.
- A completed analysis is saved automatically.
- The user can reopen the full analysis from history.
- Saved analyses are private to the signed-in user.
- Empty, loading, failure, retry, and copy-success states are understandable to a first-time user.
- No export, second-language, or team-account features are present.

## 14. Product decisions still open

These choices can be made during design without changing the agreed scope:

- Final product name.
- Visual style and brand colors.
- Exact short labels used for the three alternate narratives.
- Whether the result appears on the same page as the form or on a separate results page.
