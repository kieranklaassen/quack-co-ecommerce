---
title: "feat: Quack & Co. premium rubber duck e-commerce store"
type: feat
date: 2026-07-08
deepened: 2026-07-08
---

# feat: Quack & Co. premium rubber duck e-commerce store

## Summary

Build a greenfield Next.js App Router storefront for **Quack & Co.** — a premium artisan rubber duck brand — with static HTML export to `out/`, a working catalog/PDP/customizer/cart, and a multi-step mock checkout. All commerce state is client-side (localStorage) because `output: 'export'` forbids server runtime.

## Problem Frame

The workspace is empty. The LFGBench rubber-duck benchmark requires a complete, statically exported e-commerce experience that scores on end-to-end functionality, static-export correctness, persistence, pricing fidelity, customizer fidelity, form validation, brand craft, UX affordances, responsiveness, and TypeScript quality. Failure modes that most often tank scores: missing per-slug HTML, cart/checkout lost on hard refresh, customizer selections not carried verbatim into cart, float money math, and `ignoreBuildErrors` masking a broken build.

## Assumptions

- Brand name is **Quack & Co.** (prompt `$ARGUMENTS` placeholders resolve to `&`).
- Tax is a flat **8% estimate** on merchandise subtotal only; shipping is **$0**.
- Payment always succeeds after a short client-side delay (no decline path).
- Card fields: validate number/expiry/CVV/name on card; **persist allowlist only** `cardBrand?`, `last4?`. Never persist `pan`, `cvv`, `expiry`. Cardholder name is memory-only unless copied into the `lastOrder` snapshot (never into the checkout draft). `lastOrder` must not contain pan/cvv/expiry.
- Abandoned checkout: demo accepts shipping PII remaining in `quack-checkout-v1` until order success or cart emptied; clear draft when cart becomes empty without an order and on confirmation success.
- About page is included (low cost, brand reinforcement).
- No real payment processor, auth, or backend API.
- R10 “finish/pattern” means **finish options** (Matte / Glossy / Glitter) — no separate pattern dimension.

## Requirements

### Static export and project shape

- R1. Next.js 14+ App Router + TypeScript + Tailwind + shadcn/ui; `npm install && npm run dev` and `npm run build` succeed.
- R2. `next.config.ts` sets `output: 'export'` and `images.unoptimized: true` with **no** `ignoreBuildErrors` / `ignoreDuringBuilds`.
- R3. `/shop/[slug]` implements `generateStaticParams()` covering every catalog product; `out/` contains `index.html` plus per-slug HTML.
- R4. Source includes keywords: `localStorage`, `generateStaticParams`, `output:`, `checkout`, `customize`.

### Catalog and product pages

- R5. Home (`/`) with hero, featured products, value props, and nav to all primary routes.
- R6. Shop (`/shop`) grid with working category filter: Classic, Limited Edition, Themed (plus All).
- R7. At least 6 realistic products; standard $25–75, limited $50–100+; believable descriptions.
- R8. PDP (`/shop/[slug]`) with image, details, optional color variant, qty, Add to Cart; related products optional.
- R9. Add to Cart works from catalog and from PDP (variant + qty respected).

### Customizer

- R10. `/customize` with ≥5 base colors, ≥3 accessory categories, finish options (Matte/Glossy/Glitter), engraving text + font/style, live preview, live price, Add to Cart.
- R11. Cart line for custom ducks stores selections and price delta **verbatim** (same values shown in preview).

### Cart and pricing

- R12. Cart lists standard and custom lines; shows custom details; qty +/-; remove with confirmation; subtotal + tax estimate + total.
- R13. Cart persists across navigation and hard refresh (localStorage).
- R14. Money math uses integer cents end-to-end; displayed totals match summed parts to the cent.

### Checkout

- R15. Multi-step routes: `/checkout/shipping` → `/checkout/payment` → `/checkout/confirmation` with progress indicator.
- R16. Shipping and payment forms validate required fields, email format, card number/expiry/CVV/name on card; inline errors block progression. Payment includes billing address with same-as-shipping checkbox (when unchecked, billing street/city/state/zip/country required) and a visible order summary sidebar.
- R17. Checkout draft (shipping + safe payment fields) persists across step back/forward and hard refresh.
- R18. Place Order mocks success, shows confirmation with generated order number and summary, then clears cart (and draft); confirmation requires a persisted order snapshot.

### UX, brand, quality

- R19. Header cart icon with live item-count (sum of quantities); clear pricing; loading states on place-order; mobile-usable at 375/768/1280.
- R20. Visual system: muted luxury (not toy brights, not default shadcn purple/cream clichés); generous whitespace; distinctive typography.
- R21. Proper TypeScript (no pervasive `any`); organized `components` / `lib` / `types`; sensible server vs client split; no console errors.

## Scope Boundaries

### In scope

- Full static storefront and mock checkout as specified above.
- SVG/CSS layered duck preview shared across customizer, cart, and confirmation.
- About page with brand story.

### Out of scope

- Real payments, inventory, accounts, email, analytics, CMS, i18n.
- Server Actions, API routes, middleware, ISR.
- Pagination (catalog stays ≤12 products).

### Deferred to Follow-Up Work

- Account/order history, promo codes, multi-currency, wishlist.

## Key Technical Decisions

- KTD1. **Static-export-first architecture.** All interactivity is Client Components; product data is a build-time TypeScript module. Rationale: `output: 'export'` forbids Server Actions, cookies, and request-time dynamic routes.
- KTD2. **Zustand + persist with `skipHydration`.** Cart and checkout draft use Zustand `persist` to localStorage; rehydrate in `useEffect`; gate cart badge/guards on `hasHydrated`. Rationale: avoids SSR/static HTML hydration mismatch; prior rubber-duck runs failed on flash/redirect races.
- KTD3. **Integer cents for all money.** Catalog, accessories, deltas, tax, and totals use `*Cents: number`; single `formatMoney` for display; tax = `Math.round(subtotalCents * 800 / 10000)`. Rationale: scoring judges to the cent; float dollars drift.
- KTD4. **Discriminated cart lines.** `CartLine` = `{ kind: 'product', ... } | { kind: 'custom', customization: Customization, ... }` with stable `lineId`. Products merge by `productId`+variant; customs never merge. Rationale: customizer fidelity + qty math.
- KTD5. **Order lifecycle: snapshot → navigate → clear on confirmation.** Place Order writes `lastOrder` to localStorage, navigates to confirmation; confirmation `useEffect` clears cart/draft once. Empty-cart guards must not run reactively after clear mid-navigation (prior learning: clearing on payment redirects away from confirmation).
- KTD6. **SVG/CSS `DuckPreview` as single source of truth.** Preview driven by typed `Customization`; reused in cart/confirmation. Rationale: DOM a11y, no canvas complexity, fidelity scoring.
- KTD7. **Client-only forms with Zod + react-hook-form.** No Server Actions. Card validated for format (length/pattern; Luhn optional); full PAN and CVV never persisted (draft may keep last4 + brand only).
- KTD8. **Visual tokens: cool monochrome editorial.** Near-white canvas, ink, cool grays; one restrained accent max; serif display + refined sans; restyle shadcn theme. Ban bright primaries and AI-slop purple/cream/terracotta.
- KTD9. **`trailingSlash: true` + `images.unoptimized: true`.** Friendlier static host paths (`out/shop/slug/index.html`); required for Image under export.
- KTD10. **Separate storage keys.** `quack-cart-v1`, `quack-checkout-v1`, `quack-last-order-v1` with schema versioning and corrupt-JSON reset.

## High-Level Technical Design

### Component topology

```mermaid
flowchart TB
  subgraph build [Build time SSG]
    Products[lib/products.ts]
    GSP[generateStaticParams]
    Products --> GSP
    GSP --> OutHTML["out/shop/slug/index.html"]
  end

  subgraph client [Client runtime]
    CartStore[Zustand cart persist]
    CheckoutStore[Zustand checkout draft]
    LastOrder[lastOrder localStorage]
    Header[Header cart badge]
    Customizer[Customizer + DuckPreview]
    CartPage[Cart page]
    Ship[Shipping form]
    Pay[Payment form]
    Conf[Confirmation]
    Customizer --> CartStore
    CartPage --> CartStore
    Header --> CartStore
    Ship --> CheckoutStore
    Pay --> CheckoutStore
    Pay -->|write lastOrder| LastOrder
    Pay -->|navigate| Conf
    Conf -->|clear cart| CartStore
    Conf -->|clear draft| CheckoutStore
    Conf --> LastOrder
  end
```

### Checkout state machine

```mermaid
stateDiagram-v2
  [*] --> Cart
  Cart --> Shipping: Proceed / cart non-empty
  Shipping --> Payment: valid shipping saved
  Payment --> Shipping: Back
  Payment --> Confirmation: Place Order writes lastOrder
  Confirmation --> [*]: Continue Shopping
  Shipping --> Cart: empty cart guard after hydrate
  Payment --> Cart: empty cart guard after hydrate
  Confirmation --> Shop: missing lastOrder redirect
```

### Price formula (directional)

```
BASE_CENTS              = 5500   // $55 custom duck base
ENGRAVING_CENTS         = 800    // when text non-empty
TAX_BPS                 = 800    // 8.00%

unitPriceCents(product) = product.priceCents (+ variant delta if any)
unitPriceCents(custom)  = BASE_CENTS + Σ accessoryCents + finishCents + (ENGRAVING_CENTS if text non-empty)
lineTotal               = unitPriceCents * qty
subtotalCents           = Σ lineTotal
taxCents                = Math.round(subtotalCents * TAX_BPS / 10000)
totalCents              = subtotalCents + taxCents
```

## Output Structure

```
/
├── package.json
├── tsconfig.json
├── next.config.ts
├── components.json
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── about/page.tsx
│   ├── shop/page.tsx
│   ├── shop/[slug]/page.tsx
│   ├── customize/page.tsx
│   ├── cart/page.tsx
│   └── checkout/
│       ├── layout.tsx
│       ├── shipping/page.tsx
│       ├── payment/page.tsx
│       └── confirmation/page.tsx
├── components/
│   ├── ui/
│   ├── layout/
│   ├── shop/
│   ├── customizer/
│   ├── cart/
│   └── checkout/
├── lib/
│   ├── products.ts
│   ├── customizer-options.ts
│   ├── money.ts
│   ├── cart-store.ts
│   ├── checkout-store.ts
│   └── utils.ts
├── types/
│   ├── product.ts
│   ├── cart.ts
│   ├── customizer.ts
│   └── checkout.ts
└── __tests__/ or tests/ (unit tests for money + cart merge + validation)
```

## Implementation Units

### U1. Scaffold Next.js + Tailwind + shadcn + static export config

- **Goal:** Runnable App Router project that builds to `out/` with theme tokens and layout shell.
- **Requirements:** R1, R2, R4, R19, R20
- **Dependencies:** None
- **Files:**
  - Create: `package.json`, `tsconfig.json`, `next.config.ts`, `components.json`, `postcss.config.mjs`, `app/globals.css`, `app/layout.tsx`, `app/page.tsx` (placeholder), `components/ui/*` (button, input, label, card, dialog, select, checkbox, separator as needed), `components/layout/site-header.tsx`, `components/layout/site-footer.tsx`, `lib/utils.ts`
  - Test: manual `npm run build` verification (no feature tests yet) — `Test expectation: none -- scaffolding only`
- **Approach:** Create Next.js 15 (or 14+) TypeScript app; enable `output: 'export'`, `trailingSlash: true`, `images.unoptimized: true`; init shadcn with RSC; apply muted editorial CSS variables and fonts (serif display + sans); header with nav links and cart badge placeholder.
- **Patterns to follow:** Official Next static export + shadcn Next install.
- **Verification:** `npm run build` emits `out/index.html`; no ignore\* flags in config; site shell renders.

### U2. Domain types, mock catalog, money helpers

- **Goal:** Typed product/customizer/cart/checkout models, ≥6 products across categories, cent-safe pricing helpers.
- **Requirements:** R7, R14, R10
- **Dependencies:** U1
- **Files:**
  - Create: `types/product.ts`, `types/cart.ts`, `types/customizer.ts`, `types/checkout.ts`, `lib/products.ts`, `lib/customizer-options.ts`, `lib/money.ts`
  - Test: `lib/money.test.ts` (or `__tests__/money.test.ts`)
- **Approach:** Products include `slug`, `name`, `description`, `priceCents`, `category` (`classic` | `limited` | `themed`), optional `colors[]`, `featured`. Customizer options: ≥5 base colors; accessories Hats / Eyewear / Neckwear with priced options + None; finishes Matte/Glossy/Glitter; fonts ≥2; engraving fee when text non-empty. Export `getProductBySlug`, `getAllSlugs`, `calcCustomUnitPrice`, `cartTotals`.
- **Test scenarios:**
  - Happy: subtotal of two lines equals sum of unit×qty; tax is 8% rounded once; total = subtotal + tax.
  - Edge: empty cart totals all zero; engraving empty → no engraving fee; engraving present → fee applied.
  - Edge: accessory None contributes 0; glitter finish adds documented cents.
- **Verification:** Catalog has ≥6 in-range products; money helpers are the only place totals are computed.

### U3. Cart store with localStorage persistence and header badge

- **Goal:** Hydration-safe cart that survives refresh; add/remove/qty; live header count.
- **Requirements:** R9, R12, R13, R19
- **Dependencies:** U2
- **Files:**
  - Create: `lib/cart-store.ts`, `components/providers/cart-provider.tsx` (or store bootstrap), `components/cart/add-to-cart-button.tsx`, `components/layout/cart-badge.tsx`
  - Test: `lib/cart-store.test.ts`
- **Approach:** Zustand persist `quack-cart-v1`, `skipHydration`, rehydrate on mount; `hasHydrated` gate. APIs: `addProduct`, `addCustom`, `setQty`, `removeLine`. Merge products by productId+variantKey; customs always new `lineId`. Badge shows Σ qty only after hydrate.
- **Test scenarios:**
  - Happy: add product twice merges qty; add two different customs → two lines.
  - Edge: setQty clamps 1–99; remove deletes line.
  - Integration: serialize/deserialize round-trip preserves custom fields.
- **Verification:** Hard refresh keeps cart; badge matches Σ qty; no hydration console errors.

### U4. Home, shop catalog with filters, PDP with generateStaticParams

- **Goal:** Marketing home, filterable shop grid, statically generated PDPs with add-to-cart.
- **Requirements:** R3, R5, R6, R7, R8, R9
- **Dependencies:** U2, U3
- **Files:**
  - Create: `app/page.tsx`, `app/shop/page.tsx`, `app/shop/[slug]/page.tsx`, `app/about/page.tsx`, `components/shop/product-card.tsx`, `components/shop/category-filter.tsx`, `components/shop/product-detail.tsx`
  - Test: `lib/products.test.ts` (slug coverage for GSP)
- **Approach:** Home: brand-first hero, featured slice, value props, CTAs. Shop: client filter tabs All/Classic/Limited/Themed. PDP: server page using `generateStaticParams` from `getAllSlugs`; client island for variant/qty/add. Product imagery via CSS/SVG placeholders or local public assets (no remote optimizer).
- **Test scenarios:**
  - Happy: `getAllSlugs()` length equals catalog size; filter Classic returns only classic.
  - Edge: unknown category tab shows empty state with clear action.
- **Verification:** `out/shop/<slug>/index.html` exists for every product; catalog and PDP add update cart.

### U5. Duck customizer with live preview and priced add-to-cart

- **Goal:** Full customizer meeting fidelity bar; selections and delta land in cart unchanged.
- **Requirements:** R10, R11, R14
- **Dependencies:** U2, U3
- **Files:**
  - Create: `app/customize/page.tsx`, `components/customizer/duck-preview.tsx`, `components/customizer/option-panel.tsx`, `components/customizer/customizer-shell.tsx`
  - Test: `lib/customizer-pricing.test.ts`
- **Approach:** Controlled `Customization` state; `DuckPreview` layers base fill → finish overlay → accessories → engraving `<text>` with selected font. Price sidebar uses `calcCustomUnitPrice`. Add to Cart pushes `kind: 'custom'` line with full object copy.
- **Test scenarios:**
  - Happy: changing color/accessory/finish/engraving/font updates preview inputs object; unit price matches helper.
  - Integration: added cart line deep-equals customization + unitPriceCents from preview.
  - Edge: max engraving length enforced; empty engraving clears fee but keeps font selection.
- **Verification:** Live preview reflects all required dimensions; cart line matches exactly.

### U6. Cart page UX — lines, qty, remove confirm, totals, checkout CTA

- **Goal:** Usable cart with correct math and destructive confirmation.
- **Requirements:** R12, R14, R19
- **Dependencies:** U3, U5
- **Files:**
  - Create: `app/cart/page.tsx`, `components/cart/cart-line-item.tsx`, `components/cart/cart-summary.tsx`, `components/cart/remove-line-dialog.tsx`
  - Test: reuse money/cart tests; optional component test for empty state
- **Approach:** Render product vs custom details; qty steppers; AlertDialog before remove; summary via `cartTotals`; CTA to shipping disabled when empty; empty state links to shop/customize.
- **Test scenarios:**
  - Happy: mixed cart summary matches manual cent math.
  - Edge: empty cart shows CTA to shop, no checkout button enabled.
- **Verification:** Qty +/- recomputes; remove confirm works; totals match.

### U7. Multi-step checkout — shipping, payment, confirmation

- **Goal:** Validated multi-step flow with draft persistence, mock pay, order confirmation, cart clear.
- **Requirements:** R15–R18, R19, R21
- **Dependencies:** U3, U6
- **Files:**
  - Create: `app/checkout/layout.tsx`, `app/checkout/shipping/page.tsx`, `app/checkout/payment/page.tsx`, `app/checkout/confirmation/page.tsx`, `components/checkout/progress.tsx`, `components/checkout/order-summary.tsx`, `components/checkout/shipping-form.tsx`, `components/checkout/payment-form.tsx`, `lib/checkout-store.ts`, `lib/validation.ts`
  - Test: `lib/validation.test.ts`, `lib/checkout-lifecycle.test.ts`
- **Approach:** Progress in checkout layout. Zod schemas for shipping and payment (including name on card + billing). Persist draft (`quack-checkout-v1`) with payment allowlist only (`cardBrand?`, `last4?`). Guards: after `hasHydrated`, empty cart on shipping/payment → redirect `/cart` **once per mount** (ref/flag), not as a reactive effect on every cart change — otherwise Place Order → clear would bounce the user off confirmation. If payment mounts with `lastOrder` already present, redirect to confirmation (treat as completed). Confirmation without `lastOrder` → redirect `/shop`. Place Order: set pending → write `lastOrder` (order number `QC-…`, items snapshot, shipping, totals; no pan/cvv/expiry) **before** any cart mutation → `router.push` confirmation → confirmation `useEffect` clears cart+draft once (and only if `lastOrder` write succeeded). `sameAsShipping` merges billing into values **before** Zod parse. Browser back from confirmation to payment: if `lastOrder` exists and cart empty, redirect to confirmation or shop — do not allow a second Place Order without a new cart. Clear checkout draft when cart becomes empty without an order.
- **Test scenarios:**
  - Happy: valid shipping advances; valid payment produces order with number; cart empty after confirmation clear.
  - Error: empty shipping submit shows field errors and does not navigate; bad email blocked; bad card/expiry/CVV/name on card blocked.
  - Edge: missing lastOrder on confirmation redirects; double Place Order ignored while pending.
  - Edge: empty-cart guard on shipping/payment runs once per mount after hydrate; clearing cart on confirmation does not bounce away from confirmation.
  - Edge: `lastOrder` write failure → cart/draft remain uncleared.
  - Edge: browser back confirmation→payment with `lastOrder` present and empty cart → redirect; no second Place Order.
  - Edge: payment mount with existing `lastOrder` redirects to confirmation.
  - Integration: draft survives simulated reload (rehydrate); back payment→shipping keeps fields.
  - Integration: `sameAsShipping` true merges billing before Zod; unchecked billing required fields validate independently.
- **Verification:** Full path catalog→customize→cart→ship→pay→confirm works; hard refresh mid-checkout keeps draft; cart clears only after order.

### U8. Polish — loading/empty states, responsiveness, build cleanliness

- **Goal:** Score ecommerce_ux, responsiveness, brand, code_quality; prove clean static export.
- **Requirements:** R19–R21, R2, R3
- **Dependencies:** U4–U7
- **Files:**
  - Modify: global styles, header, forms, customizer layout for mobile stacking; ensure touch targets ≥44px
  - Test: final manual build checklist (document in verification)
- **Approach:** Sticky mobile order summary pattern; full-width CTAs; focus/labels/alt text; remove console noise; run production build and inspect `out/` for every slug; grep for `any` and ignore\* flags.
- **Test expectation:** none beyond build artifact checks — polish unit
- **Verification:** `out/index.html` + per-slug HTML present; build without ignore flags; no console errors on happy path; 375px checkout usable.

## Acceptance Examples

- AE1. **Catalog add + refresh.** Given empty cart, when user adds Classic duck from `/shop` and hard-refreshes, then header count and `/cart` still show that line.
- AE2. **Customizer fidelity.** Given customizer selections (color, hat, glasses, bow, glitter, name “Ada”, font Serif), when added to cart, then line shows the same options and price as the customizer total.
- AE3. **Checkout validation.** Given shipping form with invalid email, when Continue is clicked, then inline error shows and URL stays on shipping.
- AE4. **Order completion.** Given filled shipping+payment and non-empty cart, when Place Order succeeds, then confirmation shows `QC-…` order number and cart count is 0 after confirmation loads.
- AE5. **Static export.** Given `npm run build`, when inspecting `out/`, then `index.html` and each product slug HTML exist and `next.config.ts` has no ignoreBuildErrors.

## System-Wide Impact

- **State lifecycle:** Cart, checkout draft, and lastOrder are three stores with explicit clear rules; confirmation is the only clear point for cart after purchase.
- **Hydration:** All localStorage readers gated; empty-cart redirects wait for hydrate to avoid false redirects on static pages.
- **No server surface:** No cookies, middleware, or API routes — preview/serve must work as pure static files.
- **Scoring harness:** Eval may inject ignore flags; submitted config must still be clean so judge inspection passes.

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Hydration mismatch / cart flash | `skipHydration` + `hasHydrated` gate on badge and guards |
| Clear cart on payment breaks confirmation | Snapshot `lastOrder` first; clear only on confirmation mount |
| Missing slug HTML | Single `getAllSlugs()` feeds GSP and tests assert coverage |
| Float cent drift | Integer cents only; one tax round |
| Generic shadcn look | Theme tokens + typography set in U1 before page content |
| localStorage corrupt/unavailable | try/catch + schema reset; in-memory fallback |
| Double Place Order | Pending flag disables button |
| Reactive empty-cart guard after clear | Once-per-mount guard; clear only on confirmation after `lastOrder` write |
| lastOrder write fails then cart cleared | Only clear cart if `lastOrder` persisted successfully |
| Cross-tab empty cart mid-payment | After hydrate, show recovery empty state + link to shop |

## Sources & Research

- Next.js static exports guide: `output: 'export'`, `generateStaticParams` required, `images.unoptimized`.
- Prior learning: `docs/solutions`-style finding from earlier rubber-duck run — defer cart clear until confirmation; merge `sameAsShipping` before Zod.
- LFGBench `benchmarks/rubber-duck-ecommerce/scoring.md` dimensions and failure caps.
- shadcn Next.js installation + RSC client boundaries.
- Best practice: Zustand persist skipHydration; integer money; SVG configurator over canvas for this product.
