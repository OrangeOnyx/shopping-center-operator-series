---
title: "Design for the Work That Does Not Go According to Plan"
series: "The Operating Systems Series"
part: "Part II — Build What Helps"
eyebrow: "BUILD WHAT HELPS"
deck: "Every workflow has a normal path and a set of exceptions. Give the exceptions a catalog, a queue, an owner, and a clock."
author: "Cypress Command"
date: "2026-09-26"
read_time: "7 min"
desk: "run"
---

# Design for the Work That Does Not Go According to Plan

Most workflow designs describe the normal path in detail and treat everything else as someone's problem later. That works until the exceptions pile up in inboxes, sticky notes, and memory. This article shows how to name the exceptions a workflow produces, give them one place to land with an owner, and use them to improve the system over time.

## Where exceptions come from

An **exception** is work that does not follow the expected path. The invoice does not match the purchase order. The customer replies with a question instead of a signature. The document arrives missing a page. Nothing is wrong with the team. The work simply did something the process did not anticipate.

Every recurring workflow produces exceptions. Imagine a distributor with three warehouses. The normal path for an order is simple: receive, pick, pack, ship, invoice. The exceptions are where the phone calls happen. A partial shipment because one warehouse is short. A customer who wants to change the delivery address after the order is picked. A pallet that arrives damaged. A freight charge that does not match the quote.

Experienced people handle these well. They know which customer to call, which carrier to push, and which invoice can wait. The trouble is that this knowledge lives in their heads, and the exceptions themselves live wherever they first appeared: an email thread, a voicemail, a note on a clipboard. Nobody can see how many are open, how old they are, or who has them.

That is manageable when volume is low. It gets harder as the business grows, and it gets harder still when AI enters the workflow.

## Why AI makes exception design more important

AI is good at the normal path. It can extract fields from a standard form, draft a routine reply, and route a familiar request. That is exactly why exceptions need more attention once AI is involved.

- **AI can process an exception as if it were normal.** A document in an unfamiliar format may still produce a tidy extraction, with a wrong field in it. Without a deliberate check, the error looks like success.
- **Exceptions can drop silently.** When a person handled every item, they noticed the odd one. When AI handles the routine items, the odd one may sit untouched because nobody is looking at the stream anymore.
- **The inbox becomes the queue by default.** If the system has no place for exceptions, they return to email, and the team is back to chasing updates, which the third article in this series treats as a signal worth reading.

The fix is not to make AI handle more exceptions. The fix is to design the path for work that leaves the normal path. AI can help with that path. It can detect a mismatch, flag an item that does not fit, prepare a summary of what is missing, and route it to the right person. A person still decides how the exception is resolved.

## Build an exception catalog

Start by listing the exceptions your workflow already produces. You do not need a complete list. The five or six most familiar ones often cover much of the day-to-day noise, and the team can usually name them in a short conversation.

For each exception, fill in one row of a catalog. The worksheet below uses an illustrative twelve-person HVAC service company and its service-call workflow.

| Exception | How it is detected | Owner | First touch within | Resolution path |
|---|---|---|---|---|
| Part not in stock for a scheduled job | Technician note or inventory check at dispatch | Parts coordinator | Same business day | Order the part, reschedule with the customer, update the job |
| Customer disputes an invoice line | Customer reply or call | Office manager | One business day | Pull the job notes and photos, review with the technician, respond |
| Warranty status unclear | Serial number does not match a warranty record | Service manager | Two business days | Confirm with the manufacturer, then bill or file the claim |
| Technician finds a safety issue beyond the job scope | Technician report | Service manager | Same day | Call the customer, document the finding, schedule the follow-up |
| Job notes too thin to invoice | AI flags missing fields in the notes | Technician who ran the job | One business day | Technician completes the notes before billing |

All of these entries, including the time targets, are illustrative. Your own will differ. What matters is that each exception now has a detection method, a named owner, a clock, and a known path. The last row shows AI in its proper place: it detects that the notes are incomplete and flags them. It does not guess the missing details.

Two tests help you judge a catalog row.

- **Could a new employee act on it?** If the resolution path depends on knowing who to call without saying who, the row is not finished.
- **Is the owner a person or a role with a named person behind it?** An exception owned by "the office" will be owned by nobody on a busy day.

## The exception queue: one place, one owner, one clock

An **exception queue** is where exceptions land, with an owner, until they are resolved. It can be a view in your existing software, a shared board, or a simple list. The tool matters less than the discipline around it. Use this checklist to design one.

- **One place.** Every exception from the workflow lands in the same queue, whether a person or the system raised it. No side lists.
- **Each item carries its context.** What happened, when, which record it relates to, and what is missing. AI can prepare this summary so the owner does not start from scratch.
- **Each item has one owner.** Assigned when the item enters the queue, from the catalog. Reassigned on the record, not by forwarding an email.
- **Each item has a clock.** The first-touch target from the catalog. Items past their target are visible to the process owner.
- **An escalation path.** Who takes over when the owner is out, or when an exception is bigger than their authority.
- **A closure rule.** What "resolved" means, and a short note on how it was resolved. Those notes are the raw material for improving the workflow.
- **A catch-all.** Some exceptions will not match any catalog row. They go into the same queue, tagged as new, and get assigned by the process owner.

Consider an illustrative property management office handling rent receipts. A tenant pays a partial amount, or pays two months at once, or pays under a different entity name. Each of those is an exception to the normal posting path. In a well-designed queue, the system flags the mismatch, prepares a note comparing the payment to the lease charge, and assigns it to the bookkeeper. The bookkeeper decides how to apply the payment and whether the tenant needs a call.

### The view from Arnould Blvd

A legacy center carries obligations that do not fit the usual template, and the recorded documents at On The Blvd show two of them. A church access-and-parking easement contains a liquor waiver, in its section 3a, that survives the easement's own termination, and the liquor line is drawn on the recorded plat. An obligation that outlives its document is a textbook exception: a workflow keyed to expiry dates would never catch it, because expiry is exactly when it keeps going. A reciprocal access and parking servitude with the bank parcel at the corner, a parcel that is not part of the center, runs to a fixed end date and reserves spaces for the bank. Both belong in an exception catalog with a named owner and a stated way to detect when they matter. In Command Platform, compliance items are tied to their recorded sources, so the exception sits beside the document that created it. The AI concierge can find that document and summarize it. A person decides what the obligation means for a given request.

## Learn from the queue

An exception queue is also a source of information about the workflow. Review it on a regular cadence, as part of the operating routine, with the process owner and the people who resolve the items. Ask four questions.

1. **Which exceptions recur?** A recurring exception may be a sign that the normal path is missing a step. The distributor that keeps seeing address changes after picking might add a confirmation step before picking starts.
2. **Which could become part of the normal path?** Some exceptions follow the same resolution every time. Those can become a rule, a template, or a prepared draft, with review set at the right level.
3. **Which should always stay with a person?** Disputes, safety issues, and anything touching a relationship usually belong here. Write that down so nobody tries to automate them later.
4. **Which items are aging?** Old items point to an unclear owner, a missing authority, or a resolution path that does not work.

Over time, a well-run queue should shrink in the places where the process can absorb the exception and stay steady in the places where judgment is the point. Both outcomes are useful. The system gets better at the routine work, and the people get more time for the work that needs them.

## The practical next step

1. Choose one recurring workflow and ask the people who run it to name the five or six exceptions they handle most often.
2. Build a catalog row for each: how it is detected, who owns it, the first-touch target, and the resolution path.
3. Pick one place for the exception queue and move every open exception there, including the ones currently living in inboxes.
4. Decide where AI can help at the edges of the queue: detecting mismatches, flagging incomplete items, preparing summaries, and routing to the catalog owner.
5. Put a monthly queue review on the calendar and use the four questions above to decide what to change.

---

*Cypress Command builds practical AI-enabled operating systems for owner-led businesses — including the owners and operators of commercial real estate. This article is educational. It is not legal, tax, or investment advice.*
