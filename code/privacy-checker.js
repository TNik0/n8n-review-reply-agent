// n8n Code node: "Privacy checker"
// Mode: Run Once for Each Item · Language: JavaScript
//
// Runs after the AI Agent. It can only make a review STRICTER:
// it can force human review, but it can never approve one.

const out = $json.output || {};
const review = $('Limit').item.json;
const reply = (out.draft_reply || '').toLowerCase();

// Words that must never appear in a public reply
const banned = ['dr.', 'doctor', 'dentist', 'hygienist', 'cleaning', 'crown',
  'root canal', 'tooth', 'teeth', 'extraction', 'filling', 'implant',
  'infection', 'treatment', 'procedure', 'appointment', 'your visit',
  'welcome you back', 'see you again', 'insurance', '$',
  // added after the second test batch
  'again', 'comfortable', 'you received', 'your care', 'we treated', 'our patient'];

const hits = banned.filter(w => reply.includes(w));

let needsHuman = out.needs_human === 'yes';
let reason = out.reason || '';

if (hits.length > 0) {
  needsHuman = true;
  reason = 'PRIVACY CHECK FAILED (found: ' + hits.join(', ') + '). ' + reason;
}
if (Number(review.star_rating) <= 2) needsHuman = true;

return {
  json: {
    row_number: review.row_number,
    review_id: review.review_id,
    category: out.category,
    needs_human: needsHuman ? 'yes' : 'no',
    draft_reply: out.draft_reply,
    reason: reason,
    privacy_flags: hits.join(', ')
  }
};
