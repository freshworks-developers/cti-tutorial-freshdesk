# Use Cases — zoomdesk

## Company Overview

This sample targets teams using **Freshdesk** for ticketing and **Zoom** for voice and agent identity. Agents work tickets in Freshdesk and need a CTI sidebar that confirms which Zoom account is linked to the integration, while the product team prototypes a Zoom-style dialer UI before committing to a full telephony vendor build.

**zoomdesk** replaces the legacy Freshdesk [CTI tutorial](https://developers.freshworks.com/tutorials/codelabs/develop-cti-app-for-freshdesk) sample in this repo. It was rebuilt as a **Platform 3.0 React Meta** app (Node **24.11.1**, FDK **10.1.2**) with **zoomdesk** branding, a Zoom-blue CTI layout, and a minimal Zoom **Server-to-Server OAuth** backend.

* * * * *

## What was built (scope and coverage)

| Area | Coverage |
|------|----------|
| **Surface** | `cti_global_sidebar` on Freshdesk (`modules.common.location`) |
| **Frontend** | React Meta — `CtiMain.jsx`, `ZoomdeskApp.jsx`, `app/styles/style.css` |
| **UI framework** | Crayons React (`FwSpinner`, `defineCustomElements`, crayons-min.css) |
| **Branding** | **zoomdesk** title, Zoom blue (`#0e71eb`), blue **Z** CTI icon (`app/icon.svg`) |
| **Dial pad** | Full-circle keypad (56px keys), number input, Clear, demo Call button |
| **Server** | Single SMI `getAgent` — OAuth token + `GET /v2/users/me` |
| **Requests** | `zoomAccessToken`, `zoomUserMe` in `config/requests.json` |
| **Install params** | Three iparams only: Account ID, Client ID, Client Secret (`config/iparams.json`) |
| **Zoom scope** | `user:read:admin` only |
| **Tests** | Vitest unit tests for `normalizePhoneNumber` (`tests/phone.test.js`) |
| **Docs** | `README.md` (setup steps, banner), this `usecase.md` |
| **Validation** | Target `fdk validate` — 0 platform errors, 0 lint errors |

### Explicitly out of scope (removed during build)

The following were explored in earlier iterations but **removed** to keep the app simple and shippable as a tutorial:

- Zoom Contact Center **Engagement Control API** and `make_call` server APIs
- Optional iparams (Contact Center user ID, outbound caller ID)
- Contact Center scopes (`contact_center:*`)
- Production outbound calling via `zoomphonecall://` (unreliable inside Freshdesk iframes)
- Documented reliance on `cti.triggerDialer` for live click-to-dial

The **Call** button and `phone.js` helpers remain as **UI demo** code paths only; README states the dial pad is for **Crayons capability demonstration**, not production telephony.

* * * * *

## Use Case Scenarios

### 1. Zoom agent identity in the CTI strip

**Scenario:** Before agents trust a CTI integration, supervisors want the sidebar to show the active Zoom user (name, email, internal user ID) loaded from Zoom—not hard-coded demo text.

**Use Case:** On CTI open, the frontend invokes `getAgent`. Server-side logic exchanges S2S credentials for an access token (`zoomAccessToken` request template), then calls Zoom `GET /users/me` (`zoomUserMe`). The agent card renders **Agent**, **Email**, and **Zoom user ID**. **Refresh** re-runs the same flow after credential or account changes.

* * * * *

### 2. Crayons + React Meta CTI dial pad (demo UI)

**Scenario:** The UX team wants a Zoom Contact Center–style dialer layout inside Freshdesk to review spacing, circular keys, loading states, and CTI resize behavior before integrating a certified phone product.

**Use Case:** `ZoomdeskApp` provides a single-column **zoomdesk** panel: Ready status chip, **FwSpinner** while loading, bordered number field, 3×4 circular keypad, Clear + Call actions, and footer hint. `CtiMain` resizes the iframe (~300×520px) on activate. This demonstrates **Crayons React** in `cti_global_sidebar` without claiming marketplace-grade calling.

* * * * *

### 3. Minimal Zoom Marketplace onboarding

**Scenario:** Developers and MSPs need repeatable setup without Contact Center admin steps or per-agent IDs.

**Use Case:** Install requires only three values from the Zoom S2S app **App Credentials** page:

1. **Account ID**
2. **Client ID**
3. **Client Secret** (secure iparam)

Marketplace steps: create **Server-to-Server OAuth** app → add scope **`user:read:admin`** → **Activate** on the account. No Engagement Control API toggle, no extra scopes.

* * * * *

### 4. Secure credential handling (serverless)

**Scenario:** Security policy forbids Zoom client secrets in browser storage, React bundles, or client-side request templates.

**Use Case:** Secrets live in iparams (`zoom_client_secret` marked `secure: true`). Only `getAgent` runs OAuth and Zoom API calls via `$request.invokeTemplate`. The React UI receives sanitized JSON (`account.display_name`, `email`, `id`)—never the client secret or raw token.

* * * * *

### 5. Local development and developer settings

**Scenario:** Engineers extend the CTI tutorial and must test against a real Freshdesk dev account without publishing to Marketplace first.

**Use Case:** Standard FDK workflow:

1. `npm install` → `fdk validate` → `fdk run`
2. Paste the three Zoom fields in **http://localhost:10001/custom_configs** (or **system_settings**)
3. Open Freshdesk with **`?dev=true`**, allow local network access
4. Open the CTI headset strip → blue **Z** icon → verify agent card

README documents each step, including where to copy credentials in Zoom Marketplace.

* * * * *

### 6. Migration from legacy CTI tutorial

**Scenario:** The repo previously shipped a vanilla HTML/JS CTI sample (`app/scripts/app.js`) with Freshdesk request templates (`createTicket`, `getContacts`) and no Zoom integration.

**Use Case:** The app was migrated to **React Meta** (`metaConfig.framework: "react"`), engines **Node 24.11.1** / **FDK 10.1.2**, Zoom S2S backend, and **zoomdesk** UI. Legacy tutorial scripts and MOVED pointers were retired in favor of this folder as the canonical Freshdesk + Zoom CTI sample (`only-migration/cti-tutorial-freshdesk/`).

* * * * *

### 7. MSP multi-tenant install pattern

**Scenario:** An MSP deploys the same app build to many Freshdesk customers, each with its own Zoom tenant.

**Use Case:** Each tenant installs zoomdesk with that customer’s three S2S credentials. One scope (`user:read:admin`) and one server function (`getAgent`) keep operational runbooks identical across accounts—no per-agent Contact Center configuration.

* * * * *

## Architecture summary

```
Freshdesk CTI iframe
  └── CtiMain.jsx (app.initialized, resize, Crayons loader)
        └── ZoomdeskApp.jsx (UI + optional demo dial helpers)
              └── client.request.invoke('getAgent')
                    └── server/server.js
                          ├── zoomAccessToken  → POST zoom.us/oauth/token
                          └── zoomUserMe       → GET api.zoom.us/v2/users/me
```

| Item | Value |
|------|--------|
| App name | **zoomdesk** |
| Product | Freshdesk |
| Placement | `cti_global_sidebar` |
| Framework | React Meta |
| Server function | `getAgent` |
| Zoom scope | `user:read:admin` |
| Install fields | 3 (Account ID, Client ID, Client Secret) |
| Dial pad | Crayons UI demo |
| Production calls | Not in scope — use Zoom’s official Freshdesk integration or Smart Embed for real telephony |

* * * * *

## Functional vs demo matrix

| Capability | Status | Notes |
|------------|--------|--------|
| Load Zoom agent profile | **Supported** | Requires valid iparams + activated S2S app |
| CTI sidebar + blue Z icon | **Supported** | `icon.svg`, manifest placement |
| Circular Crayons dial pad | **Demo** | Layout and interaction sample |
| Call button / `phone.js` | **Demo** | Not documented as production dial |
| Engagement Control API | **Not used** | Removed for simplicity |
| Contact Center `make_call` API | **Not used** | Removed for simplicity |
| Click-to-dial (`cti.triggerDialer`) | **Not productized** | May exist in code experiments; not part of supported scope |

* * * * *

## Verification

```bash
cd only-migration/cti-tutorial-freshdesk
fdk validate
npm run fdk-unit-test   # optional: phone normalization tests
```

Expected: **0 platform errors**, **0 lint errors**, agent card populated when dev iparams are set and Zoom app is activated.
