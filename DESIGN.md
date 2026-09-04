---
name: Warm Modern Fintech
colors:
  surface: '#fff8f5'
  surface-dim: '#e2d8d2'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fcf2eb'
  surface-container: '#f6ece6'
  surface-container-high: '#f0e6e0'
  surface-container-highest: '#eae1da'
  on-surface: '#1f1b17'
  on-surface-variant: '#3d4947'
  inverse-surface: '#342f2b'
  inverse-on-surface: '#f9efe8'
  outline: '#6d7a77'
  outline-variant: '#bcc9c6'
  surface-tint: '#006a61'
  primary: '#00685f'
  on-primary: '#ffffff'
  primary-container: '#008378'
  on-primary-container: '#f4fffc'
  inverse-primary: '#6bd8cb'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#006947'
  on-tertiary: '#ffffff'
  tertiary-container: '#00855b'
  on-tertiary-container: '#f5fff6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#89f5e7'
  primary-fixed-dim: '#6bd8cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#005049'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#fff8f5'
  on-background: '#1f1b17'
  surface-variant: '#eae1da'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Sora
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Sora
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Sora
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Sora
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.03em
  numeric-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  numeric-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 20px
  numeric-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  space-3xl: 4rem
  gutter-mobile: 1rem
  gutter-desktop: 1.5rem
  container-max: 72rem
---

## Brand & Style

The design system establishes a warm, grounded, and approachable personal finance experience. Rather than projecting cold corporate austerity or ephemeral crypto hyper-styling, it communicates clarity, trust, and everyday calm. 

### Emotional Persona
- **Approachability:** Financial management without intimidation, jargon, or clinical stiffness.
- **Reliability:** Grounded stone neutrals provide steady structural integrity without feeling sterile.
- **Clarity:** Clear data visibility with strict tabular alignment, crisp lines, and open visual hierarchy.

### Design Movement
A fusion of **Warm Modernism** and **Tactile Utility**. Surfaces rest on warm stone backgrounds instead of clinical blue-whites. Visual hierarchy relies on subtle natural ambient shadows, fine borders, and deliberate typographic rhythm rather than loud decorative gradients.

## Colors

The color system is anchored in warm earthy stones and an intentional deep teal core, creating a balanced and reassuring financial environment.

### Color Tokens & Assignments

- **Primary (`#0D9488`):** Deep Teal. Used for key interactive actions, active navigation states, primary buttons, and anchor brand marks.
- **Secondary / Accent (`#F59E0B`):** Warm Amber. Used sparingly for highlights, warnings, pending statuses, streaks, and secondary callouts.
- **Positive / Income (`#10B981`):** Emerald Green. Reserved strictly for incoming money, positive metrics, gains, and system success states.
- **Negative / Expense (`#EF4444`):** Soft Carmine Red. Reserved strictly for outbound expenses, negative debt balances, destructive actions, and alerts.
- **Background Base (`#FAFAF9` - stone-50):** Applied across global canvas views, behind cards, and main page scroll areas.
- **Surface Card / Panels (`#FFFFFF`):** Applied to structured modules, cards, modals, and sheets to provide clear separation from the warm canvas.
- **Subtle Borders (`#E7E5E4` - stone-200):** Defines clean containment lines for cards, dividers, tables, and inactive input outlines.
- **Primary Text (`#1C1917` - stone-900):** High-contrast readable dark for titles, amounts, and critical metrics.
- **Secondary Text (`#78716C` - stone-500):** De-emphasized labels, timestamps, metadata, and helper text.

## Typography

The typographic hierarchy couples **Sora** for expressive, geometric headers and focal numbers with **Inter** for dense transactional records and body clarity.

### Numeric Rules
All monetary values, account totals, metrics, and percentages must enable `font-variant-numeric: tabular-nums` (and `slashed-zero` when appropriate) to ensure stable column scanning across financial statements, ledger lists, and dashboard overviews.

### Scale Application
- **Display & Headline:** Used for primary account balances, hero dashboard greetings, and modal headers.
- **Body:** Used for explanations, descriptive categories, transaction notes, and tooltips.
- **Labels:** Used for table headers, form inputs, badge indicators, and chip states.

## Layout & Spacing

This design system uses a flexible grid with generous negative space to maintain an unhurried, calm presentation of financial metrics.

### Grid & Breakpoints
- **Mobile (<640px):** 4-column layout, 16px margins, 12px gutters. Full-width stacked cards.
- **Tablet (640px–1024px):** 8-column layout, 24px margins, 16px gutters. Summary widgets sit in pairs.
- **Desktop (>1024px):** 12-column layout, max-width constrained to `72rem` (1152px) centered, 24px gutters. Provides space for persistent secondary sidebars, monthly trend visualizers, and transaction streams side-by-side.

### Spacing Rhythm
Vertical rhythms operate on an 8px base grid. Related atomic pairs (such as a category icon and its label) use `0.5rem` (8px), card interior padding uses `1.25rem` to `1.5rem` (20px to 24px), and inter-card vertical separation defaults to `1.5rem` (24px).

## Elevation & Depth

Visual hierarchy uses a crisp pairing of warm hair-line borders (`#E7E5E4`) with subtle, diffuse natural shadows to prevent floating elements from looking detached.

### Tiers

- **Level 0 (Flat / Canvas):** Used for base workspace backgrounds (`#FAFAF9`).
- **Level 1 (Surface Cards & Panels):** 
  - Background: `#FFFFFF`
  - Border: `1px solid #E7E5E4`
  - Shadow: `0 1px 2px 0 rgba(28, 25, 23, 0.04)`
- **Level 2 (Dropdowns, Popovers, Active Cards):**
  - Background: `#FFFFFF`
  - Border: `1px solid #E7E5E4`
  - Shadow: `0 4px 6px -1px rgba(28, 25, 23, 0.06), 0 2px 4px -2px rgba(28, 25, 23, 0.04)`
- **Level 3 (Modals, Action Drawers):**
  - Background: `#FFFFFF`
  - Border: `1px solid #E7E5E4`
  - Shadow: `0 10px 15px -3px rgba(28, 25, 23, 0.08), 0 4px 6px -4px rgba(28, 25, 23, 0.03)`

## Shapes

The design system maintains an intentional contrast between outer containers and interactive touchpoints:

- **Cards, Panels & Modals:** `12px` border radius (`rounded-xl`).
- **Interactive Controls (Buttons, Inputs, Selectors):** `8px` border radius (`rounded-lg`).
- **Data Chips & Status Badges:** `6px` or `8px` border radius (`rounded-md` to `rounded-lg`).
- **Pill Shape Restriction:** Fully rounded pill silhouettes (`rounded-full`) are intentionally avoided for functional buttons and inputs to prevent a generic consumer-toy aesthetic. Circular treatments are permitted only for small avatar graphics, circular icon holders, or status indicator dots.

## Components

### Buttons
- **Primary:** Background `#0D9488`, text `#FFFFFF`, radius 8px, font Inter semi-bold (14px). Hover state shifts to `#0F766E`. Active state applies subtle scale compression (`0.98`).
- **Secondary:** Background `#FFFFFF`, border `1px solid #E7E5E4`, text `#1C1917`, radius 8px. Hover state applies background `#F5F5F4`.
- **Tertiary / Destructive:** For destructive actions, text `#EF4444`, background transparent or `#FEF2F2`.
- **Icon Buttons:** Fixed aspect ratio (e.g., 36x36px or 40x40px), radius 8px, containing centered 18-20px Lucide line icons.

### Inputs & Form Fields
- **Container:** Height 40px, border `1px solid #E7E5E4`, radius 8px, background `#FFFFFF`.
- **Typography:** Inter regular (14px), text `#1C1917`, placeholder `#A8A29E`.
- **States:** Focus ring uses `2px solid #0D9488` with a 2px offset. Error replaces the border with `#EF4444`.
- **Numeric Fields:** Currency input fields lock `font-variant-numeric: tabular-nums` and display prefix currency markers fixed in `#78716C`.

### Cards & Modules
- **Structure:** Background `#FFFFFF`, border `1px solid #E7E5E4`, radius 12px, padding 20px or 24px.
- **Header:** Sora semi-bold (18px) text, aligned flex row with optional Lucide icon button or dropdown filter.

### Financial Lists & Ledger Rows
- **Layout:** Flex row with 12px gap, 12px vertical internal padding, bottom border `1px solid #F5F5F4`.
- **Icon Container:** 40x40px container, radius 8px, light tinted background corresponding to category (e.g., `#F0FDFA` for teal, `#ECFDF5` for income, `#FEF2F2` for expenses).
- **Amounts:** Right-aligned tabular numeric values. Preceded by `+` in emerald `#10B981` for deposits, or `-` in stone `#1C1917` (or `#EF4444` when highlighting deficit targets).

### Badges & Chips
- **Structure:** Height 24px to 28px, radius 6px to 8px, horizontal padding 8px to 10px.
- **Colors:** Light tint background paired with darkened foreground (e.g., Amber Chip: bg `#FEF3C7`, text `#B45309`; Teal Chip: bg `#CCFBF1`, text `#0F766E`).

### Checkboxes & Radio Controls
- **Checkboxes:** 18x18px, radius 4px, border `1.5px solid #D6D3D1`. When checked, background `#0D9488` with white checkmark.
- **Radio Buttons:** 18x18px, border `1.5px solid #D6D3D1`. When active, border `#0D9488` with inner 8px solid teal pip.

### Iconography Guidelines
- All icons follow a **1.5px to 2px linear stroke** matching Lucide conventions.
- Standard sizing: 16px (inline metadata), 20px (actions and navigation), 24px (hero highlights).
- Icons inherit text colors or match explicit semantic tones; filled decorative flat icons are avoided.