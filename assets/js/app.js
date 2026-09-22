/* ==========================================================================
   Cypress Command — interactive components + article engine
   ========================================================================== */
(function () {
  "use strict";

  /* ----------------------------------------------------------------------
     Interactive data
     -------------------------------------------------------------------- */

  const CHECKLISTS = {
    "pm-master": {
      title: "The master checklist",
      accentCycle: ["terra", "olive", "mustard", "oxblood"],
      storageNote: "Progress saves in this browser as you check items.",
      sections: [
        {
          title: "Daily & weekly — the field rhythm",
          items: [
            { t: "Walk the center: storefronts, sidewalks, parking field, lighting", n: "Look for trip hazards, burned-out poles, cart damage, standing water." },
            { t: "Check the main field and remote lots for litter, illegal dumping, and cart corrals", n: "Remote lots get skipped first; make them an explicit stop." },
            { t: "Inspect dumpster and rear service areas; confirm gates and enclosure", n: "Rear-of-house condition shows up in tenant satisfaction first." },
            { t: "Review tenant communication queue; respond within one business day", n: "Under the Operator Landlord approach, responsiveness is the product." },
            { t: "Confirm signage is lit and pylon faces are intact", n: "Signage is common-area work that directly feeds leasing." },
          ],
        },
        {
          title: "Monthly — the money rhythm",
          items: [
            { t: "Run the rent cycle: statements, reminders, escalate delinquencies per the lease", n: "Courtesy reminder before the first; defined escalation after." },
            { t: "Reconcile the rent roll to the bank; investigate every variance", n: "A rent roll that does not match the bank is fiction." },
            { t: "Review the P&L against budget; annotate significant variances", n: "An unexplained variance grows. A named explanation can be managed." },
            { t: "Issue owner report: income, expenses, occupancy, work, decisions needed", n: "Same format every month — the report is a rhythm, not an event." },
            { t: "Check certificate of insurance expirations — tenants and vendors", n: "Request renewals 30 days before lapse, in writing." },
            { t: "Review aged work orders; nothing open past 30 days without a reason", n: "Every open order needs an owner and a next step." },
          ],
        },
        {
          title: "Quarterly — compliance & vendors",
          items: [
            { t: "Pull and re-file current COIs for every tenant and active vendor", n: "Match against the lease-required coverages, not just presence." },
            { t: "Fire & life-safety inspection: extinguishers, exits, alarms, panels", n: "Document with dated photos; file in the owner safe." },
            { t: "Meet or call each key vendor: roof, HVAC, landscaping, paving, security", n: "Ask what they are seeing that you are not." },
            { t: "Review the critical-dates board: expirations, options, notice windows", n: "Anything inside 12 months gets a named next step." },
            { t: "Walk the roof (or schedule the walk) and inspect fascia, gutters, drains", n: "Roof problems are cheap at quarterly cadence and expensive at annual." },
            { t: "Test site lighting photometrics at night; replace dark poles", n: "Lighting drives both safety perception and evening sales." },
          ],
        },
        {
          title: "Seasonal — the site rhythm",
          items: [
            { t: "Spring: full exterior refresh — landscaping, pressure washing, striping touch-up", n: "Curb appeal is leasing inventory." },
            { t: "Pre-summer (Gulf South by June 1): storm prep — trees trimmed, drains cleared, loose items secured", n: "Document pre-storm condition with dated photos." },
            { t: "Summer: HVAC service verified on every suite; confirm contract coverage", n: "Summer HVAC failure is a tenant-relations event, not a maintenance item." },
            { t: "Fall: parking lot inspection — cracks sealed before freeze or wet season", n: "Water enters cracks; what freezes or floods lifts asphalt." },
            { t: "Winter: holiday operations plan — parking, signage, extended hours lighting", n: "Set it in October, not November." },
          ],
        },
        {
          title: "Annually — the planning rhythm",
          items: [
            { t: "Build the operating budget for next year; set the reserve contribution", n: "Fund the roofs and lots you already know you own." },
            { t: "Complete CAM reconciliation against actuals per the lease deadlines", n: "Deadlines are lease obligations — verify your own language." },
            { t: "Full property condition survey: roof, envelope, paving, site, signage", n: "Feed findings into the capital plan and the reserve study." },
            { t: "Insurance renewal review: values, coverages, claims history, bids", n: "Start 120 days before expiry; never renew on autopilot." },
            { t: "Property tax assessment review; file appeals where warranted", n: "Deadlines are jurisdictional — calendar them at the start of the year." },
            { t: "Update the emergency and continuity plan; confirm contact tree", n: "Include tenants, vendors, insurer, counsel, and utilities." },
          ],
        },
        {
          title: "Per-lease standing records",
          items: [
            { t: "A one-to-two-page abstract for every tenant, verified against the executed lease", n: "Dates, rent schedule, options, exclusives, CAM treatment, notices." },
            { t: "Every executed lease, amendment, and side letter filed and named consistently", n: "Suite_Tenant_DocumentType_Date." },
            { t: "Security deposit and guaranty on record for every suite", n: "Note the gaps; missing deposits surface at the worst times." },
            { t: "Renewal alert set at 12 / 9 / 6 months before every expiration", n: "Late renewal conversations are negotiated from weakness." },
          ],
        },
        {
          title: "Vendors & contracts",
          items: [
            { t: "A vendor table: scope, contract terms, rates, COI expiration, contacts", n: "One table, one home, current to the month." },
            { t: "Every service contract reviewed before auto-renewal", n: "Diarize renewal windows the day the contract is signed." },
            { t: "Warranties on capital work filed in the owner safe with expiration dates", n: "A warranty you cannot find is a warranty you do not have." },
          ],
        },
        {
          title: "Systems & data",
          items: [
            { t: "One source of truth for leases, vendors, work orders, and financials", n: "If it is not in the system, it did not happen." },
            { t: "Backup verified: exports run, restore tested, off-site copy current", n: "A backup that has never been restored is a hope." },
            { t: "Access review: who can reach the records, banking, and accounts — and should they", n: "Quarterly, and after any staffing change." },
            { t: "The checklist itself reviewed and revised", n: "Add what was missed; remove what no longer serves the property." },
          ],
        },
      ],
    },

    "doc-safe": {
      title: "The owner document safe",
      accentCycle: ["oxblood", "terra", "mustard", "olive"],
      storageNote: "Progress saves in this browser as you check items.",
      sections: [
        {
          title: "Entity & ownership",
          items: [
            { t: "Formation documents and operating agreement for every owning entity", n: "Including amendments — the version history matters." },
            { t: "EIN records and registered agent documentation", n: "Required for banking, tax filings, and counsel." },
            { t: "Recorded warranty deeds and the complete chain of title instruments", n: "The paper that proves the asset is yours." },
            { t: "Title insurance policy and closing documents from acquisition", n: "The title policy is the first call when a boundary or servitude question arises." },
            { t: "Corporate resolutions or authorizations naming who may act for the entity", n: "Banks and title companies will ask for these." },
          ],
        },
        {
          title: "Property & land",
          items: [
            { t: "The recorded plat and all recorded revisions", n: "For a legacy center, the plat is the operating map — parking, easements, setbacks." },
            { t: "Surveys: original, ALTA/NSPS, and any as-builts", n: "Marked-up survey copies belong here too." },
            { t: "Zoning records: classification, variances, and conditions of approval", n: "Legacy variances (parking, green area) are assets — keep the paper that proves them." },
            { t: "Environmental reports: Phase I, Phase II, and any remediation records", n: "Lenders and buyers will request these in every transaction." },
            { t: "Easements and servitudes: reciprocal access, utility, signage", n: "Include recorded exhibits and a simple indexed list." },
          ],
        },
        {
          title: "Leases & tenants",
          items: [
            { t: "Every executed lease, amendment, side letter, and exhibit — complete and ordered", n: "Sequence matters: a missing amendment changes what the lease says." },
            { t: "A verified lease abstract for every suite", n: "One to two pages; verified against the executed documents." },
            { t: "Estoppel certificates collected from tenants at acquisition and refinance", n: "Filed by suite, with the date of the certifying statement." },
            { t: "Guaranties and personal undertakings", n: "Note which are active and which have been released." },
            { t: "Insurance obligations per lease: required coverages and minimum limits", n: "So COIs can be checked against something written." },
          ],
        },
        {
          title: "Insurance & risk",
          items: [
            { t: "All property policies, renewals, and endorsements — current and historical", n: "Historical policies matter for claims with long tails." },
            { t: "Claims file: FNOL, adjuster correspondence, settlements, and reserves", n: "Close every claim to a final paper trail." },
            { t: "Tenant and vendor COIs, current year plus recent history", n: "The active expirations also live in the operating system." },
            { t: "Flood and wind documentation where applicable — maps, elevation certificates, policies", n: "In Gulf South markets, this family is first-class, not an afterthought." },
          ],
        },
        {
          title: "Finance & tax",
          items: [
            { t: "Loan documents: note, mortgage, guarantees, and every amendment or modification", n: "Include lender-required reporting commitments." },
            { t: "Appraisals and inspection reports from acquisition and refinance", n: "They benchmark value in future conversations." },
            { t: "Tax assessments, bills, and appeal records by year", n: "Win an appeal once and the record pays for itself annually." },
            { t: "Year-end financial statements and depreciation schedules", n: "Hand your accountant a complete year, not an archaeology project." },
          ],
        },
        {
          title: "Operations & continuity",
          items: [
            { t: "Major service contracts: roof, HVAC, paving, landscaping, security", n: "Diarized with expiration and renewal windows." },
            { t: "Capital work records: contracts, warranties, permits, and completion documents", n: "Warranty + proof of install = enforceable protection." },
            { t: "Utilities: account numbers, meter locations, and service contracts", n: "Someone other than you should be able to transfer service in an emergency." },
            { t: "The one-page access map: where the safe is, how it is organized, who holds keys and passwords", n: "Sealed with counsel or a partner — the safe must survive its owner." },
            { t: "Redundancy verified: three copies, two media, one off-site — tested this year", n: "A copy that has never been opened is a rumor." },
          ],
        },
      ],
    },
  };

  const AI_MAP = {
    helps: {
      label: "AI helps here",
      dot: "#49573C",
      cards: [
        { t: "Lease abstraction", d: "First-pass summaries of executed leases — dates, rent schedules, options, exclusives, CAM treatment. A person verifies every abstract against the source before it enters the file." },
        { t: "Drafting routine notices", d: "Renewal outreach, maintenance notifications, certificate requests, delinquency follow-ups. AI drafts in the operator's voice; a named person edits and sends." },
        { t: "Owner & lender reports", d: "Assembling monthly reports from rent roll and ledger data, formatting variance notes, preparing packages. Judgment about what the numbers mean stays with the operator." },
        { t: "Expense anomaly flags", d: "Surfacing the bill that doubled, the repair category trending up, the invoice off contract terms — early enough to ask why while it is cheap." },
        { t: "Document search & Q&A", d: "\"What does the lease say about signage?\" answered against the property's own documents — a pointer to the governing page, not a legal opinion." },
        { t: "Meeting & inspection notes", d: "Turning walk-through dictation or shorthand into dated, filed notes with owners and follow-ups." },
      ],
    },
    humans: {
      label: "People stay in charge",
      dot: "#8A2F1F",
      cards: [
        { t: "Negotiations & concessions", d: "Every term exchanged with a tenant is a judgment about the asset, the relationship, and the market. No tool sets your opening position." },
        { t: "Anything that commits the ownership", d: "Notices exercising rights, approvals spending money, letters creating obligations — a named person reads, decides, and signs." },
        { t: "Interpretation of rights", d: "An AI summary is a pointer, not an opinion. When the answer matters — exclusivity, caps, options — the documents are read in full, and counsel weighs in when stakes justify it." },
        { t: "Exceptions & emergencies", d: "The tenant in distress, the vendor dispute, the insurance claim. Systems route routine work; every exception goes to a person by design." },
        { t: "What gets sent", d: "The verification rule: AI drafts, flags, and organizes — a named person reviews, decides, and sends. Every time, without exception." },
      ],
    },
  };

  const SHEETS = [
    { id: "D-1", short: "Dashboard", name: "Dashboard", q: "What needs attention right now?", d: "The opening view: a calm greeting, the consequential metrics, and the short list of what is due, late, or decided this week. Everything on D-1 links down to its sheet." },
    { id: "A-1", short: "Site Plan", name: "Site Plan", q: "What does the property look like, exactly?", d: "A plat-proportioned, native-SVG site plan: buildings, suites, parking fields, driveways, easements, and the liquor line. Tapping a suite opens its record — lease, status, notes, photos." },
    { id: "A-2", short: "Spatial", name: "Spatial Workspace", q: "What does the evidence say about this parcel?", d: "The property workspace: plat-based spatial model, suite inspector, evidence and owner-brief flows, and a dated ledger strip — with capture and legacy views (aerial, 3D, drone) layered underneath." },
    { id: "R-1", short: "Rent Roll", name: "Rent Roll", q: "Who occupies what, and on what terms?", d: "The lease population reconciled against executed documents: suites, tenants, terms, statuses, and the gaps that need resolving — with every figure traceable to its source." },
    { id: "P-1", short: "Financial", name: "Financial", q: "How is the property performing?", d: "Income and expense against budget, presented in the operator's rent-presentation rule: total rent plainly, component economics only as an explicit breakdown." },
    { id: "C-1", short: "Compliance", name: "Compliance", q: "Which obligations are current, and which are not?", d: "An event-sourced compliance engine: certificates, inspections, lease requirements, and zoning conditions — each tied to its recorded document and its status history." },
    { id: "T-1", short: "Critical Dates", name: "Critical Dates", q: "What deadlines are coming?", d: "Every dated obligation in one place: expirations, options, notice windows, reconciliations, certificate lapses. When a lease record changes, its dates move themselves." },
    { id: "W-1", short: "Actions", name: "Action Board", q: "Who is doing what, by when?", d: "The operating to-do layer: work items with owners, due dates, and links to the leases, vendors, and documents they came from. Nothing depends on memory." },
    { id: "K-1", short: "Directory", name: "Directory", q: "Who do we call?", d: "Tenants, vendors, contractors, insurers, counsel, and utilities — scoped by role so each party sees its own contacts and nothing more." },
    { id: "M-1", short: "Maintenance", name: "Maintenance", q: "What is broken, scheduled, or overdue?", d: "Work orders end to end: report, assign, track, close out with photos and notes. Tenants see their own unit's items through a unit-scoped portal view." },
    { id: "S-1", short: "Owner Safe", name: "Owner Safe", q: "Where is the property's paper?", d: "The document vault from Article 37, implemented: deeds, leases, insurance, finance, and the access map — dated, organized, and retrievable in minutes." },
    { id: "AI-1", short: "Concierge", name: "AI Concierge", q: "What do the records say?", d: "Bounded AI assistance: answers assembled from the property's own documents — summarize a clause, find the governing file, draft a notice for human review. It prepares and points; it never sends." },
    { id: "V-1", short: "Vendors", name: "Vendor Portal", q: "What are our vendors working on?", d: "A scoped vendor view: assigned work orders, schedules, and close-out requirements — without exposing rent rolls, leases, or anything beyond the vendor's own scope." },
  ];

  const CALENDAR = [
    { m: "Jan", title: "Reconcile & close", focus: "Finance sets the tone", items: [
      "Deliver prior-year CAM reconciliations per lease deadlines",
      "Close December and prior-year books; file statements",
      "Review property tax assessments; calendar appeal deadlines",
      "Set this year's inspection schedule while contractors have capacity",
    ] },
    { m: "Feb", title: "Budgets & insurance", focus: "The money month", items: [
      "Finalize the operating budget; set the reserve contribution",
      "Deliver budget-based CAM estimates where leases require",
      "Mid-cycle insurance review: values, coverages, and open claims",
      "Renewal pipeline review — every lease inside 12 months gets a plan",
    ] },
    { m: "Mar", title: "Exterior wake-up", focus: "Site work begins", items: [
      "Spring landscaping reset: beds, mulch, tree trimming",
      "Walk every roof; clear drains and gutters",
      "Pressure-wash storefront walks and rear service areas",
      "Begin the tenant touchpoint cycle for the year",
    ] },
    { m: "Apr", title: "Curb appeal push", focus: "Leasing inventory", items: [
      "Parking lot inspection: seal cracks before wet season",
      "Signage audit: faces, lighting, pylon — repair before summer",
      "Spring merchandising check with each tenant",
      "Vacancy plan refreshed: suite condition, marketing, broker outreach",
    ] },
    { m: "May", title: "Storm prep (Gulf South)", focus: "Ready by June 1", items: [
      "Tree and canopy trimming complete; deadwood removed",
      "Storm drains, inlets, and culverts cleared and documented",
      "Pre-storm photo documentation of buildings, signage, and site",
      "Emergency contact tree confirmed with tenants and vendors",
    ] },
    { m: "Jun", title: "Systems & HVAC", focus: "Summer reliability", items: [
      "HVAC service verified on every suite; contract coverage confirmed",
      "Mid-year budget review: variances explained, forecast updated",
      "Vendor mid-year meetings: performance, rates, renewals ahead",
      "Document the season's first storm readiness check",
    ] },
    { m: "Jul", title: "Storm season watch", focus: "Response readiness", items: [
      "Post-storm inspection protocol ready: who walks, who documents",
      "Utility and contractor standby arrangements confirmed",
      "Roof and envelope spot-check after significant weather",
      "Keep the work-order log current — summer generates volume",
    ] },
    { m: "Aug", title: "Leasing season", focus: "Fall starts now", items: [
      "Back-to-school leasing push: prospect list, suite readiness",
      "Renewal conversations for Q1 expirations in motion",
      "Holiday operations planning begins: parking, lighting, hours",
      "Exterior work wrapped before the holiday clock starts",
    ] },
    { m: "Sep", title: "Budget season", focus: "Next year's money", items: [
      "Draft next year's operating budget and capital plan",
      "Reserve study refreshed: roofs, lots, and known capital",
      "Vendor contracts reviewed ahead of winter and spring renewals",
      "Insurance renewal preparation begins (120 days out)",
    ] },
    { m: "Oct", title: "Holiday readiness", focus: "The retail clock", items: [
      "Holiday operations plan issued: parking, signage, security, lighting",
      "Extended-hours lighting and access arrangements confirmed",
      "Tenant communication: holiday expectations and center events",
      "December year-end close checklist drafted",
    ] },
    { m: "Nov", title: "Holiday operations", focus: "Execution", items: [
      "Parking field and cart management at holiday cadence",
      "Common-area inspections stepped up to twice weekly",
      "Night lighting walk: the center must read safe and bright at 8 pm",
      "Insurance renewal terms negotiated — never on autopilot",
    ] },
    { m: "Dec", title: "Close & verify", focus: "Win the year-end", items: [
      "Year-end close executed against the October checklist",
      "The full property walk: every suite line, roof section, and aisle",
      "Owner safe annual audit: new documents filed, access map updated",
      "Next year's critical dates board verified against lease language",
    ] },
  ];

  /* ----------------------------------------------------------------------
     Shared helpers
     -------------------------------------------------------------------- */

  const ACCENTS = ["terra", "olive", "mustard", "oxblood"];

  function partAccentClass(article, partsByName) {
    const pname = article.part.split("—").pop().trim();
    const p = partsByName[pname];
    return p ? "accent-" + p.accent : "accent-terra";
  }

  function romanOf(article, partsByName) {
    const pname = article.part.split("—").pop().trim();
    const p = partsByName[pname];
    return p ? p.roman : "";
  }

  /* ----------------------------------------------------------------------
     Theme
     -------------------------------------------------------------------- */

  function initTheme() {
    const param = new URLSearchParams(location.search).get("theme");
    const saved = localStorage.getItem("cc-theme");
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day";
    setTheme(param === "night" || param === "day" ? param : (saved || preferred));
  }

  function setTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("cc-theme", t);
    const btn = document.getElementById("theme-toggle");
    if (btn) btn.setAttribute("aria-label", t === "night" ? "Switch to day mode" : "Switch to night mode");
  }

  function wireThemeToggle() {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme");
      setTheme(cur === "night" ? "day" : "night");
    });
  }

  /* ----------------------------------------------------------------------
     Interactive: checklist
     -------------------------------------------------------------------- */

  function renderChecklist(el, cfg, checklistId) {
    const storageKey = "cc-checklist:" + checklistId;
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(storageKey) || "{}"); } catch (e) { saved = {}; }

    const total = cfg.sections.reduce((n, s) => n + s.items.length, 0);
    const frame = document.createElement("div");
    frame.className = "ix-frame";
    frame.innerHTML = `
      <div class="ix-head">
        <span class="ix-title"><b>Interactive</b> — ${cfg.title}</span>
        <span class="ix-actions">
          <button class="btn btn-secondary btn-small" data-act="copy">Copy summary</button>
          <button class="btn btn-secondary btn-small" data-act="reset">Reset</button>
        </span>
      </div>
      <div class="ix-progress">
        <div class="ix-bar"><span></span></div>
        <div class="ix-progress-meta"><span class="ix-status-label">Not started</span><span class="ix-count"></span></div>
      </div>
      <div class="ix-sections"></div>
      <div class="ix-foot">
        <span class="ix-score"></span>
        <span>${cfg.storageNote || ""}</span>
      </div>`;

    const sectionsEl = frame.querySelector(".ix-sections");

    cfg.sections.forEach((sec, si) => {
      const accent = cfg.accentCycle ? cfg.accentCycle[si % cfg.accentCycle.length] : ACCENTS[si % ACCENTS.length];
      const secEl = document.createElement("div");
      secEl.className = "ix-section" + (si === 0 ? " open" : "");
      secEl.style.setProperty("--sec-accent", `var(--cc-${accent})`);
      const doneCount = sec.items.filter((_, ii) => saved[si + ":" + ii]).length;
      secEl.innerHTML = `
        <div class="ix-section-head" role="button" tabindex="0" aria-expanded="${si === 0}">
          <span class="ix-sec-rail"></span>
          <span class="ix-sec-title">${sec.title}</span>
          <span class="ix-sec-count" data-sec-count>${doneCount}/${sec.items.length}</span>
          <span class="ix-caret"></span>
        </div>
        <div class="ix-section-body"></div>`;

      const body = secEl.querySelector(".ix-section-body");
      sec.items.forEach((item, ii) => {
        const key = si + ":" + ii;
        const row = document.createElement("label");
        row.className = "ix-item" + (saved[key] ? " done" : "");
        row.innerHTML = `
          <input type="checkbox" ${saved[key] ? "checked" : ""} aria-label="${item.t.replace(/"/g, "&quot;")}">
          <span>
            <span class="ix-item-text">${item.t}</span>
            ${item.n ? `<div class="ix-item-note">${item.n}</div>` : ""}
          </span>`;
        const cb = row.querySelector("input");
        cb.addEventListener("change", () => {
          saved[key] = cb.checked;
          row.classList.toggle("done", cb.checked);
          localStorage.setItem(storageKey, JSON.stringify(saved));
          update();
        });
        body.appendChild(row);
      });

      const head = secEl.querySelector(".ix-section-head");
      const toggle = () => {
        secEl.classList.toggle("open");
        head.setAttribute("aria-expanded", secEl.classList.contains("open"));
      };
      head.addEventListener("click", toggle);
      head.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
      });
      sectionsEl.appendChild(secEl);
    });

    const bar = frame.querySelector(".ix-bar > span");
    const countEl = frame.querySelector(".ix-count");
    const statusEl = frame.querySelector(".ix-status-label");
    const scoreEl = frame.querySelector(".ix-score");

    function update() {
      let done = 0;
      cfg.sections.forEach((sec, si) => {
        let secDone = 0;
        sec.items.forEach((_, ii) => { if (saved[si + ":" + ii]) { secDone++; done++; } });
        sectionsEl.children[si].querySelector("[data-sec-count]").textContent = secDone + "/" + sec.items.length;
      });
      const pct = Math.round((done / total) * 100);
      bar.style.width = pct + "%";
      countEl.textContent = done + " of " + total + " complete";
      let label = "Not started";
      if (pct === 100) label = "Complete — audit passed";
      else if (pct >= 75) label = "In progress — strong";
      else if (pct >= 40) label = "In progress";
      else if (pct > 0) label = "In progress — early";
      statusEl.textContent = label;
      scoreEl.innerHTML = `Safe score: <b>${pct}%</b>`;
    }

    frame.querySelector('[data-act="reset"]').addEventListener("click", () => {
      if (!confirm("Reset all checklist progress for this article?")) return;
      saved = {};
      localStorage.removeItem(storageKey);
      frame.querySelectorAll('.ix-item input[type="checkbox"]').forEach((cb) => { cb.checked = false; });
      frame.querySelectorAll(".ix-item").forEach((r) => r.classList.remove("done"));
      update();
    });

    frame.querySelector('[data-act="copy"]').addEventListener("click", () => {
      const lines = [cfg.title + " — " + new Date().toISOString().slice(0, 10)];
      cfg.sections.forEach((sec, si) => {
        lines.push("", sec.title);
        sec.items.forEach((item, ii) => {
          lines.push((saved[si + ":" + ii] ? "[x] " : "[ ] ") + item.t);
        });
      });
      const btn = frame.querySelector('[data-act="copy"]');
      navigator.clipboard.writeText(lines.join("\n")).then(() => {
        btn.textContent = "Copied";
        setTimeout(() => { btn.textContent = "Copy summary"; }, 1600);
      });
    });

    update();
    el.appendChild(frame);
  }

  /* ----------------------------------------------------------------------
     Interactive: AI map
     -------------------------------------------------------------------- */

  function renderAiMap(el) {
    const frame = document.createElement("div");
    frame.className = "ix-frame";
    frame.innerHTML = `
      <div class="ix-head"><span class="ix-title"><b>Interactive</b> — the practical map</span>
        <span class="caption">Select a card to see the working detail</span></div>
      <div class="ai-map-grid"></div>`;
    const grid = frame.querySelector(".ai-map-grid");

    [["helps", AI_MAP.helps], ["humans", AI_MAP.humans]].forEach(([key, col]) => {
      const colEl = document.createElement("div");
      colEl.className = "ai-map-col";
      colEl.innerHTML = `
        <div class="ai-map-col-head">
          <span class="dot" style="background:${col.dot}"></span>
          <h4 class="h4">${col.label}</h4>
        </div>`;
      col.cards.forEach((c) => {
        const card = document.createElement("div");
        card.className = "ai-card";
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.innerHTML = `
          <div class="ai-card-title"><span>${c.t}</span><span class="ai-plus">+</span></div>
          <div class="ai-card-detail">${c.d}</div>`;
        const toggle = () => card.classList.toggle("open");
        card.addEventListener("click", toggle);
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
        });
        colEl.appendChild(card);
      });
      grid.appendChild(colEl);
    });
    el.appendChild(frame);
  }

  /* ----------------------------------------------------------------------
     Interactive: sheet explorer
     -------------------------------------------------------------------- */

  function renderSheetExplorer(el) {
    const frame = document.createElement("div");
    frame.className = "ix-frame";
    frame.innerHTML = `
      <div class="ix-head"><span class="ix-title"><b>Interactive</b> — walk the thirteen sheets</span>
        <span class="caption">A drawing-set index, the way the program is organized</span></div>
      <div class="sheet-strip" role="tablist"></div>
      <div class="sheet-detail"></div>`;
    const strip = frame.querySelector(".sheet-strip");
    const detail = frame.querySelector(".sheet-detail");

    function select(i) {
      strip.querySelectorAll(".sheet-tab").forEach((t, ti) => {
        t.classList.toggle("active", ti === i);
        t.setAttribute("aria-selected", ti === i);
      });
      const s = SHEETS[i];
      detail.innerHTML = `
        <div class="sheet-big">${s.id}</div>
        <div>
          <div class="sheet-name">${s.name}</div>
          <p>${s.d}</p>
          <div class="sheet-question">${s.q}</div>
        </div>`;
    }

    SHEETS.forEach((s, i) => {
      const tab = document.createElement("button");
      tab.className = "sheet-tab";
      tab.setAttribute("role", "tab");
      tab.innerHTML = `<span class="sheet-id">${s.id}</span><span class="sheet-short">${s.short}</span>`;
      tab.addEventListener("click", () => select(i));
      strip.appendChild(tab);
    });
    select(0);
    el.appendChild(frame);
  }

  /* ----------------------------------------------------------------------
     Interactive: calendar explorer
     -------------------------------------------------------------------- */

  function renderCalendar(el) {
    const frame = document.createElement("div");
    frame.className = "ix-frame";
    frame.innerHTML = `
      <div class="ix-head"><span class="ix-title"><b>Interactive</b> — walk the operating year</span>
        <span class="caption">Twelve blocks, three forces: finance, weather, retail</span></div>
      <div class="cal-grid" role="tablist"></div>
      <div class="cal-detail"></div>`;
    const grid = frame.querySelector(".cal-grid");
    const detail = frame.querySelector(".cal-detail");

    const now = new Date().getMonth();

    function select(i) {
      grid.querySelectorAll(".cal-month").forEach((t, ti) => {
        t.classList.toggle("active", ti === i);
        t.setAttribute("aria-selected", ti === i);
      });
      const m = CALENDAR[i];
      detail.innerHTML = `
        <div class="cal-detail-title">${m.m} — ${m.title}</div>
        <div class="cal-detail-focus">${m.focus}</div>
        <ul>${m.items.map((it) => `<li>${it}</li>`).join("")}</ul>`;
    }

    CALENDAR.forEach((m, i) => {
      const tab = document.createElement("button");
      tab.className = "cal-month";
      tab.setAttribute("role", "tab");
      tab.innerHTML = `<span class="cal-mname">${m.m}</span><span class="cal-mtitle">${m.title}</span>`;
      tab.addEventListener("click", () => select(i));
      grid.appendChild(tab);
    });
    select(now);
    el.appendChild(frame);
  }

  /* ----------------------------------------------------------------------
     Hydrate <div class="ix" data-ix="..."> placeholders
     -------------------------------------------------------------------- */

  function hydrateInteractive(root) {
    root.querySelectorAll(".ix[data-ix]").forEach((el) => {
      const type = el.getAttribute("data-ix");
      if (type === "checklist") renderChecklist(el, CHECKLISTS[el.getAttribute("data-id")], el.getAttribute("data-id"));
      else if (type === "ai-map") renderAiMap(el);
      else if (type === "sheet-explorer") renderSheetExplorer(el);
      else if (type === "calendar") renderCalendar(el);
    });
  }

  /* ----------------------------------------------------------------------
     Article page
     -------------------------------------------------------------------- */

  function initArticlePage() {
    const params = new URLSearchParams(location.search);
    const slug = params.get("id") || window.CC_DATA.articles[0].slug;
    const data = window.CC_DATA;
    const idx = data.articles.findIndex((a) => a.slug === slug);
    const article = data.articles[idx >= 0 ? idx : 0];
    const partsByName = {};
    data.parts.forEach((p) => { partsByName[p.name] = p; });
    const accentClass = partAccentClass(article, partsByName);
    const roman = romanOf(article, partsByName);

    document.title = article.title + " — The Shopping Center Operator Series";
    document.body.classList.add(accentClass);

    // head
    const headEl = document.getElementById("article-head");
    headEl.className = accentClass;
    headEl.innerHTML = `
      <div class="wrap">
        <div class="crumb">
          <a href="index.html">The Series</a><span aria-hidden="true">·</span>
          <span>Part ${roman} — ${article.part.split("—").pop().trim()}</span>
        </div>
        <span class="eyebrow">${article.eyebrow}</span>
        <h1>${article.title}</h1>
        <p class="deck">${article.deck}</p>
        <div class="article-meta">
          <span class="meta">By ${"Cypress Command"}</span>
          <span class="meta">${article.date}</span>
          <span class="meta">${article.read_time} read</span>
          <span class="meta">Article ${String(article.num).padStart(2, "0")} of ${data.articles.length}</span>
        </div>
        ${article.feature_image ? `
        <figure class="article-figure">
          <img src="${article.feature_image}" alt="${article.title}">
          <figcaption class="caption">${article.feature_caption || ""}</figcaption>
        </figure>` : ""}
      </div>`;

    // body
    const prose = document.getElementById("prose");
    prose.innerHTML = article.body;

    // hydrate interactive widgets
    hydrateInteractive(prose);

    // TOC rail
    const railList = document.getElementById("rail-list");
    const h2s = Array.from(prose.querySelectorAll("h2"));
    h2s.forEach((h, i) => {
      const id = "sec-" + i;
      h.id = id;
      const a = document.createElement("a");
      a.href = "#" + id;
      a.textContent = h.textContent;
      railList.appendChild(a);
    });

    const railLinks = Array.from(railList.querySelectorAll("a"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          railLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    h2s.forEach((h) => observer.observe(h));

    // reading progress
    const bar = document.getElementById("progress-bar");
    function onScroll() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0) + "%";
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // pager
    const prev = data.articles[idx - 1];
    const next = data.articles[idx + 1];
    document.getElementById("pager").innerHTML = `
      ${prev ? `<a href="article.html?id=${prev.slug}"><span class="pager-label">Previous — ${String(prev.num).padStart(2, "0")}</span><span class="pager-title">${prev.title}</span></a>` : "<span></span>"}
      ${next ? `<a href="article.html?id=${next.slug}"><span class="pager-label">Next — ${String(next.num).padStart(2, "0")}</span><span class="pager-title">${next.title}</span></a>` : "<span></span>"}`;

    // related in same part
    const related = data.articles.filter((a) => a.slug !== article.slug && a.part === article.part).slice(0, 3);
    const relEl = document.getElementById("related-list");
    if (related.length && relEl) {
      relEl.innerHTML = related.map((a) => `
        <a class="article-row ${partAccentClass(a, partsByName)}" href="article.html?id=${a.slug}">
          <span class="row-num">${String(a.num).padStart(2, "0")}</span>
          <span><span class="row-title">${a.title}</span>
          <span class="row-deck">${a.deck}</span></span>
          <span class="row-meta meta">${a.read_time}</span>
        </a>`).join("");
    } else if (relEl) {
      relEl.closest(".index-section")?.classList.add("hidden");
    }
  }

  /* ----------------------------------------------------------------------
   Home page
   -------------------------------------------------------------------- */

  function initHomePage() {
    const data = window.CC_DATA;
    const partsByName = {};
    data.parts.forEach((p) => { partsByName[p.name] = p; });

    // featured interactive tiles (latest 3 interactive)
    const featured = data.articles.filter((a) => a.interactive).slice(-3).reverse();
    const tilesEl = document.getElementById("tiles");
    tilesEl.innerHTML = featured.map((a) => `
      <a class="tile ${partAccentClass(a, partsByName)}" href="article.html?id=${a.slug}">
        ${a.feature_image ? `<img src="${a.feature_image}" alt="" loading="lazy">` : ""}
        <div class="tile-body">
          <div class="tile-top">
            <span class="tile-part">${a.part.split("—").pop().trim()}</span>
            <span class="meta">${a.read_time}</span>
          </div>
          <span class="tile-title">${a.title}</span>
          <span class="tile-deck">${a.deck}</span>
          <div class="tile-foot">
            <span>Article ${String(a.num).padStart(2, "0")}</span>
            <span>Interactive ↗</span>
          </div>
        </div>
      </a>`).join("");

    // index grouped by part (collapsible, with per-part state remembered)
    const collapsed = new Set(JSON.parse(localStorage.getItem("cc-collapsed-parts") || "[]"));
    const indexEl = document.getElementById("index");
    let html = "";
    data.parts.forEach((p) => {
      const arts = data.articles.filter((a) => a.part.split("—").pop().trim() === p.name);
      if (!arts.length) return;
      const isCollapsed = collapsed.has(p.name);
      html += `
        <div class="index-section accent-${p.accent}${isCollapsed ? " collapsed" : ""}" data-part="${p.name}">
          <div class="wrap">
            <div class="section-head" role="button" tabindex="0" aria-expanded="${!isCollapsed}">
              <span class="roman">Part ${p.roman}</span>
              <h2 class="h2">${p.name}</h2>
              <span class="count">${arts.length} article${arts.length > 1 ? "s" : ""}</span>
              <span class="sec-caret"></span>
            </div>
            <div class="part-rows">
            ${arts.map((a) => `
              <a class="article-row" href="article.html?id=${a.slug}">
                <span class="row-num">${String(a.num).padStart(2, "0")}</span>
                <span>
                  <span class="row-title">${a.title}</span>
                  <span class="row-deck">${a.deck}</span>
                </span>
                <span class="row-meta">
                  ${a.interactive ? '<span class="badge-live">Interactive</span>' : ""}
                  <span class="meta">${a.read_time}</span>
                </span>
              </a>`).join("")}
            </div>
          </div>
        </div>`;
    });
    indexEl.innerHTML = html;

    // wire section collapse
    function persistCollapsed() {
      const set = new Set();
      document.querySelectorAll("#index .index-section.collapsed").forEach((s) => set.add(s.dataset.part));
      localStorage.setItem("cc-collapsed-parts", JSON.stringify(Array.from(set)));
    }
    document.querySelectorAll("#index .section-head").forEach((head) => {
      const section = head.closest(".index-section");
      const toggle = () => {
        section.classList.toggle("collapsed");
        head.setAttribute("aria-expanded", !section.classList.contains("collapsed"));
        persistCollapsed();
      };
      head.addEventListener("click", toggle);
      head.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
      });
    });

    // jump chips
    const chipsEl = document.getElementById("jump-chips");
    if (chipsEl) {
      chipsEl.innerHTML = data.parts.map((p) => {
        const n = data.articles.filter((a) => a.part.split("—").pop().trim() === p.name).length;
        if (!n) return "";
        return `<button class="jump-chip accent-${p.accent}" data-jump="${p.name}">
          <span class="chip-roman">${p.roman}</span><span>${p.name}</span><span class="chip-count">${n}</span>
        </button>`;
      }).join("");
      chipsEl.addEventListener("click", (e) => {
        const chip = e.target.closest("[data-jump]");
        if (!chip) return;
        const sec = document.querySelector(`.index-section[data-part="${CSS.escape(chip.dataset.jump)}"]`);
        if (sec) {
          sec.classList.remove("collapsed");
          sec.querySelector(".section-head").setAttribute("aria-expanded", "true");
          persistCollapsed();
          sec.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }

    // search
    const input = document.getElementById("search");
    const noRes = document.getElementById("no-results");
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      let visible = 0;
      document.querySelectorAll("#index .index-section").forEach((sec) => {
        sec.classList.toggle("filtering", !!q);
      });
      document.querySelectorAll("#index .article-row").forEach((row) => {
        const hit = !q || row.textContent.toLowerCase().includes(q);
        row.classList.toggle("hidden", !hit);
        if (hit) visible++;
      });
      document.querySelectorAll("#index .index-section").forEach((sec) => {
        const any = Array.from(sec.querySelectorAll(".article-row")).some((r) => !r.classList.contains("hidden"));
        sec.classList.toggle("hidden", !any);
      });
      noRes.style.display = visible ? "none" : "block";
    });

    // stat counts
    const words = data.articles.reduce((n, a) => n + a.body.replace(/<[^>]+>/g, " ").split(/\s+/).length, 0);
    setText("stat-articles", data.articles.length);
    setText("stat-parts", data.parts.filter((p) => data.articles.some((a) => a.part.split("—").pop().trim() === p.name)).length);
    setText("stat-words", Math.round(words / 1000) + "k");
  }

  function setText(id, v) {
    const el = document.getElementById(id);
    if (el) el.textContent = v;
  }

  /* ----------------------------------------------------------------------
   Map page — visual hierarchy of the series
   -------------------------------------------------------------------- */

  function initMapPage() {
    const data = window.CC_DATA;
    const partsWithArticles = data.parts
      .map((p) => ({ part: p, articles: data.articles.filter((a) => a.part.split("—").pop().trim() === p.name) }))
      .filter((x) => x.articles.length);

    // hero
    document.getElementById("map-hero").innerHTML = `
      <div class="wrap">
        <span class="eyebrow">The Map of the Series</span>
        <h1 class="h1">Every article, in its place.</h1>
        <p class="deck">
          The series is organized as an operating system for the asset itself: a lifecycle the
          property moves through, and an operating layer — field notes, AI systems, and checklists —
          that feeds every stage. This map is the index of that structure.
        </p>
        <div class="map-legend">
          <span><span class="lg-dot" style="background:var(--cc-terra)"></span> Owning through Selling — the asset lifecycle</span>
          <span><span class="lg-dot" style="background:var(--cc-olive)"></span> The operating layer — systems, notes, tools</span>
          <span><span class="lg-dot" style="background:var(--cc-rule)"></span> Article tree — number, title, reading time</span>
        </div>
      </div>`;

    // jump chips
    const chipsEl = document.getElementById("jump-chips");
    chipsEl.innerHTML = partsWithArticles.map(({ part: p, articles }) => `
      <button class="jump-chip accent-${p.accent}" data-jump="map-${p.num}">
        <span class="chip-roman">${p.roman}</span><span>${p.name}</span><span class="chip-count">${articles.length}</span>
      </button>`).join("");
    chipsEl.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-jump]");
      if (!chip) return;
      const sec = document.getElementById(chip.dataset.jump);
      if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    // flow diagram: lifecycle band + operating layer band
    const lifeParts = partsWithArticles.filter((x) => x.part.num <= 8);
    const opParts = partsWithArticles.filter((x) => x.part.num > 8);
    const stage = (x) => `
      <a class="flow-stage accent-${x.part.accent}" href="#map-${x.part.num}">
        <span class="flow-roman">${x.part.roman}</span>
        <span class="flow-name">${x.part.name}</span>
        <span class="flow-count">${x.articles.length} article${x.articles.length > 1 ? "s" : ""}</span>
      </a>`;
    document.getElementById("map-flow").innerHTML = `
      <div class="wrap">
        <div class="flow-band-label"><span class="band-num">A</span><span class="eyebrow">The asset lifecycle — the work a property moves through</span><span class="band-rule"></span></div>
        <div class="flow-scroll"><div class="flow-diagram">
          <div class="flow-stages">${lifeParts.map(stage).join("")}</div>
        </div></div>
        <div class="flow-band-label"><span class="band-num">B</span><span class="eyebrow">The operating layer — what keeps every stage visible</span><span class="band-rule"></span></div>
        <div class="flow-scroll"><div class="flow-diagram" style="min-width:480px">
          <div class="flow-stages">${opParts.map(stage).join("")}</div>
        </div></div>
        <div class="flow-return">
          <span class="return-arrow">&#8634;</span>
          <b>Continuous improvement</b>
          <span>Field notes, operating systems, and checklists feed the next decision at every stage — the layer exists so the lifecycle runs on evidence, not memory.</span>
        </div>
      </div>`;

    // part blocks with tree nesting
    document.getElementById("map-parts").innerHTML = `
      <div class="wrap" style="padding-bottom: var(--s16);">
        ${partsWithArticles.map(({ part: p, articles }) => `
          <section class="map-part accent-${p.accent}" id="map-${p.num}">
            <div class="map-part-head">
              <span class="roman">Part ${p.roman}</span>
              <h3 class="h3">${p.name}</h3>
              <span class="count">${articles.length} article${articles.length > 1 ? "s" : ""}</span>
            </div>
            <div class="map-part-body">
              ${articles.map((a) => `
                <a class="map-article" href="article.html?id=${a.slug}">
                  <span class="row-num">${String(a.num).padStart(2, "0")}</span>
                  <span>
                    <span class="map-article-title">${a.title}</span>
                    <span class="map-article-deck">${a.deck}</span>
                  </span>
                  <span class="map-article-meta">
                    ${a.interactive ? '<span class="badge-live">Interactive</span>' : ""}
                    <span class="meta">${a.read_time}</span>
                  </span>
                </a>`).join("")}
            </div>
          </section>`).join("")}
      </div>`;
  }

  /* ----------------------------------------------------------------------
     Boot
     -------------------------------------------------------------------- */

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    wireThemeToggle();
    if (document.body.dataset.page === "home") initHomePage();
    if (document.body.dataset.page === "article") initArticlePage();
    if (document.body.dataset.page === "map") initMapPage();
  });
})();
