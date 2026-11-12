# What broke, and what I changed

Every problem hit while building and testing the workflow, in the order it happened. The first four were technical. The last four were about the AI itself, and they changed the design.

| # | What broke | What I saw | Fix | Lesson |
|---|---|---|---|---|
| 1 | A leftover, empty Google Sheets node on the canvas | "Workflow execution cannot start: Document is required" | Found the duplicate node and deleted it | One broken node stops the whole workflow |
| 2 | The Structured Output Parser needed its own model | Red warning on the parser | Connected a second Groq model, which **auto-fix** uses to repair bad outputs | Safety features need their own resources |
| 3 | Groq free-plan rate limit | "The service is receiving too many requests" after about 11 of 15 reviews | Added a **Limit** node: 5 reviews per run. Status is tracked in the Sheet, so nothing is processed twice | Batch work to fit API limits |
| 4 | Malformed AI output on 1 review in 5 | "Failed to parse tool call arguments as JSON" | **Retry on fail** (3 tries, 3 s apart) + **continue on error**, so one bad answer can't stop the batch | Expect AI to fail sometimes |
| 5 | Privacy leak on friendly reviews | "...a positive experience with Dr. Patel", "...enjoyed your cleaning" | Stricter rules for positive reviews, a good and a bad example, and a self-check | The AI was careful on complaints and careless on praise |
| 6 | The prompt still leaked | "...satisfied with your crown" (R004) | Added a **Code node** that scans every draft for banned words and forces human review, overruling the AI | A prompt is not a guarantee; code is |
| 7 | Subtle leaks the word list missed | "...glad we could make it comfortable" (R006), "...serve you again" (R009) | Expanded the list (`again`, `comfortable`, `you received`...) | No word list catches every phrasing |
| 8 | Alert emails lost their line breaks | The whole email arrived as one paragraph | Rebuilt it as an **HTML** template | Small polish makes the human step faster |

**Design change:** I started out expecting to auto-approve "safe" replies. After problems 5–7, every reply became a draft that a human must approve.
