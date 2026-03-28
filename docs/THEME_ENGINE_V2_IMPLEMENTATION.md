# Theme Engine v2 Implementation Guide

## Overview

This guide provides complete implementation details for the enhanced CSS variable-based theme engine with 4 presets, 3 layout modes, domain-specific dashboards, AI presence layer, and enhanced motion system.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Theme Presets](#theme-presets)
3. [Layout Modes](#layout-modes)
4. [Domain Dashboards](#domain-dashboards)
5. [AI Presence Layer](#ai-presence-layer)
6. [Motion System](#motion-system)
7. [Component Examples](#component-examples)
8. [Migration Guide](#migration-guide)

---

## Quick Start

### 1. Import the new theme engine

Replace the existing import in `src/index.css`:

```css
@import './styles/theme-engine-v2.css';
@import 'tailwindcss';
```

### 2. Use the enhanced presets in your components

```jsx
import { THEME_PRESETS_V2, LAYOUT_MODES } from '@/lib/themePresetsV2'
import { DOMAIN_DASHBOARDS } from '@/lib/domainDashboards'

// Access presets
const currentTheme = THEME_PRESETS_V2.find(p => p.id === 'enterprise-light')
const currentLayout = LAYOUT_MODES.find(m => m.id === 'SIDEBAR_ADMIN')
const currentDomain = DOMAIN_DASHBOARDS['PMO']
```

---

## Theme Presets

### Available Presets

| ID | Label | Category | Default For |
|---|---|---|---|
| `enterprise-light` | Enterprise Light | Light | PMO, MIIDLE |
| `cyber-hud` | Cyber HUD | Dark | TECH_OPS |
| `dark-glass` | Dark Glass | Dark | - |
| `wellness-soft` | Wellness Soft | Light | - |

### Applying a Theme

The theme is set via the `data-theme` attribute on the `<html>` element:

```jsx
// Using MartinOsProvider (recommended)
const { setThemePresetId } = useMartinOs()
setThemePresetId('cyber-hud')

// Or directly (for testing)
document.documentElement.dataset.theme = 'cyber-hud'
```

### Custom CSS Variables

Each theme provides these semantic color variables:

```css
/* Core colors */
--bg-base              /* Main background */
--bg-elevated          /* Elevated surfaces */
--bg-subtle            /* Subtle backgrounds */

/* Surface colors */
--surface-glass        /* Glassmorphism panels */
--surface-elevated     /* Elevated panels */
--surface-deep         /* Deep panels */

/* Text colors */
--text-primary         /* Primary text */
--text-secondary       /* Secondary text */
--text-muted           /* Muted text */
--text-disabled        /* Disabled text */

/* Border colors */
--border-subtle        /* Subtle borders */
--border-default       /* Default borders */
--border-strong        /* Strong borders */

/* Accent colors */
--accent               /* Primary accent */
--accent-light         /* Light accent */
--accent-dark          /* Dark accent */
--accent-muted         /* Muted accent */

/* Semantic colors */
--success              /* Success state */
--warning              /* Warning state */
--error                /* Error state */
--info                 /* Info state */

/* Text on colored backgrounds */
--text-on-accent       /* Text on accent bg */
--text-on-success      /* Text on success bg */
--text-on-warning      /* Text on warning bg */
--text-on-error        /* Text on error bg */

/* Effects */
--overlay-scrim        /* Modal overlay */
--edge-chrome          /* Edge gradient */
```

---

## Layout Modes

### Available Modes

| ID | Label | Description | Features |
|---|---|---|---|
| `SIDEBAR_ADMIN` | Sidebar Admin | Classic admin layout | Sticky sidebar, structured |
| `HUD` | HUD Mode | Heads-up display | Floating panels, collapsible |
| `BENTO` | Bento Grid | Editorial grid | Responsive, creative |

### Applying a Layout Mode

```jsx
// Using MartinOsProvider (recommended)
const { setLayoutMode } = useMartinOs()
setLayoutMode('HUD')

// Or directly (for testing)
document.documentElement.dataset.layoutMode = 'HUD'
```

### Layout Mode Components

#### Sidebar Admin

```jsx
import PmoDashboard from '@/components/layouts/PmoDashboard'

<PmoDashboard
  activeNavItem="dashboard"
  onNavItemClick={(itemId) => console.log('Nav:', itemId)}
>
  {/* Dashboard content */}
</PmoDashboard>
```

#### HUD Mode

```jsx
import TechOpsHUD from '@/components/layouts/TechOpsHUD'

<TechOpsHUD>
  {/* Main content area */}
  <div>Content goes here</div>
</TechOpsHUD>
```

#### Bento Grid

```jsx
import BentoGrid, { BentoCard } from '@/components/layouts/BentoGrid'

<BentoGrid columns={3} gap="md">
  <BentoCard title="Card 1" size="medium">
    Content
  </BentoCard>
  <BentoCard title="Card 2" size="large" large>
    Large card spanning 2 columns
  </BentoCard>
  <BentoCard title="Card 3" size="tall" tall>
    Tall card
  </BentoCard>
</BentoGrid>
```

---

## Domain Dashboards

### Available Domains

| Domain | Name | Default Layout | Default Theme |
|---|---|---|---|
| `PMO` | PMO Dashboard | SIDEBAR_ADMIN | enterprise-light |
| `TECH_OPS` | Tech Ops HUD | HUD | cyber-hud |
| `MIIDLE` | Miiddle Workspace | BENTO | wellness-soft |

### Domain-Specific Features

#### Tech Ops HUD

- **Floating panels**: Alerts, incidents, metrics, logs, deployments
- **Real-time updates**: Live system monitoring
- **AI integration**: Incident analysis, log search, root-cause detection

#### PMO Dashboard

- **Sidebar navigation**: Structured menu with sections
- **Widgets**: Initiative progress, health score, capacity, risk feed
- **AI integration**: Strategic analysis, risk assessment, resource optimization

#### Miiddle Workspace

- **Bento grid layout**: Flexible card-based interface
- **Workflow automation**: Visual workflow management
- **Knowledge base**: Integrated knowledge retrieval

---

## AI Presence Layer

### Components

#### AIStatusIndicator

```jsx
import AIStatusIndicator from '@/components/ai/AIStatusIndicator'

<AIStatusIndicator
  state="idle"  // 'idle' | 'active' | 'processing' | 'typing'
  message="AI Ready"
  showGlow={true}
  onClick={() => console.log('AI clicked')}
/>
```

#### AIPresenceLayer

```jsx
import AIPresenceLayer from '@/components/ai/AIPresenceLayer'

<AIPresenceLayer
  domain="TECH_OPS"
  appView="TECH_OPS"
  initialState="idle"
  onStateChange={(state) => console.log('AI state:', state)}
  onMessage={(userMsg, aiMsg) => console.log('Messages:', userMsg, aiMsg)}
/>
```

### AI States

| State | Label | Description | Behavior |
|---|---|---|---|
| `idle` | Ready | AI is available and waiting | Steady glow |
| `active` | Active | AI is processing your request | Pulsing glow |
| `processing` | Thinking | AI is analyzing data | Faster pulse |
| `typing` | Typing | AI is generating response | Typing animation |

---

## Motion System

### Enhanced Motion Library

```jsx
import {
  TRANSITIONS,
  fadeIn,
  slideIn,
  scaleIn,
  hoverEffects,
} from '@/lib/motionEnhanced'
```

### Usage Examples

#### Fade In

```jsx
import { motion } from 'framer-motion'
import { fadeIn } from '@/lib/motionEnhanced'

<motion.div {...fadeIn(0.1)}>
  Content fades in with 100ms delay
</motion.div>
```

#### Slide In

```jsx
<motion.div {...slideIn('up', 20, 0)}>
  Content slides up from 20px
</motion.div>
```

#### Hover Effects

```jsx
<motion.button
  whileHover={hoverEffects.scale.hover}
  whileTap={hoverEffects.scale.tap}
>
  Button with hover and tap effects
</motion.button>
```

#### Staggered List

```jsx
import { staggeredVariants } from '@/lib/motionEnhanced'

<motion.ul
  variants={staggeredVariants.container}
  initial="hidden"
  animate="visible"
>
  {items.map((item, index) => (
    <motion.li
      key={item.id}
      variants={staggeredVariants.item}
      style={{ '--stagger-index': index }}
    >
      {item.text}
    </motion.li>
  ))}
</motion.ul>
```

### Animation Variants

Available variants:

- `fadeVariants` - Simple fade in/out
- `scaleVariants` - Scale animation
- `slideUpVariants` - Slide up
- `slideDownVariants` - Slide down
- `slideLeftVariants` - Slide from left
- `slideRightVariants` - Slide from right
- `staggeredVariants` - Staggered children
- `accordionVariants` - Accordion expand/collapse
- `drawerVariants` - Drawer slide in/out
- `modalVariants` - Modal entrance/exit
- `toastVariants` - Toast notifications
- `tooltipVariants` - Tooltips

### Reduced Motion Support

The motion system automatically respects `prefers-reduced-motion`:

```jsx
import { reduceMotion, isMotionReduced } from '@/lib/motionEnhanced'

// Get reduced-motion-aware props
const motionProps = reduceMotion({
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
})

// Check if reduced motion is enabled
if (isMotionReduced()) {
  // Use simpler animations
}
```

---

## Component Examples

### Glass Panel

```jsx
<div className="glass-panel glass-panel--elevated chrome-edge">
  Content with glass effect
</div>
```

### Bento Metric Card

```jsx
import { BentoMetricCard } from '@/components/layouts/BentoGrid'
import { TrendingUp } from 'lucide-react'

<BentoMetricCard
  title="Revenue"
  value="$2.4M"
  trend="↑ 12% vs last month"
  trendPositive={true}
  icon={<TrendingUp />}
  color="var(--accent)"
  size="medium"
/>
```

### PMO Widget Card

```jsx
import { PmoWidgetCard } from '@/components/layouts/PmoDashboard'

<PmoWidgetCard
  title="Total Initiatives"
  value="24"
  trend="↑ 3 this quarter"
  trendPositive={true}
/>
```

### HUD Panel

```jsx
<motion.div className="hud-panel glass-panel">
  <div className="hud-panel__header">
    <Activity className="text-[var(--accent)]" />
    <span>System Metrics</span>
  </div>
  <div className="hud-panel__content">
    {/* Panel content */}
  </div>
</motion.div>
```

---

## Migration Guide

### From Theme Engine v1 to v2

#### 1. Update CSS Import

```css
/* Old */
@import './styles/theme-engine.css';

/* New */
@import './styles/theme-engine-v2.css';
```

#### 2. Update Preset Usage

```jsx
// Old
import { THEME_PRESETS } from '@/lib/themePresets'

// New
import { THEME_PRESETS_V2 } from '@/lib/themePresetsV2'
```

#### 3. Update Theme IDs

| Old ID | New ID |
|---|---|
| `pmo` | `enterprise-light` |
| `tech_ops` | `cyber-hud` |
| `miidle` | `wellness-soft` |
| `midnight` | `dark-glass` |
| `assist_hc` | `enterprise-light` (with accessibility features) |

#### 4. Update Layout Components

Replace existing layout components with new v2 versions:

```jsx
// Old
import SidebarAdmin from '@/layouts/SidebarAdmin'

// New
import PmoDashboard from '@/components/layouts/PmoDashboard'
```

#### 5. Update Motion Imports

```jsx
// Old
import { fadeScaleFast } from '@/motion/presets'

// New
import { TRANSITIONS, fadeIn } from '@/lib/motionEnhanced'
```

### Breaking Changes

1. **Theme IDs changed**: Update theme IDs throughout the codebase
2. **Layout modes now use data-layout-mode**: Instead of operating mode
3. **AI presence layer is separate**: Import from `/components/ai/`
4. **Motion system is enhanced**: New library with more features

### Compatibility Mode

To maintain compatibility during migration, you can create an alias:

```jsx
// src/lib/themePresetsV2-compat.js
import { THEME_PRESETS_V2 } from './themePresetsV2'

// Map old IDs to new IDs for backward compatibility
export const THEME_PRESETS = [
  { id: 'pmo', label: 'Command (PMO)' },
  { id: 'tech_ops', label: 'Operations (Tech)' },
  // ...
]

export function isValidThemePreset(id) {
  const mapping = {
    'pmo': 'enterprise-light',
    'tech_ops': 'cyber-hud',
    'miiddle': 'wellness-soft',
    'midnight': 'dark-glass',
    'assist_hc': 'enterprise-light',
  }
  const newId = mapping[id] || id
  return THEME_PRESETS_V2.some(p => p.id === newId)
}
```

---

## Best Practices

### Theme Selection

1. **Match domain to theme**: Use default themes for each domain
2. **Consider accessibility**: `enterprise-light` is best for high-contrast needs
3. **User preference**: Allow users to override defaults

### Layout Mode Selection

1. **PMO**: Use `SIDEBAR_ADMIN` for structured navigation
2. **Tech Ops**: Use `HUD` for real-time monitoring
3. **Miiddle**: Use `BENTO` for flexible content

### Motion Guidelines

1. **Respect reduced motion**: Always use the motion helper functions
2. **Keep animations fast**: Use `fast` or `normal` transitions (0.2-0.3s)
3. **Use stagger wisely**: 0.05s delay between items is optimal
4. **Provide feedback**: Use hover effects for interactive elements

### AI Integration

1. **Show state clearly**: Always display AI status
2. **Provide context**: Include relevant capabilities
3. **Handle errors gracefully**: Show fallback UI when AI is unavailable

---

## Troubleshooting

### Theme Not Applying

1. Check that `data-theme` is set on `<html>` element
2. Verify theme ID is valid
3. Check CSS import order

### Layout Not Working

1. Verify `data-layout-mode` is set on `<html>` element
2. Check for conflicting CSS
3. Ensure parent container has proper height

### Motion Not Working

1. Check if `prefers-reduced-motion` is enabled
2. Verify Framer Motion is installed
3. Check for missing variant definitions

### AI Status Not Updating

1. Verify `AIPresenceLayer` is mounted
2. Check state update callbacks
3. Ensure domain configuration is correct

---

## Next Steps

1. **Update existing components** to use new theme engine
2. **Implement domain-specific dashboards** for each domain
3. **Add AI integration** to relevant views
4. **Test accessibility** with reduced motion enabled
5. **Gather user feedback** on new themes and layouts

---

## Support

For issues or questions:

1. Check this guide first
2. Review component source code
3. Test with different themes and layouts
4. Verify browser compatibility

---

**Version**: 2.0.0
**Last Updated**: 2024-03-28
