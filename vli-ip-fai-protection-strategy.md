# Velocity Lab Innovation: IP Protection and FAI-Recognition Strategy

**Prepared by:** Manus AI  
**Purpose:** A practical strategy for reducing direct copying while pursuing credibility in FAI drone sport.  
**Important:** This is an informed working analysis, not formal legal advice. A Hong Kong-qualified IP lawyer and, if filing internationally, patent counsel in the intended markets should review the invention, disclosure history, filing plan, commercial agreements, and FAI-facing language before VLI relies on them.

## Bottom line

**Yes—VLI should screen the referee system for one or two narrow, high-value patent applications. It should not try to “patent the whole referee system.”** The durable answer is a **layered moat**: a narrowly drafted technical patent where VLI truly has a novel solution; confidential calibration, rule, and deployment know-how; server-side software and data; copyright and trade marks; contract control; customer integration; and a well-structured FAI/CIAM standards strategy.

The main asset is not “motion capture for refereeing.” Motion capture, Unity, replay, and sport rules all exist separately. VLI’s protectable value is the **specific technical way** it converts a calibrated competition space, drone identity, match state, sensor evidence, and human referee control into an auditable decision under real-time constraints. The public site currently describes this at a high level; that is good for marketing, but VLI must capture the detailed method internally before publishing more.

Hong Kong’s IP Department notes that patents are territorial, that software is generally protected by copyright but a computer-related invention may be patentable when it solves a technical problem with a further technical effect, and that disclosure before filing can destroy novelty.[1] Therefore, do not publish the system’s detailed calibration method, thresholds, sensor-fusion logic, fallback logic, or source-code architecture until counsel has made the file-or-keep-secret decision.

## Should VLI patent it?

The answer is **“patent selected technical inventions, if the evidence supports them; keep the rest secret.”** A patent is useful if a competitor could inspect or reverse-engineer the relevant mechanism from the deployed system and VLI can describe a genuinely new technical method. A patent is a poor choice for rules, product aspirations, a generic AI claim, or operational know-how that can remain hidden.

| Candidate | Patent? | Reasoning and immediate test |
|---|---|---|
| A calibrated multi-camera method that identifies a drone ball and determines a legally relevant spatial event robustly despite occlusion, collision, or ambiguous trajectories | **Potentially yes** | This is the strongest candidate if VLI can prove a technical improvement over ordinary motion-capture configuration and describe the method precisely. Build a benchmark against manual/video review and basic tracking. |
| A synchronised, latency-aware evidence pipeline that merges tracking, match state, event logic, replay, health checks, and human override | **Potentially yes** | It may solve a real-time systems problem. Counsel should test whether the technical implementation is novel rather than a routine aggregation of known components. |
| A portable arena calibration and automatic re-calibration architecture that achieves a defined technical result | **Potentially yes** | Worth screening if it reduces installation time, drift, or failure rate through a new technical approach. |
| The sports rule itself—such as what constitutes a goal, boundary breach, or return-to-side violation | **No, not as such** | Rules of play are not a sensible patent moat. Keep novel operational interpretation and edge-case tuning confidential where possible. |
| “AI referee,” dashboard layout, or an idea of showing replay to referees | **Usually no as a patent thesis** | Avoid an abstract or presentation-only claim. Copyright, design, trade secret, and brand are more appropriate unless the interface creates a demonstrable technical effect. |
| Source code, Unity scenes, manuals, clips, graphics, and website material | **No patent needed** | Secure copyright ownership, private repositories, asset licences, and access control. |
| Classification thresholds, confidence weights, calibration recipes, labelled data, deployment playbooks, pricing, and pilot learnings | **Usually keep secret** | Their value is in secrecy and continual improvement. A patent would reveal them and expire; a secret can remain valuable if VLI controls access. |

### The filing rule

**File before external disclosure.** A public demo, public Git repository, full technical HKSTP application, conference slide, vendor conversation without a confidentiality agreement, or detailed FAI proposal may be a disclosure. The current marketing language is broad, but a patent lawyer must audit it alongside the video and all previous demos. Preserve a dated disclosure log now.

VLI also needs two different searches. A **patentability search** asks whether VLI can obtain a patent; a **freedom-to-operate (FTO) search** asks whether VLI could be sued or blocked when it commercialises. Do not confuse an approved patent application with clearance to sell. Because patent rights are territorial, a Hong Kong-only filing does not protect international FAI, manufacturing, or event markets by itself.[1]

## The layered anti-copying strategy

Copying risk should be divided into what a competitor can see, what it can learn through use, and what it can obtain through a relationship. The strongest approach makes each route expensive and incomplete.

| Protection layer | What VLI protects | Action to take | Why it discourages copying |
|---|---|---|---|
| **Patent** | A small number of novel sensor-fusion, event-detection, calibration, or real-time evidence methods | Commission a patentability/FTO review; file only the strongest inventions before detailed publicity; preserve foreign filing options based on actual target markets. | Gives a right to stop the same technical implementation in the jurisdictions where rights are obtained. |
| **Trade secret** | Calibration recipes, scoring thresholds, confidence logic, diagnostic rules, labelled data, deployment process, and cost information | Keep the decision engine and configuration on controlled infrastructure; use private repositories, least-privilege access, encryption, audit logs, and confidential-versioned manuals. | A copycat cannot lawfully obtain the know-how from an employee, contractor, customer, or partner who owes duties of confidence. |
| **Hosted product and update channel** | Core event logic, model updates, licensing keys, diagnostics, data records, and audit logs | Make VLI deliver a licensed service, not a complete copy of the engine. Use signed updates, per-venue/event entitlement, encrypted configuration, remote health telemetry where appropriate, and offline fallback limited to essential referee functions. | A hardware buyer can copy cameras more easily than a continuously evolving, controlled decision service. |
| **Copyright and design** | Code, Unity assets, manuals, video, user interface, replay visualisations, CAD, enclosure/case design | Ensure company ownership from every contributor; retain design and commit history; manage open-source licences; consider registered design protection for commercially distinctive physical appearance. | Allows enforcement against copied expression and deters direct cloning of materials and presentation. |
| **Trade marks and certification brand** | Velocity Lab Innovation, VLI, product name, logo, training and operator credential | Clear and register the marks; secure relevant domains; create a VLI-branded installer/operator certification and annual recertification programme. | Competitors may imitate functionality, but cannot safely pass themselves off as VLI, VLI-certified, or trained VLI operators. |
| **Contracts** | Customer access, pilot feedback, confidential information, data rights, partner endorsement, and developed improvements | Use NDA + pilot agreement before detailed disclosure; enterprise licence/terms of use for each event; employee/contractor invention-assignment and confidentiality agreements. | Creates a clear contractual claim where copying arises from access rather than independent invention. |
| **Data and workflow moat** | Annotated match data, referee decisions, failure cases, tournament implementation history, and performance benchmarks | Contract for rights to collect and use data for service improvement; retain provenance and consent; build internal benchmark sets and a referee-learning loop. | More events produce more rare edge cases, which make VLI harder to match even where hardware is available. |
| **Customer integration** | Venue maps, rule profiles, system configuration, trained officials, and post-event reporting | Sell a trusted event-operation workflow—installation, calibration, operator training, audit report, and support—not a sensor kit. | Switching requires retraining officials, rebuilding configurations, and giving up a trusted audit trail. |

## Contracts that should exist before the next detailed pilot

VLI should have an IP lawyer prepare short, practical templates rather than negotiate from scratch at every event. The customer agreement should identify the product as a **licence/service**, not an outright transfer of IP; restrict unauthorised copying, sharing, reverse engineering and access to the source code to the lawful extent; define the event/venue scope; state who owns raw event data and who may use de-identified/aggregated data to improve the service; and protect confidential technical and commercial information.

The pilot agreement should separately state that the referee retains final authority, that VLI has the right to collect performance data, that pilot feedback and VLI-developed improvements are handled clearly, and that neither side may make public “official,” “FAI-approved,” or endorsement claims without written consent. Every founder, employee, freelancer, adviser, university collaborator, and software contractor must sign confidentiality and present/future IP assignment terms that vest work in the company. This is especially important for source code, CAD, datasets, and invention rights created before incorporation or alongside university work.

| Agreement | Essential clauses to obtain legal review on |
|---|---|
| Founder, employee, adviser, and contractor agreement | Company ownership of all present and future inventions/code/designs; confidentiality; disclosure of pre-existing IP; open-source approval; return/deletion of materials; lawful post-engagement restrictions. |
| Pilot agreement with club, organiser, or association | Confidentiality; VLI’s right to use anonymised data and feedback; venue access; safety and human-referee authority; outcome metrics; public-announcement approval; liability/insurance allocation. |
| Customer subscription/event licence | Licence not sale; per-event/per-venue scope; no unauthorised copying/reverse engineering to the permitted legal limit; protection of configuration and documentation; fees; support; data rights; audit trail; termination and return/deletion. |
| Hardware and supplier agreement | Supplier IP versus VLI IP; component software licences; resale restrictions; price confidentiality; warranty; ability to use alternatives; ownership of any custom fixtures or integration. |
| FAI/NAC/standards collaboration agreement | Exact purpose; VLI’s pre-existing IP; ownership of feedback and jointly developed materials; confidentiality; permitted use of name/logo; product-neutrality expectation; publication and proposal review process. |

## How to pursue FAI recognition without giving away the moat

The strategic goal should not be “make VLI the only official system forever.” A global federation will usually care about safety, fairness, transparency, availability, and rules that can be used by more than one organiser. An overt vendor lock-in request is likely to be commercially and governance-wise unattractive.

The better goal is to make VLI the **reference implementation and first credible conformance provider** for a vendor-neutral technical requirement. VLI can retain its proprietary method while helping FAI define what an acceptable decision-support system must achieve. Standards should define **outcomes and safeguards**, not expose VLI’s secret implementation.

FAI’s current F9A Drone Soccer rules already make this opening practical: they allow a detection sensor on a goal ring if it does not interfere with the drone ball, while the scoring referee remains responsible for deciding whether a goal is recognised.[2] That means VLI should position the first product as **human-in-the-loop referee evidence** and not an autonomous replacement for officials.

CIAM is the relevant FAI commission for Aeromodelling and F9 Drone Sports. It establishes competition rules and technical standards; national delegates participate in its work and voting at annual plenary meetings. The published CIAM proposal process is for formal Sporting Code proposals.[3][4] For Hong Kong, the Aero Club of Hong Kong states that it is the FAI Active Member/National Air Sport Control organisation and appoints the Hong Kong delegates to FAI commissions, including Aeromodelling.[5]

### Recommended FAI/CIAM route

| Step | Recommended action | Desired output |
|---|---|---|
| **1. Align locally first** | Meet the Aero Club of Hong Kong as the Hong Kong NAC and engage the relevant CIAM/Aeromodelling delegate. Present an evidence pack, not a sales deck. | Agreement on whether the project fits F9A/F9 technical work and who can sponsor the relevant discussion. |
| **2. Run a governed local pilot** | Use a defined F9A-relevant scenario; retain referee authority; collect objective evidence on accuracy, decision latency, failure modes, calibration, safety, and referee usability. | A credible pilot report with known limitations, not just a demo video. |
| **3. Propose a vendor-neutral technical annex or trial protocol** | Draft requirements such as event-detection accuracy, maximum decision latency, source-evidence retention, calibration verification, health checks, referee override, manual fallback, data security, and test method. | An F9A technical discussion paper that explains **what** a system must do without revealing **how** VLI does it. |
| **4. Submit through the NAC/CIAM process** | Work with the Hong Kong delegate on the correct proposal timing, form, sponsorship, and subcommittee route. CIAM has a formal proposal process and annual governance cycle.[3][4] | A legitimate standards proposal, working-group study, or official trial rather than an informal request for endorsement. |
| **5. Build a conformance path** | Offer VLI as the first implementation tested against published requirements, with installation, operator training, annual calibration checks, audit logs, and post-event support. | “VLI system conforms to [published requirements]” only when demonstrably true and properly authorised. |
| **6. Commercialise carefully** | Sell deployment and support; retain the proprietary engine; consider licensing only a narrow interface or conformance-testing process if FAI asks for openness. | Revenue and market position without assigning VLI’s core IP to a governing body. |

### What to say—and not say—about FAI

Until a written agreement exists, use wording such as: **“Designed for research and pilot validation in FAI F9A Drone Soccer contexts”** or **“Developed to support auditable, human-in-the-loop officiating.”** Do **not** say “FAI official,” “FAI approved,” “FAI certified,” “the official FAI system,” or use FAI/CIAM marks, logos, or names in a promotional way without express written permission.

If VLI’s patent becomes essential to a future FAI technical standard, deal with licensing before proposing language that makes it mandatory. Some standards processes may require disclosure or a commitment on licensing terms. Keep the public technical standard outcome-based, and reserve VLI’s secret performance method wherever feasible. A patent lawyer and the relevant FAI/NAC contact should review the proposed standard text and all licence statements before submission.

## The 90-day protection plan

| Timing | Decision and deliverable | Owner |
|---|---|---|
| **Days 1–7** | Appoint one founder as IP owner. Create an invention/disclosure log, public-disclosure audit, asset register, contributor list, repository/access map, and list of all third-party components. Pause any detailed external technical disclosure until counsel reviews the filing path. | Co-founders |
| **Days 8–21** | Execute missing founder/contractor/adviser IP-assignment and confidentiality documents. Set up private repositories, permissions, backups, an approved open-source list, and a confidential data workspace. Start trade-mark clearance for VLI/product/certification names. | Co-founders + lawyer |
| **Days 15–35** | Hold a patent-invention workshop. Produce invention disclosures for the best two candidates: technical problem, prior alternatives, diagrams, test data, alternative embodiments, creators, and disclosure history. Commission patentability and FTO screening. | Technical founder + patent counsel |
| **Days 30–45** | Decide: file, keep secret, or publish defensively. If filing, file before any detailed FAI, investor, grant, or pilot disclosure. Select jurisdictions based on actual manufacturing, sales, and enforcement plan—not only company location. | Directors + patent counsel |
| **Days 30–60** | Finalise pilot, customer, data, and supplier agreements. Define a product “licence/service” model, data rights, pilot evidence metrics, event-day security, and public-announcement approval. | Commercial founder + lawyer |
| **Days 45–75** | Approach the Aero Club of Hong Kong/NAC and relevant technical stakeholders with a one-page non-confidential brief and a pilot protocol. Request standards-process guidance, not an immediate exclusive endorsement. | Founder responsible for FAI relations |
| **Days 60–90** | Run the controlled pilot. Create an F9A-compatible technical report with baseline comparison, human-official agreement rate, latency, failure modes, intervention rate, safety outcomes, and configuration controls. Draft an outcome-based technical annex. | Technical and operations leads |

## Recommended decision now

1. **Do a patent-counsel invention workshop immediately.** VLI likely has patent candidates only if it can articulate a specific, technically novel calibration/event-identification/real-time evidence method. Do not file a broad “AI motion-capture referee” application merely for optics.
2. **Keep the real operational advantage secret.** The most valuable material is likely the rule-engine tuning, edge-case handling, calibration and deployment playbook, and labelled referee dataset. Treat those as crown-jewel confidential information.
3. **Build an event-service business, not a hardware resale business.** Hosting the decision engine, licensing each venue/event, training operators, and retaining data-derived learning make copying materially harder.
4. **Seek FAI influence through standards, not a premature exclusivity claim.** Work via the Hong Kong NAC and CIAM F9 pathway; propose a testable, vendor-neutral decision-support standard; aim to become the reference implementation and first conformance provider.
5. **Make the next pilot legally and technically clean.** Secure data rights, pilot confidentiality, human-referee authority, logo/publicity permissions, supplier rights, and documented metrics. This will improve both IP protection and FAI credibility.

## References

[1]: https://www.ipd.gov.hk/en/patents/faqs/general/index.html "Hong Kong Intellectual Property Department — Patent FAQs"
[2]: https://www.fai.org/page/sporting-rules-0 "FAI Drone Sports — Sporting Rules"
[3]: https://www.fai.org/page/ciam-about-us "FAI CIAM — About Us"
[4]: https://www.fai.org/page/ciam-proposals "FAI CIAM — Proposals"
[5]: https://achkc.org/?page_id=9838 "Aero Club of Hong Kong — FAI Activities"
