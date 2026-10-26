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
| Browser regression script | Prepared; **not passed locally** — browser download/runtime attempts failed before UI execution |
| Visual/mobile/assistive-technology validation | **Not yet verified** in a working browser |
| Configured Vercel homepage | HTTP 200 during audit; deployed revision/content not confirmed |
| Remote GitHub Actions | Defined; inspect the PR for actual execution |

The audit result is time-specific and is not a security certification. The build does not prove browser behavior. The browser script targets filters, details, debounce/cancellation, network failure/retry, invalid HTTP requests, and overflow at 320/375/768/1440 px; those assertions still need a successful browser run. The code changes for accessibility/responsiveness are implemented but remain visually unverified.
