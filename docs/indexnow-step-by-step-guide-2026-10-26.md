# IndexNow Step by Step Guide for SupplementDecoded

Prepared: October 26, 2026
Website: https://www.supplementdecoded.com/
Host to use in every IndexNow request: www.supplementdecoded.com

## Purpose

IndexNow tells participating search engines, including Bing, that a page has been added, updated, or deleted. It is meant to reduce the delay before a search engine schedules a crawl.

IndexNow does not guarantee that a page will be crawled, indexed, or ranked. It only proves that the site submitted the URL and gives the search engine an early signal.

## Who does what

### Developer
1. Host the IndexNow key file correctly at the root of the website.
2. Fix the current redirect that prevents the key file from being read.
3. Deploy the fix.
4. Confirm to Rahul only after the public key address passes the checks in Step 7.

### Rahul
1. Send this guide to the developer.
2. Tell Muse when the developer says the key file is live.
3. Do not send the key as a password or use it for any login. It is an IndexNow ownership key only.

### Muse
1. Verify the public key file directly.
2. Send one test URL.
3. Submit all current sitemap URLs once.
4. Record every submission and response in the IndexNow tracker.
5. Submit future published or materially updated article URLs.
6. Track the effect in Bing Webmaster Tools.

---

# PART A: DEVELOPER SETUP

## Step 1: Use the existing key

Use this exact IndexNow key:

`e7e4a887634ba2e69a2c6e9c68029e30`

Do not generate a different key unless Rahul and Muse agree first. If the key changes, the public key file, every future submission, and the tracker must all change together.

The key is not a website password and does not provide admin access. By design, search engines read it from a public text file to confirm that submissions come from the site owner.

## Step 2: Create the key file

Create a plain text file with this exact name:

`e7e4a887634ba2e69a2c6e9c68029e30.txt`

The filename has two parts:
- The exact key
- The `.txt` extension

Do not remove the dot before `txt`.
Do not rename the file to an extensionless name.
Do not change any character in the key.
Do not use uppercase letters in the filename.

## Step 3: Put only the key inside the file

The file must contain only this string:

`e7e4a887634ba2e69a2c6e9c68029e30`

Do not add:
- A heading
- A label such as "IndexNow key:"
- Quotation marks
- HTML
- Extra words
- Extra keys
- Comments

Save the file as UTF-8 plain text.

## Step 4: Place the file in the Next.js public folder

Put the file directly in the site's `public` folder:

```text
public/
  e7e4a887634ba2e69a2c6e9c68029e30.txt
```

Do not place it in:
- The app router folder
- An API route
- A private server folder
- `public/keys`
- A folder that requires login

When placed correctly, it must be available at this public address:

`https://www.supplementdecoded.com/e7e4a887634ba2e69a2c6e9c68029e30.txt`

## Step 5: Deploy the file to production

Deploy the change to the live SupplementDecoded website.

A local build, a preview deployment, or a staging address is not enough. The file must work on the production `www.supplementdecoded.com` host.

After deployment, purge any CDN, hosting, or application cache that may still return the old redirect response for this address.

## Step 6: Fix the current redirect problem

Current live problem found on October 26, 2026:

- Requesting the correct `.txt` address returns HTTP 307.
- It redirects to the same filename without the dot before `txt`.
- That redirected address returns HTTP 404 and an HTML page.
- The response body is not the key.

This means the key file is not valid for IndexNow yet.

Check these possible causes:
1. A redirect rule removes file extensions.
2. A rewrite rule sends unknown paths to a page route.
3. Middleware intercepts static text files.
4. A catch-all route handles the request before the public file is served.
5. A trailing slash or clean URL rule changes the filename.
6. The deployed production build does not include the file in `public`.
7. A CDN or host cache is still serving the old redirect.

The required fix is simple: the exact `.txt` address must serve the file directly. Do not solve the problem by renaming the file to the extensionless address, because IndexNow expects the key file address used in the submission to contain the key filename and `.txt` extension.

If middleware or redirect rules are present, exclude this exact key file from those rules.

## Step 7: Developer verification before saying it is done

The developer must test the production address from outside the local development environment.

### Browser test

Open:

`https://www.supplementdecoded.com/e7e4a887634ba2e69a2c6e9c68029e30.txt`

The browser must show only the key as plain text. It must not show the SupplementDecoded website, a 404 page, or any HTML page.

### Header test

Run:

```bash
curl -I "https://www.supplementdecoded.com/e7e4a887634ba2e69a2c6e9c68029e30.txt"
```

Required result:
- HTTP 200
- Content-Type begins with `text/plain`
- No `Location` redirect header

### Body test

Run:

```bash
curl "https://www.supplementdecoded.com/e7e4a887634ba2e69a2c6e9c68029e30.txt"
```

Required result: the response body is exactly the key and nothing else.

### No-redirect test

Run:

```bash
curl -sS --max-redirs 0 -o /dev/null -w "%{http_code} %{content_type} %{redirect_url}\n" "https://www.supplementdecoded.com/e7e4a887634ba2e69a2c6e9c68029e30.txt"
```

Required result:
- Code `200`
- Content type `text/plain`
- Redirect URL empty

The task is complete only when all four conditions are true at the same time:
1. HTTP 200
2. `text/plain`
3. Body exactly matches the key
4. No redirect

## Step 8: Developer confirmation message

After the checks pass, the developer should send Rahul a confirmation in this form:

> IndexNow key file is deployed on production. The public `.txt` address returns HTTP 200, serves plain text, returns the exact key, and does not redirect.

The developer does not need to build IndexNow submission automation. Muse will handle the first test, the first bulk submission, and the tracking.

---

# PART B: FIRST SUBMISSION AFTER THE KEY IS LIVE

Do not submit URLs before Part A passes. Search engines will reject the key validation while the key file redirects or returns HTML.

## Step 9: Rahul tells Muse the key is live

Rahul should tell Muse:

> The developer says the IndexNow key file is live. Please verify and submit.

That message starts the checks below.

## Step 10: Muse verifies the key independently

Muse will request the public `.txt` address without following redirects and confirm:
- HTTP 200
- `text/plain`
- Exact key in the body
- No redirect target

If any check fails, Muse will not submit URLs. Muse will report the exact failed check so the developer can fix that specific problem.

## Step 11: Muse sends one test URL

Muse will submit the homepage first as a single test.

Example request format:

```text
https://api.indexnow.org/indexnow?url=https%3A%2F%2Fwww.supplementdecoded.com%2F&key=e7e4a887634ba2e69a2c6e9c68029e30
```

Expected result:
- HTTP 200 means the URL was received.
- HTTP 202 can happen on the first request and means the URL was received while key validation is pending.

Muse will record the test date, time, URL, endpoint, and HTTP response in the IndexNow tracker.

If the test returns 403, the key file or key value is still wrong. Muse will stop and report it instead of sending the full site list.

## Step 12: Muse submits the full sitemap once

After the test is accepted, Muse will:
1. Download `https://www.supplementdecoded.com/sitemap.xml`.
2. Extract every `<loc>` URL.
3. Remove duplicates.
4. Confirm every URL belongs to `www.supplementdecoded.com`.
5. Confirm the URLs use the live canonical form.
6. Submit the full list in one POST request to `https://api.indexnow.org/indexnow`.

The sitemap contained 92 URLs when this guide was prepared on October 26, 2026. Muse will use the live count at the time of submission, not assume that 92 is still correct.

POST format:

```json
{
  "host": "www.supplementdecoded.com",
  "key": "e7e4a887634ba2e69a2c6e9c68029e30",
  "keyLocation": "https://www.supplementdecoded.com/e7e4a887634ba2e69a2c6e9c68029e30.txt",
  "urlList": [
    "https://www.supplementdecoded.com/example-page-1",
    "https://www.supplementdecoded.com/example-page-2"
  ]
}
```

The real submission will replace the two example URLs with every live sitemap URL.

IndexNow allows up to 10,000 URLs in one POST request, so the complete SupplementDecoded sitemap fits in one request.

## Step 13: Record the bulk submission

Muse will add the following details to the IndexNow tracker:
- Submission date and Nepal time
- Reason: first full sitemap submission
- Number of URLs submitted
- Endpoint used
- HTTP response code
- Any error message
- Sitemap URL count at the time
- Whether the submission needs a follow-up check

A successful HTTP 200 or 202 response means the search engines received the list. It does not mean the pages are indexed.

---

# PART C: WHAT EACH API RESPONSE MEANS

## HTTP 200: OK
The URL or URL list was received successfully. No further action is needed for that submission.

## HTTP 202: Accepted
The URL or URL list was received, and IndexNow key validation is pending. This is a normal first response. Record it and continue with the planned checks.

## HTTP 400: Bad Request
The request format is invalid. Check the URL encoding, JSON structure, field names, and content type. Fix the request before resending.

## HTTP 403: Forbidden
The key is not valid. The usual causes are:
- Key file not found
- Key file redirects
- Key file returns HTML
- Key in the file does not match the key in the request

Stop bulk submission and fix the key file first.

## HTTP 422: Unprocessable Entity
A submitted URL does not belong to the stated host, or the key setup does not match the protocol. Check for:
- Non-www URLs mixed with www URLs
- URLs from another domain
- A wrong host value
- A wrong keyLocation value

## HTTP 429: Too Many Requests
The endpoint is rate limiting the submissions. Stop, record the response, and retry later. Do not loop repeated submissions.

---

# PART D: FUTURE ARTICLE SUBMISSIONS

## Step 14: Submit only pages that changed

After the first bulk submission, do not submit the whole sitemap after every article.

Submit a URL when:
- A new article is published
- An existing page is materially updated
- A page is deleted
- A page moves and its old or new URL needs a change notification

Do not submit:
- Draft pages
- Admin URLs
- API URLs
- Unchanged pages again and again
- Duplicate www and non-www versions of the same page
- Pages that have not been verified live

## Step 15: Verify the page before submitting it

Before Muse submits a new article URL, Muse will confirm:
1. The article returns HTTP 200.
2. The URL is the canonical public URL.
3. The page is present in the sitemap, when it is a normal published page.
4. The URL belongs to `www.supplementdecoded.com`.

Then Muse will submit only that changed URL and log the API response in the tracker.

## Step 16: If an IndexNow submission fails

An IndexNow failure must not block article publication.

Muse will:
1. Record the failed URL, date, and HTTP response.
2. Identify whether the failure is a key problem, a request format problem, a host mismatch, or a rate limit.
3. Report a key problem to Rahul for the developer.
4. Retry a rate-limited submission later, without repeated looping.

---

# PART E: HOW TO TRACK WHETHER INDEXNOW IS HELPING

## Step 17: Understand the limit of IndexNow tracking

There is no IndexNow dashboard that shows which submitted pages Bing later crawled or indexed.

Tracking therefore has three layers:
1. Key health: the public key file still returns the correct response.
2. Submission proof: the IndexNow API returned HTTP 200 or 202 for a recorded URL list.
3. Search result: Bing Webmaster Tools shows whether crawl and index status later change.

All three layers matter. An API success alone does not prove indexing.

## Step 18: Use the baseline recorded before IndexNow

Bing baseline on October 26, 2026:
- Sitemap status: Success
- Sitemap errors: 0
- Sitemap warnings: 0
- Last sitemap crawl in Bing: October 23, 2026
- URLs discovered by Bing from the sitemap: 82
- Live sitemap URLs: 92
- Bing Search Performance: 0 clicks and 0 impressions
- Sample inspected pages: mainly "Discovered but not crawled"

This baseline makes later change measurable.

## Step 19: Check again after the first bulk submission

Muse will check:
- After 48 to 72 hours: whether the tracker needs an update, whether Bing sitemap information changed, and whether sample URL Inspection statuses changed.
- After 7 days: sitemap last crawl date, discovered URL count, Search Performance, and sample URL Inspection statuses.
- Weekly while the November publishing experiment is running: the same Bing measures, recorded against the baseline.

Pages to sample each time:
- Homepage
- NMN review
- Whey protein
- Probiotics
- Collagen after 60
- Supplement interactions guide
- The newest published article since the last check

## Step 20: Decide whether IndexNow is working

### Technical setup is working when:
- The key URL passes the four checks.
- The test submission returns HTTP 200 or 202.
- The bulk submission returns HTTP 200 or 202.
- Future article submissions are being logged.

### Discovery is improving when:
- Bing advances the sitemap last crawl date beyond October 23, 2026.
- Bing's discovered URL count moves closer to the live sitemap count.

### Crawling or indexing is improving when:
- Sample pages move from "Discovered but not crawled" to a crawled or indexed status.
- A public Bing search for `site:supplementdecoded.com` starts returning pages.
- Bing Search Performance records impressions above zero.

### IndexNow is not solving the problem by itself when:
- The key and submissions succeed, but Bing still does not crawl after a reasonable follow-up period.
- In that case, the next levers are site authority, credible backlinks, and continued publishing. IndexNow should remain in place, but it should not be presented as a guarantee.

---

# TROUBLESHOOTING CHECKLIST

## Problem: The key address returns HTTP 307

Likely cause: a redirect or rewrite rule is changing the `.txt` filename.

Fix: exclude the key file from extension, clean URL, middleware, and catch-all redirect rules. Serve it directly from `public`.

## Problem: The redirect target returns HTTP 404

Likely cause: the server is looking for an extensionless file that does not exist.

Fix: restore the `.txt` address as the live address. Do not use the extensionless address as the key location.

## Problem: The key address returns HTTP 200 but shows website HTML

Likely cause: a catch-all page route is handling the request.

Fix: make the static public file take priority, or exclude the exact key filename from the catch-all route.

## Problem: The key address returns HTTP 404

Likely causes:
- File is missing
- File is in the wrong folder
- Filename is misspelled
- Production deployment did not include the file

Fix: place the exact file directly in `public`, redeploy, purge cache, and retest the production address.

## Problem: The body does not match the key

Likely cause: extra text, a wrong key, quotation marks, or an HTML response.

Fix: leave only the exact key in a UTF-8 plain text file.

## Problem: IndexNow returns HTTP 403

Likely cause: the search engine cannot validate the key at the submitted keyLocation.

Fix: compare the key in the request, the filename, the file body, and the keyLocation. All four must match exactly.

## Problem: IndexNow returns HTTP 422

Likely cause: one or more URLs do not belong to the stated host, or the host and key setup conflict.

Fix: use `www.supplementdecoded.com` as the host and submit only URLs on that exact host.

## Problem: IndexNow returns HTTP 429

Likely cause: too many requests.

Fix: stop, record the attempt, and retry later. Do not submit in a loop.

---

# FINAL CHECKLIST

## Developer
- [ ] Exact key file created
- [ ] Only the exact key inside the file
- [ ] File placed directly in `public`
- [ ] Production deployed
- [ ] Redirect fault fixed
- [ ] Public key address returns HTTP 200
- [ ] Public key address returns `text/plain`
- [ ] Public key address returns the exact key
- [ ] Public key address does not redirect
- [ ] Rahul told that the key file is live

## Rahul
- [ ] This guide sent to the developer
- [ ] Muse told when the developer confirms the key file is live

## Muse
- [ ] Key independently verified
- [ ] One test URL submitted
- [ ] Full sitemap submitted once
- [ ] API responses recorded in the tracker
- [ ] Bing follow-up checks recorded against the October 26 baseline

## Official references

- IndexNow documentation: https://www.indexnow.org/documentation
- IndexNow FAQ: https://www.indexnow.org/faq
