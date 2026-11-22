# Pune Community Library: trial app

Two files run the app: `server.js` (back end, no npm packages) and `index.html` (website). Data is saved in `data.json`, created on first run.

## 1. Run it on your computer

1. Install Node.js 18 or newer from https://nodejs.org.
2. Open a terminal in this folder and run:
   - Mac/Linux: `ADMIN_EMAIL=you@example.com SHOW_OTP=1 node server.js`
   - Windows PowerShell: `$env:ADMIN_EMAIL="you@example.com"; $env:SHOW_OTP="1"; node server.js`
3. Open http://localhost:3000.
4. Log in with your `ADMIN_EMAIL`. The code is shown on the page (test mode) and printed in the terminal. That account becomes the Admin.
5. Test the flow with other emails (use a private window for each): a donor adds a book, the Admin approves addresses, a reader orders, the Admin confirms UPI, marks shipped, records delivery, then records courier collection.

`SHOW_OTP=1` is for testing only. Never use it on a public site.

## 2. What is built

Email OTP login, Admin-validated Pune addresses, donor book list, title catalogue (no personal data shown), wishlist, Rs 1,000 order fee by points and/or UPI, per-copy queues, cancel before shipping (points credited), archived copy re-matching, received/collected dates, one-week extension, Rs 10 per day penalty (maximum 15 days), suspension after 10 days, blacklist at 15 days, re-registration checks, courier task list with pickup/drop details and map links. Courier charges are never stored or shown.

Not built yet: real email sending, reminder emails, wishlist match emails, paying penalties with points from the screen, audit log, Admin-entered donor-handover failures.

## 3. Deploy it (trial)

The app needs a host that runs Node.js and keeps `data.json` between restarts.

**Option A: a Node.js web host (Render, Railway, Fly.io or similar)**
1. Put this folder in a private GitHub repository. Add a `.gitignore` with `data.json` (it holds personal data).
2. Create a new Web Service from the repository. Build command: leave empty. Start command: `node server.js`.
3. Set the environment variable `ADMIN_EMAIL`. Do not set `SHOW_OTP`.
4. The host gives you an HTTPS address.
5. Check the plan's current free limits and whether disk storage persists. Many free plans erase files on restart, which would delete `data.json`. If so, attach a persistent disk (may be paid) or use Option B.

**Option B: your own always-on computer plus a free tunnel**
1. Run `node server.js` with `ADMIN_EMAIL` set, on a computer that stays on.
2. Use a tunnel service such as Cloudflare Tunnel to publish it over HTTPS (check its current terms).
3. Back up `data.json` regularly.

## 4. Before real users

1. **Send OTPs by email.** Right now codes only appear in the server window. Run `npm install nodemailer`, then in `server.js` after the `console.log('OTP for ...')` line add:
```js
const mail=require('nodemailer').createTransport({service:'gmail',auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}});
mail.sendMail({from:process.env.SMTP_USER,to:e,subject:'Your library code',text:'Your code is '+code});
```
   Set `SMTP_USER` and `SMTP_PASS` (a Gmail app password). Check Gmail's daily sending limit.
2. Back up `data.json`; keep it out of public folders and Git.
3. Get the privacy rules reviewed by a qualified legal advisor.
4. Open questions still on the PRD list (language, trial size, damaged or lost books) can be added later.
