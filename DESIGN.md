# Design Brief — ThiruKochi Advisors CRM

## Tone & Differentiation
Ultra-professional enterprise fintech dashboard. Inspired by institutional finance (Muthoot Finance). Minimal, zero-clutter, glassmorphism aesthetic. Premium, sophisticated, corporate gravitas. Kerala-regional identity with modern fintech sensibility.

## Color Palette
| Role | Light OKLCH | Dark OKLCH | Purpose |
|------|-----------|----------|----------|
| Primary | 0.48 0.17 262 | 0.65 0.21 262 | Indigo — Core UI actions |
| Secondary | 0.60 0.11 280 | 0.72 0.15 280 | Purple — Accent highlights |
| Success | 0.52 0.16 142 | 0.68 0.19 142 | Teal — Positive indicators |
| Warning | 0.65 0.10 141 | 0.75 0.15 141 | Amber — Caution alerts |
| Error | 0.55 0.22 25 | 0.65 0.19 22 | Red — Destructive actions |
| Dark BG | 0.09 0.01 255 | — | Deep charcoal dashboard |
| Light BG | 0.98 0 0 | — | Clean white surfaces |

## Typography
- **Display**: Space Grotesk (geometric, premium fintech)
- **Body**: Inter (universal, high-legibility)
- **Mono**: JetBrains Mono (financial data, code blocks)
- **Hierarchy**: 36/28/24px headings, 16/14/12px body, 12px labels with 0.5px letter-spacing

## Elevation & Depth
Glassmorphism cards (backdrop-blur 12px, rgba border). Shadow hierarchy: xs (subtle), sm (hover), md/lg (modals), elevated (floating), glow (accent interactions). No harsh shadows. Soft lighting with 30% opacity tints.

## Structural Zones
| Zone | Light | Dark | Description |
|------|-------|------|-------------|
| Header | #ffffff border-b | #1a1a2e border-b | Top navbar — search, notifications, theme toggle |
| Sidebar | #f8fafc | #12121f | Left nav — TKA monogram, vertical menu, icons + labels |
| Content | #ffffff | #0f0f1a | Main dashboard grid (KPI cards, tables, charts) |
| Cards | #ffffff shadow-md | #16213e + glow | Data containers with trend indicators |
| Status | Badges with borders | Badges with glow | Collection/pending/overdue states |

## Component Patterns
- **KPI Cards**: Metric + sparkline + trend % + status indicator (minimal design)
- **Data Tables**: Alternating rows (muted bg), hover highlight, status badges
- **Sidebar Nav**: Icon + label, active state with accent glow, smooth collapse on mobile
- **Forms**: Outlined inputs (border-input), focus rings (0.5px ring-primary), error states red
- **Modals**: Dark overlay, card surface, smooth fade-in transition
- **Notifications**: Toast top-right, auto-dismiss 4s, icon + message + close

## Motion
- **Fade-in**: 0.4s ease-in-out (page load)
- **Slide-up**: 0.5s cubic-bezier(0.4, 0, 0.2, 1) (cards entering)
- **Pulse-subtle**: 3s loop (loading indicators)
- **Hover**: 200ms smooth on interactive elements
- **Theme toggle**: Instant class switch (smooth CSS transitions via transition-smooth utility)

## Constraints
- No raw hex colors — all OKLCH tokens
- No generic gradients — accent glows only
- Sidebar collapses to icon-only at md breakpoint (768px)
- Responsive: 320px (mobile), 768px (tablet), 1024px (desktop)
- Dark mode default; light mode via next-themes toggle
- Kerala naming for zones/branches (Kochi, Thrissur, Calicut, Trivandrum)

## Signature Detail
Glassmorphic card borders with subtle inset glow on hover. Indigo accent highlight on active nav item. TKA monogram in sidebar with Kerala-inspired geometric accent motif.
