# End-to-End Prototype — Connected Bill Retrieval, Priority Payments & Invoice/Pay

Clickable static prototype (plain HTML/CSS/JS, no build step) recreated from the Figma file
**"End to End Prototype"** (`fileKey Ei3vesaWdzL7bKm5sc03Jo`).

29 HTML files covering three flows:

1. **Connected Bill Retrieval (CBR)** — Home (connected / empty / variants) + the "Connect
   provider" wizard (search for a provider → MFA / email verification → master vendor selection
   → enroll accounts), looping back to the now-connected Home.
2. **Priority Payments (PP) enrollment** — a 5-stage "Set Up Payments" wizard entered from
   Home's Priority Payments tab.
3. **Invoice & Pay** — a separate product area (AvidInvoice / AvidPay) with its own header and
   icon-only sidenav: an invoice queue, three example review scenarios, and the AvidPay batches
   screen.

## Running it locally

Any simple static server works (it can't be opened directly as `file://` because the relative
scripts/CSS won't load without a server). Example:

```bash
cd e2e-prototype
python3 -m http.server 8080
```

Then open `http://localhost:8080/` (this loads `index.html`, the CBR Home screen in its
"no connections yet" state).

## Structure

```
e2e-prototype/
  index.html                 # entry point = home-empty.html
  css/shared.css             # design tokens + all reusable components (buttons, tables,
                              #   step-tracker, tooltips, toggles, modals, side sheets, .stage
                              #   panels for in-page state)
  js/chrome.js                # injects the Add-on Management Global Header + Side nav
  js/chrome-invoice.js        # injects the separate AvidInvoice/AvidPay header + icon sidenav
                              #   (used only by invoice-home / invoice-detail / pay-home)
  js/app.js                    # small shared interactions (radio/card selection)
  assets/icons/                # shared Add-on Management header/sidenav icons
  assets/wizard/                # icons/images specific to the CBR wizard screens
  assets/invoice-pay/            # images specific to the Invoice & Pay flow
  screens/*.html                  # the 29 screens (one file per screen/flow-stage)
  nav-map.json                     # full screen inventory + navigation per flow
```

## How the navigation was reconstructed

The Figma file has no formal prototype links between frames. Screen order and branching were
inferred from the canvas's spatial layout (frames left-to-right = main sequence, stacked
above/below = alternate/error states) and, for this update, from explicit written instructions
from the designer about which groups of frames are really just different *states* of one screen
rather than separate pages. Full detail is in `nav-map.json`.

### The "stage consolidation" pattern

Several places in this prototype fold what were originally many separate Figma frames into
**one HTML file** that shows one internal state at a time and switches between them with a small
inline `<script>` — a toggle flips, a dropdown opens, a checkbox enables a button — rather than
navigating to a new URL for every minor variation. This applies to:

- `wizard-route-a.html`, `wizard-route-b.html`, `wizard-route-c.html`, `wizard-route-e.html`
  (the CBR "Connect to bill provider" sub-steps, previously ~20 separate pages)
- `pp-confirm-address.html`, `pp-payment-rules.html` (Priority Payments enrollment)
- `invoice-detail.html` (Invoice & Pay — one page, `?scenario=fine|anomaly|no-stp` swaps the copy)

Only a real "Next" at the *end* of a route/stage sequence, "Back" (always to the *previous
route*, not a previous internal stage), and "Cancel" (always straight to `home-connected.html`)
are true page navigations inside these consolidated files.

## Scope, decisions & things worth a second look

### Connected Bill Retrieval (original build)

- **Text kept verbatim from Figma even where it looked like a typo** — e.g. the empty Home
  screen (`home-empty.html`) repeats "you'll find it here it here." exactly as written in the
  design.
- **A small label inconsistency inherited from Figma itself**: the empty/variant Home screens
  call the first "Manage" menu item "Connected providers", while the main connected Home calls
  it "Providers". Both links work the same way — it's just a wording difference between frames.
- **`wizard-step-177d-external.html`** is a generic mock of "the provider's external site", not
  a pixel-accurate copy of the real PSE&G site (the Figma frame was a pasted third-party
  screenshot). Per the latest instructions, clicking *anywhere* on this page now returns to
  `wizard-route-e.html`.
- **Tooltips**: wherever Figma showed a visible "Tooltip" component, its exact copy was
  reproduced on hover. A couple of fields with no returned tooltip text got plausible
  placeholder copy — worth a content review.
- **`home-connected-alt.html` / `home-connected-v3.html`**: near-duplicate variants of the main
  connected Home (Figma frames "26" and "27"), kept out of the primary flow and reachable only
  via a small discreet link from `home-connected.html`.

### This update (Priority Payments + Invoice/Pay + route consolidation)

- **Route A/B/C/E consolidation**: the designer's instruction was "just actions inside like
  dropdown, button able/disabled etc." Route C ended up being two near-identical stages that
  differ only by an MFA-email checkbox's state (unchecked → Next disabled), which is a very
  literal reading of that instruction. Route E's final stage auto-advances after ~1.4s (the
  original screen's Next button had no working target in the source design — a real dead end in
  a click-through prototype), which is a judgment call, not an explicit instruction.
- **`pp-confirm-address.html`**: the "Edit address" Figma frames turned out to show the address
  fields becoming editable *in place*, not in an overlay — so this page uses inline editing
  instead of the modal/side-sheet pattern used elsewhere. Noted as a deliberate deviation from
  the general pattern, because it's what the actual design showed.
- **`pp-payment-rules.html`**: built as one live form with real toggle switches and a real
  workflow dropdown (not discrete `.stage` panels) — closer to the "wire it up as real controls"
  spirit of the instructions than a series of static screenshots-as-HTML.
- **Not built**: the "Edit Enrollment" / "Edit behavior" / "Add memo" side-sheet variants inside
  the Priority Payment Rules step. These belong to a separate "manage an already-enrolled vendor
  later" side-flow that wasn't part of the enrollment sequence itself — flagged in `nav-map.json`
  as out of scope for this pass rather than guessed at.
- **Invoice & Pay scenarios simplified**: Figma had near-duplicate frames for each of the 3
  example scenarios (an "Auto-initiate payments on/off" explainer modal that wasn't really part
  of each scenario's own story). These were consolidated into one `invoice-detail.html` page
  driven by a `?scenario=` query string, with the on/off explainer built as one real toggle +
  modal instead of 4+ near-duplicate static pages.
- **Invoice-home's clickable "flagged" rows**: the two rows that lead to the anomaly scenarios
  have a small warning icon added for this prototype (the underlying Figma row design didn't
  have a distinct "flagged" icon slot) — a judgment call to make the 3 scenarios discoverable by
  clicking.
- **Two different app shells now coexist in this project on purpose**: `chrome.js` (Add-on
  Management: full-width header, expanded text sidenav) for CBR/PP, and `chrome-invoice.js`
  (AvidInvoice/AvidPay: compact header, icon-only sidenav) for Invoice & Pay — they're genuinely
  different product areas in the source Figma file, not an inconsistency.
- **Also observed, not acted on**: the updated Figma file also contains an entirely separate
  "Wizard setup - without MFA" branch (its own Enroll accounts / Master vendor subsections) that
  wasn't mentioned in the designer's instructions for this pass, and the old empty-state Home
  frame this prototype's `home-empty.html`/`index.html` was built from no longer exists in the
  Figma file (it looks like it was cleaned up/renamed on the design side). Neither required a
  code change here, but worth flagging in case a future update should account for them.

No shared file (`shared.css`, `chrome.js`, `app.js`, `nav-map.json`) was fought over or diverged
between the parallel agents that built this update — each new/rewritten screen still uses the
same design tokens and component classes as the rest of the prototype.

## Next step — Azure deployment

Not done automatically (it's an action on an external account). Simplest path, as originally
planned:

**Option A — Azure Static Web Apps (recommended)**
1. Create a GitHub repository and push the contents of this folder (`e2e-prototype/`).
2. In the Azure portal, create a **Static Web App** resource and connect it to the repo/branch.
3. Build preset: **Custom** (no build). App location: `/`. Output location: (empty / `/`).
4. Azure generates a GitHub Action that deploys on every push, producing a public URL.

**Option B — Azure Storage Account (no Git)**
1. Create a Storage Account, enable **Static website** in its settings.
2. Manually upload the entire contents of `e2e-prototype/` (keeping the folder structure) to
   the `$web` container.
3. Use the generated "primary endpoint" URL.
