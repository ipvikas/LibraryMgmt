# Product Requirements Document (PRD)
## Online Community Library – Book Donation, Wishlist & Delivery Platform

| Item | Detail |
|---|---|
| Document status | Draft v1.0 for review |
| Date | 21 November 2026 |
| Source of requirements | Requirement notes provided by the product owner |
| Convention | Items marked **[GIVEN]** come directly from the requirement notes. Items marked **[PROPOSED]** are my suggestions and need approval. Items marked **[OPEN]** are unclear in the notes and are **not assumed**; they are listed in Section 14 for a decision. |

---

## 1. Purpose

Build a deployable website where:

1. **Book donors** log in and list the books they want to donate, using a pre-defined catalogue template. **[GIVEN]**
2. **Readers** log in and create a **Wishlist** for books that are currently not available. **[GIVEN]**
3. **Readers** can order a book if it is available at a borrower's home, a donor's home, or a dedicated buffer store. **[GIVEN]**
4. Every location (reader, donor, buffer store) has a **linked Google Map location**. **[GIVEN]**
5. Books are moved by **Porter or any courier service**. **[GIVEN]**
6. The system maintains a list of **book locations, reader information and donor list**. **[GIVEN]**
7. **No personal data is exposed.** **[GIVEN]**

## 2. Goals and Non-Goals

### Goals
- Let donors list books quickly through a fixed template.
- Let readers discover, wishlist and order books.
- Show where each book physically is, with a Google Map link.
- Hand a complete, minimal pick-up/drop request to a courier.
- Run on free or freely available tools wherever possible.
- Protect personal data.

### Non-Goals (not stated in the notes, so excluded until confirmed)
- Online payments, fines, deposits or subscriptions.
- E-books or digital content.
- A native mobile app (a mobile-friendly website is enough unless told otherwise).

## 3. User Roles

| Role | Description | Source |
|---|---|---|
| Donor | Logs in, lists books to donate | [GIVEN] |
| Reader | Logs in, builds wishlist, orders books | [GIVEN] |
| Borrower | A reader who currently holds a book and whose home may serve as a pickup point | [GIVEN – "borrower's home"] |
| Courier / Porter | External delivery party; receives only the pick-up/drop details in Section 7 | [GIVEN] |
| Store keeper | Manages a buffer store | [PROPOSED] – confirm whether needed |
| Admin | Approves users, manages stores, resolves issues | [PROPOSED] – confirm whether needed |

## 4. Core User Flows

### 4.1 Donor flow
1. Register/login with credentials.
2. Open the **Donate a Book** form (the pre-defined catalogue template, Section 6.4).
3. Enter the book name and category; add one or more books.
4. Set the book's location: donor's home or a buffer store.
5. Book appears in the catalogue as *Available*.

### 4.2 Reader flow
1. Register/login with credentials.
2. Complete the reader profile (Section 6.2).
3. Search the catalogue.
   - **Book available** → place an order (4.3).
   - **Book not available** → add to **Wishlist** (4.4).

### 4.3 Order and delivery flow
1. Reader orders an available book.
2. System shows the book's current location type: *donor home*, *borrower home* or *buffer store*, with a Google Map link.
3. Delivery is arranged by Porter or another courier.
4. System creates a courier request containing only the fields in Section 7.
5. Courier picks up and drops. Status is updated (see Section 8).
6. Book location and holder are updated in the location register.

### 4.4 Wishlist flow
1. Reader adds a book (name, genre) to the wishlist when it is unavailable.
2. When a matching book is listed by a donor, the reader is notified. **[PROPOSED]** Notification channel: email (free) – confirm.

## 5. Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Donor and reader registration and login with credentials | Must |
| FR-02 | Donor can list books using the fixed catalogue template | Must |
| FR-03 | Catalogue shows book name, category and availability status | Must |
| FR-04 | Reader can search and filter by name, category/genre | Must |
| FR-05 | Reader can create and manage a wishlist for unavailable books | Must |
| FR-06 | Reader can order an available book from donor home, borrower home or buffer store | Must |
| FR-07 | Every location has a Google Map link | Must |
| FR-08 | System maintains the register of book locations, readers and donors | Must |
| FR-09 | System generates a courier request with the exact fields in Section 7 | Must |
| FR-10 | Integration with a courier service (Section 11) | Must |
| FR-11 | Personal data is never shown to other users (Section 9) | Must |
| FR-12 | Wishlist match notification | Should |
| FR-13 | Admin panel for approvals and store management | Should |
| FR-14 | Order status tracking | Should |

## 6. Data Model

Only the fields below were given. Fields marked [PROPOSED] are needed for the system to function and need approval.

### 6.1 Donor
| Field | Source |
|---|---|
| Donor_Name | [GIVEN] |
| Book name | [GIVEN] |
| Donor_MNo (needed for the courier) | [GIVEN in courier section] |
| Donor_Location (with Google Map link) | [GIVEN – all locations] |
| Donor_ID, login credential | [PROPOSED] |

### 6.2 Reader account
| Field | Source |
|---|---|
| Reader_Name | [GIVEN] |
| Interest to read, books like… | [GIVEN] |
| Genre of interested book | [GIVEN] |
| Available reading time | [GIVEN] |
| Receiver_MNo (needed for the courier) | [GIVEN in courier section] |
| Reader_Location (with Google Map link) | [GIVEN – all locations] |
| Reader_ID, login credential | [PROPOSED] |

### 6.3 Store (buffer storage unit)
| Field | Source |
|---|---|
| Location (with Google Map link) | [GIVEN] |
| Buffer Books available | [GIVEN] |
| Store_ID | [PROPOSED] |

### 6.4 Catalogue (pre-defined donor template)
| Field | Source |
|---|---|
| Book name | [GIVEN] |
| Book_Category | [GIVEN] |
| Book_ID, Status (Available / Reserved / In transit), Current location reference | [PROPOSED] |

### 6.5 Wishlist [PROPOSED structure]
Reader_ID, Book name, Genre, Date added, Fulfilled (Y/N).

### 6.6 Book location register [GIVEN as a requirement; structure PROPOSED]
Book_ID, Location type (Donor home / Borrower home / Buffer store), Location reference, Google Map link, Current holder ID, Last updated.

### 6.7 Order / Delivery request [PROPOSED structure]
Order_ID, Book_ID, Reader_ID, Source location, Destination location, Time slot, Courier reference, Status.

## 7. Courier (Porter) Request Payload **[GIVEN]**

The system sends the courier exactly these fields:

| Field | Description |
|---|---|
| Pick up book from – **Start_Location** | Address with Google Map location link |
| Drop book to – **End_Location** | Address with Google Map location link |
| **Timing** | Requested pick-up/drop time |
| **Donor_Name** | Name of the person handing over the book |
| **Donor_MNo** | Mobile number of that person |
| **Receiver_Name** | Name of the receiver |
| **Receiver_MNo** | Mobile number of the receiver |

Note: the "Donor" and "Receiver" here are the **handover person** and the **receiving person** for that trip. If the book moves from a borrower's home or buffer store, the handover person may not be the original donor. See Open Question OQ-4.

## 8. Order Status Lifecycle [PROPOSED]

`Requested → Courier requested → Picked up → Delivered → Held by reader`

The exact statuses available depend on the courier's capabilities (see Section 11).

## 9. Privacy and Data Protection (No personal data exposed) **[GIVEN]**

The notes say no personal data should be exposed, but the courier needs names, mobile numbers and locations. The proposed way to satisfy both:

| Rule | Detail |
|---|---|
| P-1 | Public catalogue shows only: Book name, Category, Availability. No donor or holder identity. |
| P-2 | Readers never see a donor's/borrower's name, mobile number or exact address. They see only the location *type* and, at most, a generalised map area. **[OPEN – OQ-3]** |
| P-3 | Donors never see reader details. |
| P-4 | Names, mobile numbers and exact locations are shared **only with the courier**, **only for that specific trip**, and only the Section 7 fields. |
| P-5 | Passwords are never stored in plain text and never stored in a spreadsheet (see Section 10). |
| P-6 | Only Admin can access the full register of locations, readers and donors. |
| P-7 | Data is accessed through role-based permissions; the spreadsheet or database is never made public. |
| P-8 | Retention and deletion policy for personal data. **[OPEN – OQ-8]** |

## 10. Technology Suggestion (Freeware / free tiers)

You were unsure about technology, so below are options. These are suggestions only. **Please verify current free-tier limits and pricing on each provider's website before committing**, as these change.

### Option A – Simplest, no-code/low-code (recommended to start)
| Layer | Tool | Why |
|---|---|---|
| Database | **Google Sheets** | Free, familiar; one tab per entity in Section 6 |
| Back-end logic | **Google Apps Script** (web app) | Free, runs against Sheets, can call external APIs |
| Front-end | **HTML/CSS/JavaScript** static site | Free hosting on GitHub Pages, Netlify, Cloudflare Pages or Firebase Hosting |
| Login | **Google Sign-In** or **Firebase Authentication** | Avoids storing passwords yourself |
| Maps | **Google Maps URL links** (no API key needed) plus optional Maps Embed API | Cheapest way to give each location a linked map |
| Email notifications | Apps Script `MailApp` | Free within Google's daily quotas |

**Caution:** Google Sheets is not designed to be a secure credentials store. Do not keep passwords in it. Apps Script also has execution and quota limits, so this option suits small to moderate usage.

### Option B – More robust, still free to start
| Layer | Tool |
|---|---|
| Database | **Firebase Firestore** or **Supabase (PostgreSQL)** |
| Login | Firebase Authentication or Supabase Auth |
| Hosting | Firebase Hosting, Netlify, Vercel or Cloudflare Pages |
| Server logic | Firebase Cloud Functions or Supabase Edge Functions (a paid plan may be required for some features – verify) |

### Suggested choice
Start with **Option A** to validate the idea. Move to **Option B** if usage, security or reporting needs outgrow Sheets. **[OPEN – OQ-9: confirm expected number of users and books]**

### Google Maps integration
- **Link-only approach (no API key):** store latitude/longitude or a place link per location and build a link of the form `https://www.google.com/maps/search/?api=1&query=<latitude>,<longitude>`. This is the documented Maps URLs format.
- **Embedded map / address picker:** Maps Embed API and Maps JavaScript API with Places autocomplete need an API key and a Google Cloud project. Check current free usage allowance and billing requirements on the Google Maps Platform pricing page.
- Each of the three location types (reader, donor, buffer store) stores one map link.

## 11. Courier Integration

| Item | Detail |
|---|---|
| Courier named in notes | Porter, "or any courier service" [GIVEN] |
| API availability | **Not verified.** I have not confirmed that Porter or any specific courier offers a public API for your use, nor its endpoints, authentication, coverage or pricing. These must be checked directly with the provider. **[OPEN – OQ-5]** |
| Design approach [PROPOSED] | Build a **courier adapter layer**: one internal function "create delivery request" that takes the Section 7 payload. Each courier (Porter or another) is a separate plug-in behind it. This lets you change courier without redesigning the system. |
| Fallback if no API is available [PROPOSED] | System generates the Section 7 details as a ready-to-send message/email/form for an admin to submit to the courier manually, and the admin updates the status. |
| Status updates | Automatic only if the courier supports webhooks or status lookup; otherwise manual by admin. |

## 12. Non-Functional Requirements

| Area | Requirement |
|---|---|
| Deployability | Publicly accessible website, deployed on free hosting |
| Security | HTTPS, role-based access, no plain-text passwords, sheet/database not publicly readable |
| Usability | Mobile-friendly, simple forms |
| Availability | Depends on free-tier providers; no uptime guarantee |
| Scalability | Option A suits limited scale; see OQ-9 |
| Auditability | Every location change and courier request is logged with timestamp |

## 13. Screens (Proposed)

1. Login / Register
2. Donor dashboard: *Donate a Book* template, *My donations*
3. Reader dashboard: profile, catalogue search, wishlist, my orders
4. Book detail: availability, location type, Google Map link
5. Order confirmation and time-slot selection
6. Admin: users, stores, location register, courier requests

## 14. Open Questions (Not assumed; need your decision)

| ID | Question |
|---|---|
| OQ-1 | How are credentials created: email + password, phone OTP, or Google login? Is identity verification required for donors/readers? |
| OQ-2 | Is the borrower period fixed, and is there a return process? The notes mention "borrower's home" but do not define lending duration or returns. |
| OQ-3 | If personal data must not be exposed, should readers see even the exact map location of a donor/borrower home? Proposed: show only an approximate area, with the exact location going only to the courier. |
| OQ-4 | When a book moves from a borrower's home or buffer store, who is the "Donor" in the courier payload: the original donor or the person handing it over? |
| OQ-5 | Which courier(s) should be used, in which city/country, and who will confirm API access, cost and coverage? |
| OQ-6 | Who pays courier charges: donor, reader or the library? |
| OQ-7 | Who runs the buffer stores, and how are books checked in and out? Is a store keeper role required? |
| OQ-8 | Data retention and deletion rules for personal data, and applicable privacy laws for your region. |
| OQ-9 | Expected number of users, books and orders per month? |
| OQ-10 | Languages, geography and book languages to support? |
| OQ-11 | Should wishlist matches notify readers, and by which channel (email, SMS, WhatsApp)? SMS/WhatsApp are usually not free. |
| OQ-12 | Is an admin role approved, and who will be the admin? |
| OQ-13 | Should a book be physically verified or a condition recorded on donation? |
| OQ-14 | Domain name: is a free subdomain acceptable, or is a custom domain required (may have a cost)? |

## 15. Suggested Delivery Phases

| Phase | Scope |
|---|---|
| 1 – Foundation | Login, donor template, catalogue, location register with map links |
| 2 – Reader features | Reader profile, search, wishlist, order request |
| 3 – Logistics | Courier request generation (manual fallback first), then courier API integration |
| 4 – Hardening | Privacy review, admin panel, notifications, status tracking |

## 16. Acceptance Criteria (Summary)

- A donor can log in, add a book through the template, and see it in the catalogue.
- A reader can log in, search, add an unavailable book to the wishlist and order an available book.
- Each donor, reader and store location opens a Google Map link.
- The location register lists every book with its current location, and the reader and donor lists are maintained.
- The courier request contains exactly the seven fields in Section 7.
- No public page or non-admin user can view another person's name, mobile number or exact address.
- The website is publicly accessible on a free host.
