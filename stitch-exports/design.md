---
name: VerdictAI Design System
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffffff'
  on-tertiary: '#002e6a'
  tertiary-container: '#d8e2ff'
  on-tertiary-container: '#0060ce'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a42'
  on-tertiary-fixed-variant: '#004395'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  headline-md-mobile:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin-safe: 32px
---

## Brand & Style
This design system embodies the persona of a "Silent Partner"—authoritative, precise, and unobtrusive. It is engineered for institutional investors and analysts who require clarity over decoration. 

The aesthetic is **Modern Minimalist Enterprise**, drawing inspiration from high-end developer tools and sophisticated research platforms. The UI prioritizes content density and readability, using a monochromatic base to let investment data and AI insights take center stage. Visual interest is achieved through high-quality micro-interactions, subtle glassmorphism for layering, and a restrained use of color to denote action and status rather than for purely decorative purposes.

## Colors
The palette is centered on a "Deep Night" dark mode to reduce eye strain during long research sessions.

- **Primary & Neutrals**: Pure white is used for primary text and high-priority actions. The background uses a tiered system of blacks: `#0A0A0A` for the canvas and `#111111` or `#1A1A1A` for elevated surfaces.
- **Accents**: 
    - **Muted Emerald (#10B981)**: Specifically reserved for "Bullish" signals, positive growth, and successful AI completions.
    - **Soft Blue (#3B82F6)**: Used for "Neutral" research paths, focus states, and primary hyperlinks.
- **Functional Grays**: A range of graphite tones is used to establish hierarchy in metadata and secondary UI elements, ensuring the interface feels layered rather than flat.

## Typography
The system utilizes **Inter** for all UI and prose elements to ensure maximum legibility and a neutral, professional tone.

- **Scale**: A tight typographic scale is used to maintain an "information-rich" environment without clutter.
- **Mono Accents**: **JetBrains Mono** is introduced sparingly for data points, tickers (e.g., $NVDA), and AI "thinking" states to provide a technical, high-precision feel.
- **Contrast**: Use `FontWeight: 600` for semantic emphasis and `FontWeight: 400` for general reading. Avoid weights below 400 to maintain accessibility on dark backgrounds.

## Layout & Spacing
The layout employs a **Fluid-Fixed Hybrid** model. Navigation and sidebars are fixed-width to ensure tool accessibility, while the central research workspace is fluid.

- **Grid**: A 12-column grid is used for dashboard views. 
- **Workspace Focus**: In "Deep Research" mode, content is centered with a max-width of 960px to optimize line length for reading AI-generated reports.
- **Rhythm**: All spacing follows a 4px baseline, but primary component gaps should default to `md` (24px) to create an airy, premium feel that distinguishes this from cramped legacy financial software.

## Elevation & Depth
Depth is created through **Tonal Layering** and **Subtle Glassmorphism** rather than traditional heavy shadows.

- **Surfaces**: Level 0 is the canvas. Level 1 (Cards) uses a slightly lighter fill with a 1px border. Level 2 (Modals/Popovers) uses a backdrop blur (20px) and a semi-transparent background to maintain context of the underlying data.
- **Shadows**: Only used for floating elements like dropdowns and modals. Shadows are large, ultra-soft, and low-opacity (`rgba(0,0,0,0.4)`).
- **Borders**: All elevated surfaces must have a `1px` solid border (`rgba(255,255,255,0.08)`) to provide definition against the dark canvas.

## Shapes
The shape language balances modern software aesthetics with professional rigor.

- **Standard Elements**: Buttons and input fields use a consistent 8px radius.
- **Containers**: Workspace cards and main UI panels use a more generous 16px (`rounded-lg`) or 24px (`rounded-xl`) radius to soften the technical nature of the data.
- **Interactive States**: Focus rings should follow the outer curvature of the element with a 2px offset.

## Components
- **Primary Buttons**: Solid white background with black text. On hover, apply a subtle scale-down effect (0.98) to simulate physical "pressing."
- **Research Cards**: Integrated "Glass" style with a top-border highlight. These contain the AI-generated summaries and data visualizations.
- **Input Fields**: Ghost-style inputs with 1px borders that glow subtly with a `Soft Blue` outer shadow when focused. 
- **Status Chips**: Small, pill-shaped indicators using the `label-mono` type. Use the `Muted Emerald` for "Verified" or "Buy" signals.
- **AI Workspace**: A multi-pane interface where the left panel holds the query history, the center is the active report, and the right panel holds "Sources & Citations." Use thin vertical dividers (`1px`) instead of heavy gaps to maximize space.
- **Data Tables**: Minimalist borders, no zebra striping. Use hover rows with a subtle white opacity (`0.04`) to highlight the active data point.
