---
title: "Before You Choose an AI Tool, Map the Work"
series: "The Operating Systems Series"
part: "Part I — See the Work"
eyebrow: "SEE THE WORK"
deck: "A one-page workflow map shows where AI can help, where it cannot, and what to fix first, before anyone signs a software contract."
author: "Cypress Command"
date: "2026-09-26"
read_time: "7 min"
desk: "run"
---

# Before You Choose an AI Tool, Map the Work

Most AI purchases start with a demonstration. The tool summarizes a document, drafts an email, answers a question, and the room is impressed. Then it meets the actual work, and nobody can say which step it belongs in. This article gives you a one-page workflow map: seven columns, one row per step, filled in with the people who do the work. It is the first tool in this series, and the articles that follow refer back to it.

## Why the tool question comes second

A tool answers "what can this do?" An operator needs the answer to a different question: "which step of our work gets easier, and who is still accountable for it?" Without a map, the second question has no place to land.

Consider a twelve-person HVAC service company, described here as a hypothetical. The owner hears that AI can read inbound emails and create service tickets. That sounds useful. But in this company, service requests arrive by phone, by text to a technician's personal cell, through the website form, and through a property manager's portal. The dispatcher sets priority from memory of which customers have maintenance agreements. A ticketing assistant that reads email would touch one of four intake paths and none of the priority judgment. It would add a tab. It would not change the work.

The map prevents that outcome. It shows the four intake paths before anyone buys anything. It shows that the real constraint is a priority rule that lives in one person's head. It may show that the first useful change is a single intake point and a written priority rule, with AI coming later or not at all.

That last possibility matters. A good map sometimes tells you not to buy a tool yet. That is a useful result, and it costs far less than learning the same thing after a rollout.

## The seven columns of a workflow map

A workflow map follows the work in the order it happens. Each row is one step. Each step answers seven questions.

| Column | Question it answers | What a good entry looks like |
|---|---|---|
| Trigger | What starts this step? | "Customer submits web form," not "request comes in" |
| Person | Who does the step today? | A role and, during mapping, a name |
| Information source | Where does the person look? | The specific file, system, inbox, or person |
| Action | What does the person actually do? | A verb and an object: "compares quote to contract rate" |
| Review point | Who checks it, if anyone? | A named role, or "none" written plainly |
| Decision | What choice is made here, and by whom? | "Dispatcher sets priority: same day or next day" |
| Handoff | Where does the work go next, and how? | "Text to technician," "status changed in scheduling app" |

Three rules keep the map honest.

- **Map what happens, not what the manual says.** If the procedure says the office manager approves every purchase over a set amount, and in practice the lead technician buys the part and texts a photo of the receipt, the map records the photo.
- **Write "none" and "unknown" when they are true.** A blank review point or an unknown information source is a finding, not a gap in your paperwork.
- **Name the handoff medium.** "Sent to accounting" hides the detail that matters. Email, text, a verbal request, a shared folder, a status change: each behaves differently when someone is out sick.

## A worked example, step by step

The following example is illustrative. Imagine a regional title office handling a residential closing, from order to scheduled signing. The team maps the first five steps.

| # | Trigger | Person | Information source | Action | Review point | Decision | Handoff |
|---|---|---|---|---|---|---|---|
| 1 | Lender or agent emails an order | Intake coordinator | Shared inbox | Opens file in title software | None | None | File appears in processor's queue |
| 2 | New file in queue | Processor | County records site, prior policies folder | Orders search, pulls prior policy | None | Whether a prior policy can be used | Search request to abstractor by email |
| 3 | Search returned | Examiner | Search package (PDF) | Reads chain, lists requirements | Senior examiner, on complex files only | Which requirements go on the commitment | Draft commitment to processor |
| 4 | Draft commitment ready | Processor | Examiner notes, lender instructions | Assembles commitment, requests payoffs | Unknown | None | Payoff requests by fax and email |
| 5 | Payoffs received | Closer | Payoff letters, lender closing figures | Prepares settlement figures | Closer checks own work | Whether figures balance | Figures to lender for approval |

Read the map column by column, and it starts to talk.

The **information source** column shows PDFs and inboxes at almost every step. Those are places where AI can reasonably help: extract requirements from a search package, compare payoff letters to lender figures, summarize what a file is missing. Each of those is a prepare-and-flag job with a person reviewing the result.

The **review point** column shows a problem no tool will fix. Step 4 has an unknown reviewer, and step 3 reviews only "complex" files without a written definition of complex. Before adding AI anywhere near the commitment, the office needs to decide who checks it.

The **handoff** column shows fax, email, and queue changes mixed together. The cleanest first improvement might be making payoff requests trackable, which is a workflow change before it is a technology change.

## Reading the map for where AI belongs

Once the map exists, mark each row with one of three labels.

1. **Prepare.** The step involves reading, sorting, extracting, comparing, or drafting from information the team already has. AI may help here, with a review point after it. Examples: summarize a document, extract dates from a contract, draft a routine reply, flag a figure that does not match.
2. **Decide.** The step is a judgment someone is accountable for: pricing, priority, approval, a promise to a customer. AI can prepare the inputs. A named person makes the call.
3. **Fix first.** The step has an unknown owner, a missing review point, or an information source nobody trusts. Adding AI here only speeds up an unclear process. Fix the step, then revisit it.

Most first maps have more "fix first" rows than anyone expects. That is normal. It is also the most useful thing the map produces, because those rows would have undermined any tool placed on top of them.

Imagine a distributor with three warehouses that maps its order-exception process. The "prepare" rows are easy to spot: reading customer emails, checking stock across locations. The "fix first" row is a credit-hold rule that each warehouse applies differently. The tool conversation can wait until that rule is written down.

## How to run the mapping session

The map takes an afternoon, not a quarter. A simple format works.

- **Pick one workflow.** Choose one that repeats weekly or more, touches at least two people, and causes visible follow-up when it slips. Do not map the whole company.
- **Invite the people who do it.** The owner or manager attends, but the person who does step 3 describes step 3. They know the workarounds.
- **Use a real recent case.** Walk one actual job, order, or file from trigger to finish. Abstract descriptions drift toward the manual.
- **Fill the table live.** A whiteboard, a spreadsheet on a shared screen, or paper. The format matters less than finishing it in the room.
- **Stop at seven to twelve rows.** If the workflow runs longer, split it at a natural handoff and map the second half another day.

End the session by circling three rows: the step with the most follow-up, the step with no review point, and the step where information is hardest to find. Those three circles are your shortlist.

### The view from Arnould Blvd

On The Blvd Shopping Center is a roughly 63,000 SF legacy multi-tenant center at 101–149 Arnould Blvd in Lafayette. A lease obligation with a date is a natural row to map there. The trigger is the date approaching. The information source is the lease record, which in Command Platform lives once and feeds the critical-dates board, so the date and the governing document stay connected. Reading the clause and drafting a first-pass notice is prepare work, and that is the job the platform's AI concierge is scoped for: it summarizes, points to the document, and drafts. It does not send. The review point and the decision stay with the operator, and with the owner where the matter calls for it. The handoff to a tenant or vendor runs through a scoped view, so each party sees its own items and not the rest of the file. Every one of the seven columns has a named home. That is what the map is for.

## The practical next step

1. Choose one recurring workflow this week: one that repeats often and generates follow-up when it slips.
2. Copy the seven-column table into a spreadsheet and schedule a 90-minute session with the people who do the work.
3. Walk one real recent case from trigger to handoff, writing "none" or "unknown" wherever that is the honest answer.
4. Label every row Prepare, Decide, or Fix first, and circle the three rows that matter most.
5. Resolve at least one "fix first" row before you evaluate any AI tool for this workflow.

---

*Cypress Command builds practical AI-enabled operating systems for owner-led businesses — including the owners and operators of commercial real estate. This article is educational. It is not legal, tax, or investment advice.*
