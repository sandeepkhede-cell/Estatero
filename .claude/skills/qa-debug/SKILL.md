# Skill: qa-debug

## Purpose
Act as a QA engineer to identify and fix bugs, UI issues, accessibility problems, and performance regressions in the real estate platform — without changing design or introducing unnecessary refactors.

## When to Use
- A component renders incorrectly or crashes
- Layout breaks on mobile or specific screen sizes
- API integration produces wrong data or errors
- Console shows warnings or errors
- Performance feels slow (re-renders, large bundles, slow queries)
- A feature works in dev but breaks in production build

## Rules
- **Do NOT change the visual design** — colors, fonts, spacing, layout are fixed
- **Do NOT refactor** unless the refactor directly fixes the bug
- **Fix the minimal surface area** — change only what's broken
- **One bug at a time** — diagnose, fix, verify, then move on
- **Always explain the root cause** before showing the fix

## Debugging Checklist

### React / Frontend
- [ ] Check browser console for errors and warnings
- [ ] Verify all required props are passed and typed correctly
- [ ] Confirm useEffect dependencies are complete (no stale closures)
- [ ] Check for missing `key` props in lists
- [ ] Verify conditional rendering logic (`&&` vs ternary)
- [ ] Look for state updates on unmounted components
- [ ] Check that async calls handle all three states: loading, error, success
- [ ] Verify React Router params/query strings are parsed correctly

### CSS / Layout
- [ ] Test at breakpoints: 375px (mobile), 768px (tablet), 1280px (desktop)
- [ ] Check for overflow issues (hidden content, broken flex/grid)
- [ ] Verify z-index stacking for modals and dropdowns
- [ ] Confirm images have explicit width/height or aspect-ratio
- [ ] Check that Tailwind classes aren't purged in production

### API / Network
- [ ] Open Network tab — verify request URL, method, headers, body
- [ ] Check response status codes (401 = auth issue, 404 = wrong route, 500 = server error)
- [ ] Confirm CORS headers are present on API responses
- [ ] Verify JWT token is included in Authorization header
- [ ] Check that query params match what the backend expects

### Backend / Express
- [ ] Check server logs for unhandled promise rejections
- [ ] Verify middleware order (auth before protected routes)
- [ ] Confirm route parameters match controller expectations
- [ ] Check PostgreSQL query for syntax errors or wrong column names
- [ ] Verify `.env` variables are loaded and not undefined

### Performance
- [ ] Use React DevTools Profiler to find unnecessary re-renders
- [ ] Check for missing `useCallback`/`useMemo` on expensive operations
- [ ] Verify images are compressed and served at correct dimensions
- [ ] Check for N+1 query patterns in backend (use JOINs)
- [ ] Confirm pagination is implemented — never fetch all rows

## Common Bug Patterns

| Symptom | Likely Cause | Fix |
|---|---|---|
| Infinite re-render loop | Object/array in useEffect deps | Move object outside component or use useMemo |
| Stale data after update | Missing state refresh after mutation | Refetch or update local state after API call |
| "Cannot read property of undefined" | Missing null check | Add optional chaining (`?.`) or guard clause |
| Images not loading in prod | Wrong public path | Use `import` or correct Vite `base` config |
| CORS error | Missing CORS config or wrong origin | Add origin to Express cors() config |
| 401 on protected routes | Token not sent | Check axios interceptor attaches Authorization header |
| Filter not applying | Query param name mismatch | Align frontend param names with backend expected keys |
| Dropdown not closing | Missing outside-click handler | Add `useEffect` with `document.addEventListener('click')` |
| Mobile layout broken | Missing responsive classes | Add `sm:`, `md:`, `lg:` Tailwind prefixes |

## Output Format
1. **Root Cause**: One sentence explaining why the bug occurs
2. **Fix**: Minimal code change — show only the changed lines with context
3. **Verification**: How to confirm the fix works (what to click, what to check)
4. If multiple bugs found, list them all first, then fix one by one
