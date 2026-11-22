# Product Requirements Document (PRD)
## Online Community Library – Book Donation, Lending, Wishlist & Delivery Platform

| Item | Detail |
|---|---|
| Document status | Draft v1.7 for review (supersedes v1.0 to v1.6) |
| Trial scope | **Pune city, India only** |
| Constraints | **No paid application**; **no payment gateway**; **no courier integration**; **no courier OTP**; **no OTP to mobile numbers**; **no cash withdrawal of points** [GIVEN] |
| Convention | **[GIVEN]** = stated by the product owner. **[PROPOSED]** = my suggestion, needs approval. **[OPEN]** = unclear; **not assumed**; listed in Section 19. |

---

## 1. Purpose

A deployable website where:

1. **Donors** log in and list books they want to donate using a pre-defined catalogue template. [GIVEN]
2. **Readers** log in and create a **Wishlist** against a book title when no copy is available. [GIVEN]
3. **Readers** order books, paying a fixed order fee by **points, UPI or a split of both**; delivery is by **Porter or another courier**, arranged and paid for **manually by the Admin**. [GIVEN]
4. Books circulate from donor to reader and from reader to reader. When no one is waiting, a book goes back to the **Buffer center**. [GIVEN]
5. Every location (reader, donor, Buffer center) has a **linked Google Map location**. [GIVEN]
6. A register of **book locations, reader information and donor list** is maintained. [GIVEN]
7. **No personal data is exposed**, and the reader never sees donor or ship-from details. [GIVEN]

## 2. Change Log (v1.6 to v1.7)

| Topic | v1.6 | Now (v1.7) |
|---|---|---|
| Re-registration | Considered when previous due is cleared and issued copy submitted | **A suspended/blacklisted reader can initiate re-registration only after 15 days**, by a **separate request** (for example email to Admin). **Admin verifies it against the blacklist** and, if matched, **initiates re-registration once the reader agrees to return the issued book and clear outstanding dues** |
| Queue | Per-copy queue conflicted with title wishlist | **Each physical copy maintains its own queue**, which determines the next eligible reader when that copy becomes available |
| Cancellation | Open | **Readers can cancel an order before delivery**; the **applicable order fee is credited back as points** |
| Archived copy | Open | If one copy is archived but **other copies of the same title remain, the order is re-matched to another eligible copy** |
| Courier pickup delay | Open | **No late-return penalty applies if the courier fails to collect the book on the scheduled return date; the penalty start date is adjusted accordingly** |
| Points usage | Orders only; mixing open | **Points can pay for book orders and penalties**; readers can **split payments between points and UPI** |
| Points refund | Open | **Points can never be withdrawn or refunded as cash**; **all eligible refunds and credits are issued as account points** |

## 3. Goals and Non-Goals

### Goals
- Donors list books quickly through a fixed template.
- Readers discover, wishlist, order, cancel and return books within a defined borrowing period.
- Books move directly from holder to next reader wherever possible.
- Late returns are discouraged by a daily penalty, suspension and blacklisting, without penalising readers for courier failures.
- Personal data is protected; readers cannot see where a book comes from or what a courier costs.
- Use free tools only.

### Non-Goals
- E-books or digital content.
- A native mobile app (mobile-friendly website only).
- Cities other than Pune.
- Subscriptions.
- Payment gateway integration. [GIVEN]
- Courier API or courier-service integration. [GIVEN]
- Charging courier costs to readers. [GIVEN]
- Cash refunds or cash withdrawal of points. [GIVEN]
- Phone-number OTP, and OTPs for courier operations. [GIVEN]

## 4. User Roles

| Role | Description | Source |
|---|---|---|
| Donor | Logs in with email OTP; lists books; keeps unrequested books at home | [GIVEN] |
| Reader | Logs in with email OTP; wishlists, orders (points, UPI or split), cancels before delivery, extends, returns books; may also be the "current reader" who ships a book onward | [GIVEN] |
| Admin / application manager | Owns the Buffer center; validates PIN codes; verifies manual UPI payments; negotiates, arranges and pays couriers; maintains trip details; records received and returned dates and courier failures; credits points; lifts suspensions; blacklists and closes accounts; initiates recovery requests; verifies and initiates re-registration | [GIVEN] |
| Courier (Porter or other) | External; receives trip details only from the Admin | [GIVEN] |

## 5. Business Rules

| ID | Rule | Source |
|---|---|---|
| BR-01 | Users log in with **email OTP only**. There is no OTP for couriers and none to mobile numbers | [GIVEN] |
| BR-02 | Service operates only in Pune city | [GIVEN] |
| BR-03 | Every address carries **society name, Pune-area PIN code and Google Map location**. **Admin validates the PIN code before processing orders or donations** | [GIVEN] |
| BR-04 | Reader enters **tentative borrowing days** when ordering | [GIVEN] |
| BR-05 | **Borrowing clock starts when the borrower receives the book**. **Admin manually records the received date** | [GIVEN] |
| BR-06 | **Returned date is the date the courier collects the book from the reader.** **Admin manually records it**; the penalty stops at this date | [GIVEN] |
| BR-07 | Reader must return the book **within the stipulated borrowing period** | [GIVEN] |
| BR-08 | Reminder **two days before the return date**, by **email and in-app** | [GIVEN] |
| BR-09 | Each book order allows **at most one extension, of one week (seven days)**, on the current borrower's request; the return deadline moves by seven days | [GIVEN] |
| BR-10 | The extension is granted **even if other readers are queued** | [GIVEN] |
| BR-11 | **Wishlist is created against a book title.** Fulfilment depends on the availability of **any physical copy of that title** | [GIVEN] |
| BR-12 | **Each physical copy maintains its own first-come-first-served queue**, which determines the **next eligible reader when that copy becomes available** | [GIVEN] (how a reader is placed in a copy's queue: OQ-4) |
| BR-13 | If a title has **multiple copies and at least one is currently issued**, the **first reader in the queue can place a wishlist order**; the book **ships automatically once a copy becomes available** | [GIVEN] |
| BR-14 | If a copy is **available at the Buffer center**, the **next reader in the queue can order at any time**, without waiting for the current reader's return | [GIVEN] |
| BR-15 | When a reader is waiting for a copy that is with another reader, the book ships **directly from the current reader's home to the first waiting reader on the current reader's scheduled return date, not before** | [GIVEN] |
| BR-16 | When no one is waiting, the application **may propose an additional week** to the current reader | [GIVEN] (counts as the order's single extension per BR-09) |
| BR-17 | If the reader does not wish to retain the book and no request exists, the book **returns to the Buffer center** | [GIVEN] |
| BR-18 | **Fixed order fee: Rs 1,000 per order.** If the order is **fulfilled, the fee is non-refundable.** The **next reader in the queue pays the same fee** when placing an order | [GIVEN] |
| BR-19 | The reader can pay the order fee **by points, by UPI, or split between points and UPI** (1,000 points = Rs 1,000) | [GIVEN] |
| BR-20 | **No fee is taken when a wishlist is created or when a copy is allocated** | [GIVEN] (when the fee is taken: interpretation 3, Section 18) |
| BR-21 | **Cancellation:** the reader **can cancel an order before delivery**. The **applicable order fee is credited back as points** | [GIVEN] (edge case: OQ-8) |
| BR-22 | **Archived copy:** if one physical copy is archived but **other copies of the same title remain, the order is re-matched to another eligible copy**. An order **cannot be fulfilled only when the ordered book's details are archived from the catalogue** (with no other copy to match); then **1,000 points are credited** | [GIVEN] (combined reading of the two statements; OQ-9) |
| BR-23 | **Points:** never expire; can pay for **book orders and penalties**; can be **split with UPI**; **can never be withdrawn or refunded as cash**; **all eligible refunds and credits are issued as account points**. Points are not used for courier charges | [GIVEN] |
| BR-24 | **Courier charges are borne by the Admin**, **managed separately on a per-trip basis**, depend on the Admin's negotiated deal, are **not charged to the reader or included in the Rs 1,000 order fee**, and are **not visible to the reader** | [GIVEN] |
| BR-25 | **Late penalty: Rs 10 per day, beginning the day immediately after the scheduled return date (including any approved one-week extension), for a maximum of 15 days: total Rs 150** | [GIVEN] |
| BR-26 | **Courier pickup delay:** **no late-return penalty applies if the courier fails to collect the book on the scheduled return date.** The **penalty start date is adjusted accordingly** | [GIVEN] (OQ-6) |
| BR-27 | If the book is **not returned within 10 days after the due date**, the account is **suspended until all outstanding penalties are cleared** | [GIVEN earlier, not withdrawn; carried forward] (OQ-1) |
| BR-28 | During suspension the reader **cannot log in or place new orders**, and **is still obligated to return the book** | [GIVEN] |
| BR-29 | If the book remains unreturned **15 days after the due date (10 penalty days + 5 additional days)**, **Admin blacklists the reader, closes the account and initiates a book recovery request** | [GIVEN] |
| BR-30 | The recovery request is a **one-time courier pickup**, **paid by the Admin**. **A scheduled pickup that does not take place is a failed pickup**; the **book's details are then archived from the catalogue** | [GIVEN] (OQ-7) |
| BR-31 | **Re-registration:** a **suspended/blacklisted reader can initiate re-registration only after 15 days**. The request is **raised separately** (for example by email to the Admin). **Admin verifies the request against the blacklist** and, **if matched, initiates re-registration once the reader agrees to return the issued book and clear outstanding dues**. When the copy is submitted, the **catalogue is updated to show the copy as available** | [GIVEN] (details: OQ-5) |
| BR-32 | **Order fees (when paid by UPI) and penalties (when paid by UPI) are collected manually** into the Admin account (for example UPI); **Admin verifies and confirms receipt** | [GIVEN] |
| BR-33 | A donated book is added to the available catalogue; the first order ships **from the donor's address**; if no request comes, it **stays at the donor's home** | [GIVEN] |
| BR-34 | **Sender address per shipment:** donor's address (first order); earlier reader's address (reader to reader); Buffer center address (shipment from the Buffer center) | [GIVEN] |
| BR-35 | **Buffer center details for courier requests: Admin's name, contact number and address** | [GIVEN] |
| BR-36 | **All courier shipments are arranged and managed manually by the Admin**, who **maintains sender/receiver names, contact numbers and addresses for each trip**. No courier integration | [GIVEN] |
| BR-37 | Readers never see donor, earlier-reader or next-reader names or locations | [GIVEN] |
| BR-38 | No paid application is integrated | [GIVEN] |

## 6. Core User Flows

### 6.1 Donor flow
1. Log in with email OTP; add a Pune address (society name, PIN code, Google Map location).
2. Admin validates the PIN code before the donation is processed.
3. Donor opens **Donate a Book** (pre-defined template, Section 12.4) and adds one or more books.
4. Each physical copy appears in the catalogue as *Available – at donor's home* (BR-33). The donor keeps it until a reader orders it.

### 6.2 Reader order flow
1. Reader logs in (email OTP) and adds a Pune address. Admin validates the PIN code before orders are processed.
2. Reader searches the catalogue.
   - **A copy is available** (donor's home or Buffer center) → *Order*. If the copy is at the Buffer center, the next reader in that copy's queue can order any time (BR-14).
   - **No copy available** → *Create wishlist against the title* (BR-11). **No fee is taken** (BR-20).
   - **Title has several copies and at least one is issued** → the first reader in the queue can place a **wishlist order**; the book ships automatically when a copy becomes available (BR-13).
3. When placing an order, the reader enters tentative borrowing days and a preferred time slot and pays the **Rs 1,000 order fee** with **points, UPI, or a split** (BR-19). UPI amounts are paid to the Admin account with a payment reference; Admin verifies (BR-32). [Fee taken when the order is placed: PROPOSED reading]
4. The order joins the **queue of a physical copy** (BR-12). How the copy is chosen when a title has several copies is open (OQ-4).
5. Admin arranges the courier manually, **bears the courier charge** (not shown to the reader), and **records the trip's sender and receiver names, contact numbers and addresses** (BR-24, BR-36).
6. The sender is chosen per BR-34 and is **not shown** to the reader.
7. The courier delivers. **Admin records the received date**, which starts the borrowing clock. The order is fulfilled and the Rs 1,000 is non-refundable (BR-18). [PROPOSED: "fulfilled" = delivered]

"Ships automatically" for a wishlist order is read as: **the system automatically creates the courier request in the Admin's task list** once a copy is available, and the Admin arranges the courier manually. [PROPOSED reading]

### 6.3 Order cancellation and archived copies

```
Reader cancels an order BEFORE DELIVERY (BR-21)
    → order is removed from the copy's queue
    → applicable order fee is credited back AS POINTS (never as cash)
    → Admin cancels the courier booking, if any

Ordered copy is ARCHIVED from the catalogue (BR-22)
    ├─ Other copies of the same title remain → order is RE-MATCHED to another eligible copy
    └─ No other copy of the title → order is UNFULFILLED → 1,000 points credited
```
After delivery, the order cannot be cancelled and the fee is non-refundable.

### 6.4 Borrowing, reminder, extension and return
```
Book received by borrower → Admin records received date → clock starts
    return date = received date + tentative days

Any time before the return date, reader MAY request the one-week extension (once per order)
    → return date +7 days; stays with this reader even if a queue exists

2 days before the (current) return date: reminder by email + in-app

On the scheduled return date:
    ├─ A reader is waiting in this copy's queue → courier collects from the reader's home and ships to the FIRST waiting reader (not before)
    └─ Nobody waiting
          ├─ App proposes one extra week, if the extension is unused
          │       ├─ Reader accepts → return date +7 days
          │       └─ Reader declines → courier collects, ships to BUFFER center (Admin pays)
          └─ Extension already used → courier collects, ships to BUFFER center (Admin pays)

If the courier does NOT collect on the scheduled return date:
    → no late-return penalty applies; the penalty start date is adjusted accordingly (BR-26)

Returned date = the date the courier collects the book from the reader (Admin records it)
```
The branch "extension already used, nobody waiting" is a **[PROPOSED]** reading of BR-09 and BR-17 together.

### 6.5 Late return, suspension, blacklist and recovery
```
Scheduled return date (including any approved extension; adjusted if the courier failed to collect) = day 0
 │
 ├─ From day 1: penalty Rs 10 per day, up to 15 days (Rs 150 maximum)
 │      penalty stops at the returned date (courier collects the book from the reader)
 │      penalties can be paid by points, UPI or a split
 │
 ├─ Book still not collected after 10 days (Rs 100 accrued) → account SUSPENDED   [carried forward, OQ-1]
 │      • cannot log in, cannot place new orders
 │      • must still return the book
 │      • lasts until ALL outstanding penalties are cleared
 │
 ├─ Book still not collected at 15 days (Rs 150 accrued) → Admin BLACKLISTS, CLOSES the account
 │      and INITIATES a ONE-TIME RECOVERY pickup request, Admin pays
 │             ├─ Pickup takes place → book returns to Buffer center
 │             └─ Scheduled pickup does not take place (= failed) → book ARCHIVED from catalogue
 │                    → orders for it are re-matched to another copy, or credited 1,000 points (BR-22)
 │
 └─ Book collected before day 15 → no blacklisting
        (account stays suspended, if suspended, until penalties are cleared)   [PROPOSED reading of BR-29]
```

### 6.6 Re-registration (BR-31)
```
Suspended / blacklisted reader waits until 15 days have passed          (counting start: OQ-5)
    │
Reader raises a SEPARATE request (for example email to the Admin)
    │
Admin verifies the request against the BLACKLIST
    ├─ No match → no re-registration
    └─ Matched  → Admin INITIATES re-registration ONCE the reader agrees to
                    (a) return the issued book, and
                    (b) clear outstanding dues
                       │
        Copy is submitted and dues are cleared                           [completion reading, OQ-5]
                       │
        Catalogue is updated: the copy is shown as AVAILABLE again
```
Dues can be cleared by points, UPI or a split (BR-23). Whether re-registration is completed at agreement or only after the copy is submitted and dues are cleared is **[OPEN – OQ-5]**; the second reading follows your earlier instruction.

### 6.7 Wishlist notification
When a copy of a wishlisted title becomes available, the reader is notified by email and in-app. [PROPOSED; follows the reminder rule]

## 7. Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Email OTP login for donors, readers and Admin | Must |
| FR-02 | Address capture (society name, Pune PIN code, Google Map link); Admin validation status; orders and donations processed only after validation | Must |
| FR-03 | Donor lists books via the fixed template; each physical copy gets its own ID | Must |
| FR-04 | Catalogue shows book name, category and availability only | Must |
| FR-05 | Search and filter by name, category/genre | Must |
| FR-06 | Title-level wishlist (no fee), fulfilled by any available copy of the title | Must |
| FR-07 | A separate first-come-first-served queue for each physical copy | Must |
| FR-08 | Wishlist order for a multi-copy title when at least one copy is issued and the reader is first in the queue | Must |
| FR-09 | Reader at the head of a copy's queue can order immediately when that copy is at the Buffer center | Must |
| FR-10 | Order with tentative days and time slot; Rs 1,000 order fee payable with points, UPI or a split | Must |
| FR-11 | Admin-configurable settings: order fee (default Rs 1,000), penalty per day (Rs 10), maximum penalty days (15), points per rupee (1) | Must |
| FR-12 | Manual UPI payment recording (payer enters reference; Admin verifies and confirms) for order fees and penalties, including the UPI part of split payments | Must |
| FR-13 | Points ledger: credits (cancellation, unfulfilled order) and debits (order fee, penalty); no expiry; no cash withdrawal or refund | Must |
| FR-14 | Order cancellation by the reader before delivery; credit of the applicable fee as points; removal from the copy's queue | Must |
| FR-15 | Re-matching an order to another eligible copy when its copy is archived and other copies of the title remain | Must |
| FR-16 | Admin console: courier task list with Google Map links; Admin records trip sender/receiver names, contact numbers and addresses | Must |
| FR-17 | Courier charges never shown on any reader-facing screen or message | Must |
| FR-18 | Sender chosen per BR-34 and hidden from readers | Must |
| FR-19 | Automatic creation of a courier request when a wishlist-ordered copy becomes available | Must |
| FR-20 | Admin records received date (starts clock), returned date (courier collection from the reader) and any courier failure to collect on the scheduled return date | Must |
| FR-21 | Reminder two days before the return date, by email and in-app | Must |
| FR-22 | One-week extension, once per order, on the borrower's request | Must |
| FR-23 | Proposal of one extra week when nobody is waiting | Must |
| FR-24 | On the return date: schedule pickup and shipment to the first waiting reader, or to the Buffer center | Must |
| FR-25 | Penalty calculation: Rs 10 per day from the day after the return date (including extension), maximum 15 days, Rs 150 total; start date adjusted for courier failure; ledger | Must |
| FR-26 | Automatic suspension after 10 days late; lifted only when Admin confirms all penalties cleared; suspended users cannot log in or order | Must |
| FR-27 | Day-15 flag for Admin to blacklist, close the account and initiate a recovery request | Must |
| FR-28 | Admin action: one-time recovery request; mark a scheduled pickup that did not take place as failed; archive the book | Must |
| FR-29 | Blacklist register; re-registration request log (received date, 15-day check, blacklist match, reader agreement, dues cleared, copy submitted, outcome) | Must |
| FR-30 | On copy submission: catalogue updated to show the copy as available | Must |
| FR-31 | Admin-only register of book locations, readers and donors | Must |
| FR-32 | Buffer center inventory view | Must |
| FR-33 | Wishlist-match notification by email and in-app | Should |
| FR-34 | Audit log and admin reports | Should |

## 8. Penalty and Account Status Reference

| Days after the scheduled return date (adjusted for courier failure; book not yet collected) | Penalty accrued | Account status |
|---|---|---|
| 0 | None | Active |
| 1 to 10 | Rs 10 per day (Rs 10 to Rs 100) | Active until day 10; **suspended after day 10** until all outstanding penalties are cleared (OQ-1) |
| 11 to 15 | Rs 110 to Rs 150 | Suspended; no login, no new orders; return obligation continues |
| 15 (still not collected) | **Rs 150 (maximum)** | **Blacklisted and closed** by Admin; **recovery request initiated** (one-time pickup, Admin pays); book archived if the scheduled pickup does not take place |
| Re-registration request | Raised only after 15 days; Admin verifies against blacklist | Initiated once the reader agrees to return the book and clear dues; copy shown as available once submitted |

## 9. Privacy and Data Visibility

### 9.1 Who can see what

| Data | Reader | Donor | Courier | Admin |
|---|---|---|---|---|
| Book name, category, availability | Yes | Yes | No | Yes |
| Donor name / contact / address | **No** | Own only | Only as sender on that trip | Yes |
| Earlier reader's name / contact / address | **No** | **No** | Only as sender on that trip | Yes |
| Next reader's details | **No** (returning reader) | No | Only as receiver on that trip | Yes |
| Own profile, loan, penalty, points, account status | Own only | No | Own trip details only | Yes |
| **Courier charges** | **No** | **No** | n/a | Yes |
| Status of a donated book | n/a | Status only, no reader details [PROPOSED] | n/a | Yes |
| Payment, penalty, suspension, blacklist, re-registration, trip records | Own only (payment, points, penalty) | No | No | Yes |

Couriers cannot deliver without pickup and drop addresses and mobile numbers. The Admin gives them to the courier only for that single trip and maintains the trip record (BR-36). This is the one unavoidable exception to "no personal data exposed" and needs confirmation (OQ-10).

### 9.2 Rules
| Rule | Detail |
|---|---|
| P-1 | The public catalogue shows no identity data. |
| P-2 | Reader screens, emails and notifications never show ship-from or next-reader names or locations, or courier charges. |
| P-3 | OTP, reminder and wishlist emails contain no donor or earlier-reader information. |
| P-4 | Role-based access; the database is never public; only Admin can open the data store directly. |
| P-5 | Login OTPs expire and have attempt limits; OTP values are not stored in readable form. Exact limits set at design time. |
| P-6 | Mobile numbers are collected only for courier trips and are not OTP-verified (OQ-2). |
| P-7 | Re-registration requests arrive by email to the Admin and contain personal data; they are handled only by the Admin and logged in the re-registration register. |
| P-8 | Retention, deletion and legal compliance (for example India's Digital Personal Data Protection Act, 2023), including how long blacklist records are kept, should be reviewed with a qualified legal advisor. **[OPEN – OQ-10]** |

## 10. Technology Suggestion (free only)

I cannot confirm current free quotas, so **please verify each limit on the provider's site**.

| Layer | Tool | Free-use caveat |
|---|---|---|
| Front-end | Static HTML/CSS/JS, mobile-friendly, on GitHub Pages, Netlify, Cloudflare Pages or Firebase Hosting | Verify limits |
| Database | **Google Sheets**, one tab per entity in Section 12, private to Admin | Not designed for strict security or large scale; fine for a trial |
| Back-end logic | **Google Apps Script** web app | Quotas apply. Because the web app is reachable from the internet, **every request must verify the user's session and role in code** |
| Email OTP login | OTP generated and emailed by Apps Script (`MailApp` / `GmailApp`); session token after verification | **A daily email quota applies, shared with reminders and notifications.** Verify the quota; it may limit daily logins and reminders |
| Reminders, penalty, suspension, day-15 and 15-day re-registration checks | **Apps Script time-driven triggers** (for example daily) | Runtime quotas apply |
| In-app notifications | Notification list on the website | Free |
| Re-registration requests | Email to the Admin's mailbox, logged by the Admin in the register tab | Free; manual |
| Maps | Google Map **links**: `https://www.google.com/maps/search/?api=1&query=<latitude>,<longitude>` | No API key needed. Embedded maps or autocomplete need an API key and billing-enabled project, so not proposed |
| Payments | Manual UPI to the Admin account; payer enters the reference; Admin confirms. Points are debited by the system | No gateway fees; reconciliation is manual |
| Points | A ledger tab in the same sheet; balance computed from credits and debits | Free |
| Courier | Manual arrangement and payment by Admin on the courier's own app or channel; charges kept outside reader-facing data | No integration |
| PIN validation | Manual by Admin (status field on each address) | No list or paid service needed |

## 11. Courier Request Details [GIVEN]

The system prepares these details in the Admin's task list; the Admin arranges the courier (Porter or another service) manually, bears its charge, and keeps the trip record.

| Field | Description |
|---|---|
| **Pick up book from – Start_Location** | Sender address with Google Map link |
| **Drop book to – End_Location** | Receiver address with Google Map link |
| **Timing** | Requested pickup/drop time |
| **Donor_Name** | Name of the sender on that trip |
| **Donor_MNo** | Mobile number of the sender |
| **Receiver_Name** | Name of the receiver |
| **Receiver_MNo** | Mobile number of the receiver |

### Sender, receiver and costs (BR-18, BR-24, BR-34, BR-35)

| Scenario | Start_Location (sender) | End_Location (receiver) | Courier charge borne by | Order fee (Rs 1,000) |
|---|---|---|---|---|
| First order of a donated book | Donor's address | Ordering reader's address | **Admin** | Ordering reader |
| Reader to next waiting reader (on current reader's return date) | Current reader's address | Next reader's address | **Admin** | Next reader |
| Order served from the Buffer center | Buffer center (**Admin's name, number, address**) | Reader's address | **Admin** | Reader |
| Return to Buffer center | Reader's address | Buffer center (**Admin's name, number, address**) | **Admin** | n/a |
| Recovery from a blacklisted reader (one time) | Blacklisted reader's address | Buffer center (**Admin's name, number, address**) | **Admin** | n/a |
| Copy submission during re-registration | Re-registering reader's address | Buffer center (**Admin's name, number, address**) | **Admin** [PROPOSED, from BR-24] | n/a |

"Donor_Name" and "Donor_MNo" are treated as the **sender** of that trip.

## 12. Data Model

Fields marked [GIVEN] came from you. Others are [PROPOSED].

### 12.1 Donor
| Field | Source |
|---|---|
| Donor_Name | [GIVEN] |
| Book name | [GIVEN] |
| Email (login) | [GIVEN] |
| Mobile number (courier trips) | [GIVEN, from the courier fields] |
| Donor_Location: society name, PIN code, Google Map link | [GIVEN] |
| Address validation status, validated by Admin on (date) | [PROPOSED] |
| Donor_ID | [PROPOSED] |

### 12.2 Reader account
| Field | Source |
|---|---|
| Reader_Name | [GIVEN] |
| Interest to read, books like… | [GIVEN] |
| Genre of interested book | [GIVEN] |
| Available reading time | [GIVEN] |
| Email (login and reminders) | [GIVEN] |
| Mobile number (courier trips) | [GIVEN, from the courier fields] |
| Reader_Location: society name, PIN code, Google Map link | [GIVEN] |
| Address validation status | [PROPOSED] |
| Points balance (never expires; never cash-withdrawable) | [GIVEN rule; field PROPOSED] |
| Reader_ID, Account status (Active / Suspended / Blacklisted-closed / Re-registration in progress) | [PROPOSED] |

### 12.3 Store (Buffer center)
| Field | Source |
|---|---|
| Location (fixed address) with Google Map link | [GIVEN] |
| Contact: **Admin's name, contact number and address** | [GIVEN] |
| Buffer Books available | [GIVEN] |

### 12.4 Catalogue (pre-defined donor template)
Each row is **one physical copy**; the title groups copies for wishlists.

| Field | Source |
|---|---|
| Book name | [GIVEN] |
| Book_Category | [GIVEN] |
| Copy ID | [PROPOSED] |
| Status: Available / Reserved / In transit / With reader / In Buffer center / Archived | [PROPOSED] |
| Current location type: Donor's home / Reader's home / Buffer center | [PROPOSED] |

### 12.5 Title wishlist [PROPOSED]
Reader_ID, Book name (title), Genre, Date and time created, Status (Waiting / Converted to order / Cancelled).

### 12.6 Copy queue [PROPOSED]
Copy ID, Order_ID, Reader_ID, Date and time joined (first-come-first-served), Wishlist-order flag, Status (Waiting / Next eligible / Served / Removed on cancellation / Re-matched).

### 12.7 Book location register [GIVEN as requirement, structure PROPOSED]
Copy ID, Location type, Location reference with Google Map link, Current holder ID, Last updated. **Admin only.**

### 12.8 Loan [PROPOSED]
Loan_ID, Copy ID, Reader_ID, Tentative days, **Received date (entered by Admin)**, Return date, Extension used (Yes/No; 7 days), **Scheduled collection date**, **Courier failed to collect (Yes/No, date)**, **Returned date (courier collection from the reader, entered by Admin)**, Penalty start date (adjusted), Days late (maximum 15), Penalty accrued (maximum Rs 150), Status.

### 12.9 Orders [PROPOSED]
Order_ID, Reader_ID, Book title / Copy ID, Order fee (Rs 1,000), Paid by (Points / UPI / Split), Points part, UPI part, Status (Placed / Fulfilled / Cancelled before delivery / Unfulfilled-credited / Re-matched), Placed on, Fulfilled on.

### 12.10 Payments (UPI) [PROPOSED]
Payment_ID, Payer, Purpose (Order fee / Penalty), Amount, UPI reference entered by payer, Verified by Admin (Yes/No), Date confirmed.

### 12.11 Points ledger [PROPOSED]
Entry ID, Reader_ID, Order ID, Type (Credit: cancellation / Credit: unfulfilled order / Debit: order fee / Debit: penalty), Points, Date. No expiry field; no withdrawal entries.

### 12.12 Settings [PROPOSED]
Order fee (Rs 1,000), points per rupee (1), penalty per day (Rs 10), maximum penalty days (15).

### 12.13 Sanctions [PROPOSED]
Reader_ID, Loan_ID, Suspended on, Suspension lifted on, Day-15 flag date, Blacklisted on, Recovery request initiated on, Recovery pickup scheduled for, Recovery outcome (Took place / Failed), Archived (Yes/No).

### 12.14 Re-registration register [PROPOSED]
Request ID, Request received on (email), Date eligible (after 15 days), Matched against blacklist (Yes/No), Reader agreed to return the book and clear dues (Yes/No, date), Dues cleared (Yes/No), Copy submitted (Yes/No, date), Catalogue updated on, Outcome, Handled by Admin.

### 12.15 Courier trip record (maintained by Admin) [GIVEN fields, structure PROPOSED]
Trip ID, Copy ID, Scenario (Section 11), Sender name, Sender contact number, Sender address with map link, Receiver name, Receiver contact number, Receiver address with map link, Time slot, Arranged (Yes/No), Pickup took place (Yes/No). **Courier charge is not stored in any reader-facing data**; whether the Admin keeps an Admin-only note of it is optional.

## 13. Order and Loan Lifecycle [PROPOSED]

`Address PIN validated by Admin → Order or wishlist order placed (Rs 1,000 by points, UPI or split) → Joins a copy's queue → Admin arranges courier at Admin's cost and records trip → Delivered: order fulfilled, fee non-refundable (Admin records received date; clock starts) → [Extension, once] → Reminder (return date − 2 days) → Return date: courier collects from reader (returned date) and ships to next reader in the copy's queue OR to Buffer center`

Cancellation path: `Cancelled before delivery → applicable fee credited as points → removed from copy queue`

Archive path: `Ordered copy archived → other copies remain: re-match to another eligible copy; none remain: unfulfilled, 1,000 points credited`

Courier-failure path: `Courier fails to collect on scheduled return date → no penalty; penalty start date adjusted`

Late path: `Overdue (Rs 10/day from day 1, up to 15 days = Rs 150) → Suspended after day 10 (until penalties cleared) → Day 15: Admin blacklists, closes account, initiates recovery request → One-time pickup → Returned to Buffer center OR (scheduled pickup did not take place) Archived`

Re-registration path: `After 15 days → separate request to Admin → verified against blacklist → reader agrees to return book and clear dues → Admin initiates re-registration → copy submitted, dues cleared → catalogue shows the copy as available`

## 14. Non-Functional Requirements

| Area | Requirement |
|---|---|
| Deployability | Public website on free hosting |
| Coverage | Pune only |
| Cost | No paid application, payment gateway, courier integration or SMS |
| Security | HTTPS; role-based access verified on every request; private data store; login OTP expiry and attempt limits |
| Usability | Mobile-first, simple forms |
| Auditability | Log every address validation, payment confirmation, points credit and debit, cancellation, extension, courier failure, penalty, suspension, blacklist, re-registration step, courier trip and Admin-entered date with timestamp and who entered it |
| Scalability | Sized for a trial; re-evaluate after OQ-11 |

## 15. Screens [PROPOSED]

1. Email OTP login
2. Donor: address, *Donate a Book*, *My donations* (status only)
3. Reader: profile and address, catalogue search, title wishlist, order and fee payment (points / UPI / split), *Cancel order* (before delivery), points balance, *My loans* (return date, extend, penalty and payment)
4. Admin: address validation, UPI payment verification, courier task list and trip records, received/returned/courier-failure entry, overdue list, suspensions, day-15 blacklist queue, recovery requests, re-registration register, points credits, copy queues, Buffer center inventory, location register, settings

## 16. Delivery Phases [PROPOSED]

| Phase | Scope |
|---|---|
| 0 – Feasibility | Check the email quota against expected OTPs and reminders |
| 1 – Foundation | Email OTP login, address capture and Admin PIN validation, donor template (per-copy catalogue), location register |
| 2 – Ordering | Reader profile, title wishlist, per-copy queues, Buffer-center ordering, Rs 1,000 order fee by points / UPI / split, points ledger, cancellation, archive re-matching, Admin courier task list and trip records |
| 3 – Lending rules | Admin-entered received/returned dates, reminders, single extension, return-date dispatch, courier-failure penalty adjustment |
| 4 – Enforcement | Penalty ledger (15 days, Rs 150, payable by points or UPI), suspension, day-15 blacklist, recovery request, archive and points credit, re-registration register |
| 5 – Hardening | Privacy review, Admin reports |

## 17. Acceptance Criteria (Summary)

- Users register and log in with email OTP only; no OTP goes to mobile numbers and no OTP is used for couriers.
- Readers and donors give a society name, Pune PIN code and Google Map location; Admin validates the PIN code before orders or donations are processed.
- Every order carries a fixed fee of Rs 1,000, payable by points, UPI or a split; the fee is non-refundable once the order is fulfilled.
- A reader can cancel an order before delivery; the applicable fee is credited back as points.
- Points never expire, can pay for orders and penalties, and can never be withdrawn or refunded as cash; every refund or credit is issued as points.
- If a copy is archived and other copies of the title remain, the order is re-matched to another eligible copy; if none remain, 1,000 points are credited.
- Each physical copy has its own first-come-first-served queue that determines the next eligible reader.
- No fee is taken when a wishlist is created or when a copy is allocated.
- Courier charges are borne by the Admin, are separate from the Rs 1,000, and never appear to readers.
- The reader sees only the book and their own delivery details; never donor, earlier-reader or next-reader names or locations.
- Admin records the received date (starts the clock) and the returned date (courier collects the book from the reader).
- A reader can extend once by seven days, even if others are queued.
- Penalty is Rs 10 per day from the day after the return date (including any extension) for up to 15 days, Rs 150 in total; if the courier fails to collect on the scheduled return date, no penalty applies and the start date is adjusted.
- After 10 days late the account is suspended until penalties are cleared; the return obligation continues.
- At 15 days with the book not collected, Admin blacklists the reader, closes the account and initiates a one-time recovery pickup at Admin's cost; a scheduled pickup that does not take place is a failed pickup and the book is archived.
- A suspended/blacklisted reader can ask for re-registration only after 15 days, by a separate request; Admin verifies it against the blacklist and initiates re-registration once the reader agrees to return the book and clear dues; the catalogue then shows the copy as available.
- Admin maintains sender/receiver names, contact numbers and addresses for each courier trip; the Buffer center is represented by the Admin's name, number and address.

## 18. Interpretations Made in This Version (please confirm)

1. **Courier charge visibility:** "managed by the admin and reader can't see it" is read as: the **Admin manages it; the reader cannot see it**.
2. **Courier charge payer:** the Admin bears all courier charges, so the earlier rule "reader pays the courier charge in advance" is **withdrawn**, for every trip.
3. **When the Rs 1,000 is taken:** at the moment an order (including a wishlist order) is placed, not at creating a wishlist or allocating a copy.
4. **"Fulfilled":** an order is fulfilled when the book is delivered to the borrower (the received date). Cancellation is possible only before that.
5. A **wishlist** (free, title-level) is different from a **wishlist order** (placed by the first reader in the queue, with the fee).
6. **Queues:** the title-level wishlist (BR-11) and the per-copy queue (BR-12) are reconciled as: a wishlist is a title-level request, and each order sits in a physical copy's queue; how a reader is assigned to a copy is open (OQ-4).
7. "Ships automatically" for a wishlist order means the system creates the courier request in the Admin's task list, and the Admin arranges the courier manually.
8. The single one-week extension covers both a reader-initiated request and the app's proposed extra week.
9. If the extension is already used and nobody is waiting, the book goes to the Buffer center.
10. If the book is collected before day 15, there is no blacklisting, the penalty stops at the collection date, and any suspension continues until penalties are cleared.
11. "Failed pickup" (BR-30) is applied to the one-time recovery pickup. For ordinary pickups that do not take place on the return date, BR-26 removes the penalty; rescheduling is open (OQ-7).
12. Suspension after 10 days late (stated earlier) still applies; your re-registration answer mentions suspended readers, which fits.
13. "Previous due" and "outstanding dues" for re-registration are the penalty accrued (up to Rs 150), payable by points, UPI or a split.
14. Re-registration is completed (account reopened) only when the copy is submitted and dues are cleared, as stated earlier; Admin "initiates" it at the reader's agreement.
15. The courier trip to collect the issued book during re-registration is arranged and paid by the Admin, following BR-24.
16. A cancelled order is removed from the copy's queue, the next reader moves up, and the Admin cancels any courier booking.
17. If the courier fails to collect on the scheduled return date, the Admin records it and the penalty start date moves by the delay; the 10-day suspension and 15-day blacklisting are counted from the same adjusted date (OQ-6).

## 19. Open Questions (not assumed)

| ID | Question |
|---|---|
| OQ-1 | **Suspension trigger:** Is suspension still triggered after day 10 (with blacklisting at day 15), given the penalty runs 15 days? |
| OQ-2 | **Mobile numbers and email OTP:** Is it acceptable that mobile numbers are collected for courier trips but never OTP-verified? Is the Gmail/Apps Script daily email quota (to be verified) acceptable for a trial? |
| OQ-3 | **Address checks:** Is the society name free text? What does Admin check when validating a PIN code: only that it is a Pune-area PIN, or also the society name and map link? |
| OQ-4 | **Queue assignment:** When a title has several copies, how is a reader placed in a particular copy's queue (for example the copy due back soonest, or the shortest queue)? If another copy becomes available first, is the reader moved to it? |
| OQ-5 | **Re-registration details:** The 15 days count from what: suspension date, due date or blacklisting date? How does this apply to a merely suspended (not closed) account? Which details does the Admin match against the blacklist (email, mobile, address)? Is the account reopened when the reader agrees, or only after the copy is submitted and dues are cleared? Is it the same account (with its points) or a new one? What happens to the points of a closed account, and can points offset dues? |
| OQ-6 | **Courier delay:** Who decides that the courier (not the reader) caused the failed collection (for example the Admin on the courier's report)? Is the penalty start date moved by the number of delay days, and do the 10-day suspension and 15-day blacklisting move with it? |
| OQ-7 | **Failed pickups outside recovery:** If an ordinary scheduled pickup does not take place, is it rescheduled and who is notified? Is there a deadline for the recovery pickup? |
| OQ-8 | **Cancellation edge case:** If a reader cancels after the courier has already collected the book (in transit), how is the book redirected, and at whose cost (assumed Admin)? |
| OQ-9 | **Restored copy:** If an archived copy is restored through re-registration and orders were already credited with points, do those orders stay credited? |
| OQ-10 | Is it acceptable that the courier receives names, mobile numbers and addresses per trip? Retention (including blacklist records) and legal review. |
| OQ-11 | Expected trial size: users, books and orders per month. |
| OQ-12 | After the extension is used, does the "two days before" reminder repeat for the new return date? Is the extension approved automatically or by Admin ("approved one-week extension")? |
| OQ-13 | What if a donor does not hand over a requested book from their home, or a book arrives damaged or is lost? |
| OQ-14 | Language(s) of the website (English, Marathi, Hindi)? |
