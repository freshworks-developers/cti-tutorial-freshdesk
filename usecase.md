# Use Cases — NovaTel Support (zoomdesk)

## Company Overview

**NovaTel Support** uses **Freshdesk** for tickets and **Zoom** for identity. This CTI sample shows how to load a Zoom agent profile in the sidebar and present a **Crayons-based dial pad** for training and UI demos.

---

## Use Case Scenarios

### 1. Zoom agent identity in CTI

**Scenario:** Agents open the CTI sidebar and need to see which Zoom account the integration is using.

**Use Case:** `getAgent` fetches `/users/me` via Server-to-Server OAuth and displays **Agent**, **Email**, and **Zoom user ID**.

---

### 2. Crayons CTI dial pad demo

**Scenario:** The team prototypes CTI layout and Freshworks Crayons components before building a full telephony integration.

**Use Case:** Circular keypad buttons, **FwSpinner**, status chip, and call affordance demonstrate React Meta + Crayons in `cti_global_sidebar`. The dial pad does not replace a production phone system.

---

### 3. Secure credential handling

**Scenario:** Zoom client secrets must not live in frontend code.

**Use Case:** Three install iparams (Account ID, Client ID, Client Secret) with the secret marked secure; token exchange runs in `getAgent` SMI.

---

### 4. Developer onboarding

**Scenario:** Engineers clone the CTI tutorial repo and need a short path from Zoom Marketplace to `fdk run`.

**Use Case:** README walks through creating the S2S app, copying credentials, **custom_configs**, and testing with `?dev=true`.

---

## Technical summary

| Item | Value |
|------|--------|
| Freshworks surface | `cti_global_sidebar` |
| Zoom scope | `user:read:admin` |
| Server function | `getAgent` |
| Dial pad | Demo UI (Crayons) |
