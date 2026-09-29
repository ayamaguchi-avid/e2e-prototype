# End-to-End Prototype — Connected Bill Retrieval, Priority Payments & Invoice/Pay

Clickable static prototype (plain HTML/CSS/JS, no build step) recreated from the Figma file
**"End to End Prototype"** (`fileKey Ei3vesaWdzL7bKm5sc03Jo`), following the **Lydia** design
system already linked to that file.

**Live:** https://ayamaguchi-avid.github.io/e2e-prototype/
**Source:** https://github.com/ayamaguchi-avid/e2e-prototype

17 HTML files covering two connected flows:

1. **Connected Bill Retrieval (CBR)** — Home + the "Connect provider" wizard (search for a
   provider → authentication method → forward/verify an email → PSE&G login → master vendor
   selection → enroll accounts), looping back to the now-connected Home.
2. **Priority Payments enrollment → invoice approval → AvidPay** — a 5-stage "Set Up Payments"
   wizard entered from Home's Priority Payments tab, which now flows straight into approving that
   provider's time-sensitive invoices (in a separate product area, AvidInvoice/AvidPay, with its
   own header and icon-only sidenav) and on into viewing the resulting payment in AvidPay. These
   used to be two disconnected flows; the Figma file now numbers them as one continuous sequence
   (frames 9 through 24).

## Running it locally

Any simple static server works (it can't be opened directly as `file://` because the relative
scripts/CSS won't load without a server). Example:

```bash
cd e2e-prototype
python3 -m http.server 8080
```

Then open `http://localhost:8080/` (this loads `index.html`, the CBR Home screen).

## Structure

```
e2e-prototype/
  index.html              # entry point = home-empty.html
  css/shared.css          # design tokens + all reusable components (buttons, tables,
                           #   step-tracker, tooltips, toggles, modals, side sheets, .stage
                           #   panels for in-page state)
  js/chrome.js             # injects the Add-on Management Global Header + Side nav
  js/chrome-invoice.js     # injects the separate AvidInvoice/AvidPay header + icon sidenav
                           #   (used only by invoice-home / invoice-detail / pay-home)
  js/app.js                # small shared interactions (radio/card selection)
  assets/icons/            # shared Add-on Management header/sidenav icons
  assets/wizard/           # icons/images specific to the CBR wizard screens
  assets/invoice-pay/      # images specific to the Invoice & Pay flow
  screens/*.html           # the 17 screens (one file per screen/flow-stage)
  nav-map.json             # full screen inventory + navigation per flow
```

## How the navigation was reconstructed

The Figma file has no formal prototype links between frames. Screen order and branching were
originally inferred from the canvas's spatial layout, then refined round over round from
explicit written instructions from the designer — most recently a full renumbering of the Figma
frames themselves ("1", "2", "4.1", "15.1.1", etc.), which this prototype's file/stage naming now
mirrors directly. Full detail, including exact Figma node IDs per screen, is in `nav-map.json`.

### The "stage consolidation" pattern

Several places in this prototype fold what were originally many separate Figma frames into
**one HTML file** that shows one internal state at a time and switches between them with a small
inline `<script>` — a toggle flips, a dropdown opens, a checkbox enables a button — rather than
navigating to a new URL for every minor variation. Used in: `wizard-forward-email.html`,
`wizard-login-credentials.html`, `wizard-enroll-accounts.html`, `pp-confirm-address.html`,
`pp-payment-rules.html`, `invoice-detail.html`.

Only a real "Next" at the *end* of a stage sequence, "Back" (to the previous screen in the
flow), and "Cancel" (straight to `home-connected.html`) are true page navigations inside these
consolidated files.

## Scope, decisions & things worth a second look

### Home screen — Manage menu vs. the tab strip

Per the designer's instruction, the "Manage" side-card's non-active items (Validated
credentials, Credentials pending, a Priority-Payments shortcut, Errors, Notifications, Requested
Providers) are now decorative — hover-highlighted but not clickable — on both `home-empty.html`
and `home-connected.html`. **This is a different element from the top tab strip** ("Connected
bill retrieval" / "Priority Payments"), which stays fully functional — it's the only way into
the Priority Payments flow, so it was deliberately left alone even though the wording overlaps.

### This round's CBR rebuild

The designer reorganized the Figma file and renamed frames with clean sequential numbers, which
also **deleted a lot of the previous round's screens outright** — the old lettered "routes"
(A/B/C/D/E), the extra Enroll Accounts screens, the external-site mock, and Master Vendor's
second screen no longer exist in Figma at all. This prototype's `wizard-route-*.html`,
`wizard-step-177d-external.html`, `wizard-master-vendor-103.html`, and the old
`wizard-enroll-accounts-*.html` files were deleted to match, and replaced with:

- **`wizard-search-provider.html`**: now has real interactivity — the results table is hidden
  until "Search" is clicked, and "Next" stays disabled until a row is both visible and selected.
- **`wizard-step-168.html`**: choosing "MFA not enabled" now skips straight to
  `wizard-login-credentials.html`, bypassing the email-forwarding step entirely.
- **`wizard-forward-email.html`** (new, consolidates 6 old frames): the "Forward emails to"
  dropdown lists real addresses plus "+ Add new email". Picking an existing address advances
  in-page; picking "Add new email" runs through 4 more in-page stages (enter email → verify code
  → success toast → confirm) before continuing to the same target.
- **`wizard-login-credentials.html`** (new, consolidates 4 old frames — effectively the old
  `wizard-route-e.html` content, retargeted): empty login form → filled → submitting → pending.
- **`wizard-master-vendor-102.html`**: now multi-select (checking one vendor no longer unchecks
  the others).
- **`wizard-enroll-accounts.html`** (new, replaces 5 old files): an accounts list whose "Link"
  buttons open an in-page modal (single-select vendor account + a Billing cycle select with
  exactly Monthly/Weekly/Yearly); confirming it closes the modal and enables the page's own
  "Enroll" button.
- **`wizard-confirmation.html`** (new): the final "Enroll account(s)" confirmation, closing the
  loop back to `home-connected.html`.

**Judgment calls from this rebuild, worth a second look:**
- On `wizard-forward-email.html`, the "Add new email" sub-flow's first stage (Figma frame
  "4.0.1") didn't clearly show a typed-email UI in the static design, so it was implemented as an
  editable email input; the later "success" stage was wired to echo back whatever the user
  actually typed rather than Figma's hardcoded example address, since that reads better in a
  click-through prototype. The "Sign in to PSE&G" link inside this flow is now inert (`href="#"`)
  since the external-site mock it used to open was deleted with no replacement provided.
- "Select another method" (not one of the numbered frames) was wired back to
  `wizard-step-168.html`, the only screen that actually serves that purpose.
- The source Figma file itself is inconsistent about the step-tracker's stage-2 label (some
  frames say "Connect to bill provider", others say "Submit credential") — each screen keeps
  whatever its own fetched design said, rather than forcing one wording across all of them.
- `pp-confirm-address.html`'s validating→validated transition now waits a real **7 seconds**
  (previously a ~1.2s UX shortcut) per the designer's explicit "Frame 12 on for 7 seconds" spec.
- `pp-select-funding.html`'s two funding cards are now single-select (matching the master-vendor
  and enroll-accounts patterns elsewhere), while "View account info" independently opens its side
  sheet without disturbing the selection.
- A handful of Lydia token mismatches were found and fixed in the 3 PP screens touched this round
  (a 20px heading that should have been 24px/28px line-height per Figma). A few *other* token
  differences (a slightly different subtext color, a different "active" green, a different card
  border-radius) were deliberately **not** changed, because they reflect an established
  convention used consistently across the *entire* prototype (including screens outside this
  round's scope) — changing just a few files would have made them inconsistent with everything
  else rather than more correct. Worth a dedicated cross-file design-token pass if exact Lydia
  fidelity matters more than internal consistency.

### Second round on 2026-09-28: Lydia input-field fix + Frames 16-24 (invoice approval)

**A real, sitewide bug found and fixed**: `shared.css`'s input styling used the wrong border
color (`#C4C8CB`, a generic border token) instead of Lydia's actual `Input field` component
border (`#71828E`) — verified directly against Figma's Lydia Components library. Worse, several
search boxes across the app (e.g. Home's "Search bill provider") weren't matched by the old CSS
selector at all and were silently rendering as unstyled browser-default inputs. Fixed by making
the rule global (`input[type=...], select, textarea`, not just inside `.field`) with the correct
border/padding — this corrects every input on all 17 screens in one change. **There is no way to
"link" Lydia's real components into this static site**: Lydia's actual code lives in
AvidXchange's private Azure DevOps repo, not a public package registry, so matching its Figma
tokens by hand (as this prototype does throughout) is the only option for a no-build static site.

**Frame 11** (`pp-confirm-address.html`): clicking the first row's checkbox in the "Apply to all
Vendor Accounts" table now checks every other row too, per explicit instruction.

**Frames 16-24**: the designer connected what used to be two separate, disconnected flows (PP
enrollment, and a 3-screen Invoice & Pay demo) into one continuous sequence. No new files —
existing screens got new content/behavior:

- `pp-review-enroll.html` (Frame 16 — confirmed identical to the old Frame 17 by diffing both
  fresh from Figma, so this is an in-place update, not a new file): "Edit Enrollment" now opens a
  real in-page side sheet (remittance/physical address, funding account, auto-initiation,
  approval workflow, payment memo — with an in-sheet "Edit" toggle for the address fields), and
  each row's "Add Memo" link opens a second side sheet that writes back into that row's memo cell
  (or every row's, via "apply to all").
- `home-connected.html`'s Priority Payments tab (Frame 18): the provider this prototype's own
  wizard actually enrolls (Comcast) now shows an **APPROVAL NEEDED** pill instead of "Set Up",
  linking into the invoice flow. Note: Figma's own sample data shows this state on PSE&G, not
  Comcast — deliberately changed to match which provider this app's narrative actually enrolls,
  not copied from the literal sample row.
- `invoice-home.html`'s "Time Sensitive" tab (Frames 19/20/21.2/22.2) went from empty to real
  content: summary cards + an **8-row** table (Figma's actual row count, not a round number) with
  per-row "Approve Invoice" / "View Invoice" / "View Payment" actions. Reached via a new
  `#time-sensitive` URL hash — introduced this round since no such deep-link convention existed
  before. Approved rows persist via `localStorage` (`tsRow1Approved`/`tsRow3Approved`, the only
  place in this prototype that persists state across page loads) so the list reflects approvals
  made in `invoice-detail.html` when the user returns.
- `invoice-detail.html` (Frames 20.1/21/21.1/22/22.1): added a `return` query param alongside the
  existing `scenario` one, and an "Invoice approved / Got it!" confirmation modal shown after
  Save. Figma's own Frame 21.1/22.1 nodes look like an authoring artifact (the unrelated
  Auto-initiate-payments modal pasted on top of the invoice-detail frame) rather than a distinct
  "approved" design — the modal here is a reasonable equivalent, not a literal copy.
- `pay-home.html` (Frames 23/24): clicking any batch row now selects it (Figma's exact selected
  blue) and opens an in-page detail panel — tags, an invoice-level table, a download-proof-of-
  payment link, collapsible history. Simplified vs. Figma's full nested bank/vendor table (scoped
  down intentionally); per-row invoice numbers/dates are this prototype's own synthetic data since
  Figma only showed one example row's values.

### Third round on 2026-09-29: correcting the invoice-approval confirmation

The designer re-sent the full frame-by-frame spec, but a fresh Figma pull showed frames 1-17 had
identical node IDs to the previous round (unchanged) — the real edit was a recreation of frames
20.1/21/21.1/22/22.1, refining the invoice-approval branch. Two fixes, both in
`invoice-detail.html`, `invoice-home.html`, and `pay-home.html` only:

- **The "Got it!" confirmation was wrong.** Last round's "Invoice approved" modal was this
  project's own invented copy, written on the assumption that Figma's real content (the
  Auto-initiate-payments explainer) was a stray authoring artifact. A second look at the
  recreated frames confirmed it's deliberate: approving a flagged invoice shows that exact same
  Auto-initiate modal the page already uses elsewhere, pre-set to that invoice's own state
  (the "duplicate bill" invoice defaults to auto-initiate **on**, "Got it!"; the "bill higher than
  average" one defaults to **off**, "Turn on"). Fixed by reusing the existing modal instead of a
  bespoke one.
- **New branch after approving**: approve the *first* of the two flagged invoices and its "View
  Payment" link jumps straight into that payment's detail panel, already open. Approve *both*,
  and "View Payment" instead lands on the plain batches list first, needing one more click to
  open a payment — matching the designer's explicit difference between frame 21.2 ("View Payment
  goes to 24") and frame 22.2 ("View Payment goes to 23"). Implemented via a `pay-home.html?open=1`
  query param that auto-selects the first row on load.

### Earlier rounds (still applicable)

- **Text kept verbatim from Figma even where it looked like a typo or was inconsistently
  worded** (e.g. "Providers" vs "Connected providers" between frames) — treated as the design's
  own inconsistency, not something to silently "fix".
- **Tooltips**: wherever Figma showed a visible "Tooltip" component, its exact copy was
  reproduced on hover. A couple of fields with no returned tooltip text got plausible placeholder
  copy — worth a content review.
- **Invoice & Pay scenarios simplified**: `invoice-detail.html` is one page driven by
  `?scenario=fine|anomaly|no-stp`, consolidating several near-duplicate Figma frames (including
  an "Auto-initiate payments on/off" explainer built as a real toggle + modal instead of static
  duplicates). The two "flagged" row icons on `invoice-home.html` are this prototype's own
  addition (the Figma row design didn't have a distinct flagged-icon slot).
- **Two different app shells coexist on purpose**: `chrome.js` (Add-on Management) for CBR/PP,
  and `chrome-invoice.js` (AvidInvoice/AvidPay, compact header + icon sidenav) for Invoice & Pay
  — genuinely different product areas in the source file, not an inconsistency to reconcile.
- **A real bug, since fixed**: `chrome.js` originally hardcoded every icon/nav path as
  `../assets/...`, assuming every page using it sat exactly one folder below the site root. That
  worked locally (and in the first zip) but broke on `index.html` once hosted under a subpath
  (GitHub Pages serves this repo at `/e2e-prototype/`, not domain root) — the header/sidenav
  icons 404'd. Fixed by having `chrome.js` derive its base path from its own `<script src>`
  instead of assuming a fixed depth, so it now works at any hosting depth.
- **Not built, flagged rather than guessed at**: a separate "Wizard setup - without MFA" branch
  visible in the Figma file (its own Enroll Accounts / Master Vendor subsections) was never part
  of any round's instructions and hasn't been built. (The "Edit Enrollment" / "Add memo"
  side-sheet variants were out of scope as of the first Priority Payments round, but were built in
  the second round on 2026-09-28 once the designer's instructions explicitly called for them on
  the Review and Enroll screen — see below.)

No shared file (`shared.css`, `chrome.js`, `app.js`, `nav-map.json`) was fought over or diverged
between the parallel agents that built each update — every screen still uses the same design
tokens and component classes as the rest of the prototype.

## Keeping GitHub / the live site in sync

The repo already exists and is connected to GitHub Pages (serving `main` branch, root). After any
further local edit:

```bash
cd e2e-prototype
git add -A
git commit -m "describe the change"
git push
```

GitHub Pages rebuilds automatically within roughly a minute of the push.

## Alternative — Azure deployment

Not set up (it's an action on a separate external account), but straightforward if preferred over
GitHub Pages:

**Option A — Azure Static Web Apps**
1. In the Azure portal, create a **Static Web App** resource and connect it to
   `github.com/ayamaguchi-avid/e2e-prototype`, branch `main`.
2. Build preset: **Custom** (no build). App location: `/`. Output location: (empty / `/`).
3. Azure generates a GitHub Action that deploys on every push, producing a public URL.

**Option B — Azure Storage Account (no Git)**
1. Create a Storage Account, enable **Static website** in its settings.
2. Manually upload the entire contents of `e2e-prototype/` (keeping the folder structure) to
   the `$web` container.
3. Use the generated "primary endpoint" URL.
