# AI Agent: user message (prompt)

Source for Prompt = "Define below". The `{{ }}` fields are filled in from each Google Sheets row.

```
Handle this Google review.

Reviewer: {{ $json.reviewer_name }}
Star rating: {{ $json.star_rating }}
Review text: {{ $json.review_text }}
```
