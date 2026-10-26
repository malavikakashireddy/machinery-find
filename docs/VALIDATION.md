# Validation evidence — 2026-10-26

Prepared review branch; no deployment published.

| Check | Actual result |
| --- | --- |
| Node.js 24.22.1 / npm 11.9.0 | Used locally |
| `npm ci` | Executed successfully for original lockfile; subsequent reviewed dependency installs refreshed the lock |
| Unit tests | **12 passed** |
| ESLint | Passed; original main had 3 errors |
| TypeScript `tsc --noEmit` | Passed |
| Production build | Passed on Next.js **16.4.3** |
| Actual HTTP smoke | Passed against the local production server: nine listings, combined filters, and invalid parameter 400 responses |
| `npm audit` all dependencies | **11 findings before** (1 critical, 8 high, 1 moderate, 1 low); **0 after** dependency updates |
| Browser regression script | [Passed in GitHub CI: run 40400976821](https://github.com/malavikakashireddy/machinery-find/actions/runs/40400976821); local browser runtime remains unavailable |
| Visual/mobile/assistive-technology validation | Chromium overflow checks passed at four widths; full visual/assistive-technology review remains open |
| Configured Vercel homepage | HTTP 200 during audit; deployed revision/content not confirmed |
| Remote GitHub Actions | [Passed: run 40400976821](https://github.com/malavikakashireddy/machinery-find/actions/runs/40400976821) |

The audit result is time-specific and is not a security certification. The build does not prove browser behavior. The browser script targets filters, details, debounce/cancellation, network failure/retry, invalid HTTP requests, and overflow at 320/375/768/1440 px; all of those assertions passed in the linked CI run. The first CI browser run caught 320 px header overflow; the header now wraps, with mobile filter positioning adjusted. A test was also corrected to wait for the actual catalog error rather than Next.js’s route-announcer alert. Browser assertions are verified; a human visual and assistive-technology review remains outstanding.
