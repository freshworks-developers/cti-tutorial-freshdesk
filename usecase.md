Use Cases - Nimbus Contact Center / zoomdesk CTI
=================================================

Company Overview
----------------

**Nimbus Contact Center** is a BPO using **Freshdesk** for customer tickets and **Zoom** for agent voice identity. Supervisors need the CTI strip to confirm which Zoom account is linked before agents trust the integration, while UX teams prototype a dialer layout before committing to a certified telephony product.

* * * * *

Use Case Scenarios
------------------

### 1\. Zoom Agent Identity in the CTI Strip

**Scenario**: Before agents place calls, supervisors require the sidebar to show the active Zoom user — name, email, and internal user ID — loaded from Zoom, not hard-coded demo text.

**Use Case**: On CTI open, the React Meta UI invokes `getAgent`. Server-side logic exchanges Server-to-Server OAuth credentials for an access token (`zoomAccessToken` template), then calls Zoom `GET /users/me` (`zoomUserMe`). The agent card renders identity fields; **Refresh** re-runs the flow after credential changes.

* * * * *

### 2\. Crayons Dial Pad Prototype (Demo UI)

**Scenario**: The UX team wants a Zoom-style dialer inside Freshdesk to review spacing, circular keys, loading states, and CTI resize behavior before integrating a certified phone vendor.

**Use Case**: `ZoomdeskApp` provides a **zoomdesk** panel with a Ready status chip, **FwSpinner** while loading, a bordered number field, 3×4 circular keypad, Clear + Call actions, and footer hint. `CtiMain` resizes the iframe on activate. The dial pad demonstrates **Crayons React** in `cti_global_sidebar` — it is not production telephony.

* * * * *

### 3\. Minimal Zoom Marketplace Onboarding

**Scenario**: MSPs and developers need repeatable setup without Contact Center admin steps or per-agent configuration IDs.

**Use Case**: Installation requires only three values from the Zoom S2S app **App Credentials** page: **Account ID**, **Client ID**, and **Client Secret** (secure iparam). Marketplace flow: create **Server-to-Server OAuth** app → add scope **`user:read:admin`** → **Activate** on the account.

* * * * *

### 4\. Secure Credential Handling Server-Side

**Scenario**: Security policy forbids Zoom client secrets in browser storage, React bundles, or client-side request templates.

**Use Case**: Secrets live in iparams (`zoom_client_secret` marked secure). Only `getAgent` runs OAuth and Zoom API calls via `$request.invokeTemplate`. The React UI receives sanitized JSON — never the client secret or raw access token.

* * * * *

### 5\. MSP Multi-Tenant Deployments

**Scenario**: An MSP deploys the same zoomdesk build to many Freshdesk customers, each with its own Zoom tenant.

**Use Case**: Each tenant installs zoomdesk with that customer's three S2S credentials. One scope (`user:read:admin`) and one server function (`getAgent`) keep operational runbooks identical across accounts — no per-agent Contact Center configuration.
