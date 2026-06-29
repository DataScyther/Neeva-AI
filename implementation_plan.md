# Implementation Plan

[Overview]
Consolidate the entire Neeva AI Home screen into a single cohesive, premium production-quality design language by standardizing typography, spacing, card/button systems, section headers, background depth, motion, and accessibility—without changing any business logic, navigation, or layout behavior.

The Home screen is currently assembled from multiple incrementally implemented sections. The core functionality works, but visual consistency has drifted: typography varies by component, spacing uses a mix of tokens and hardcoded values, and multiple card/button visual implementations have diverged from shared design primitives. This stabilization pass will align every section to the existing Neeva design system tokens and shared components already present in the codebase (e.g., GlassCard, GradientButton, SectionHeader), then refactor the Home section components to use those primitives consistently and remove duplicated styling/inline “magic numbers”.

Approach: perform a design system audit across each implemented Home section, map inconsistencies to design-system categories (typography/spacing/cards/buttons/headers/background/icons/mood states/motion/accessibility), then implement a controlled refactor that only changes styling and composition (not data flow). Replace duplicated card containers with a single reusable GlassCard-driven card system, consolidate button variants into one reusable button system, ensure consistent section headers, and normalize token usage across the screen. Finally, validate responsiveness and accessibility touch targets and reduced-motion behavior.

[Types]
No new business logic types are required; styling refactors may introduce new prop types only if existing shared components lack them. Introduce or reuse a small set of design-system prop interfaces to standardize components.

Planned type additions (only if needed during refactor):
- `HomeSectionVariant` (enum/union) to standardize card/header theme variants:
  - `'glass-default' | 'glass-dark' | 'glass-light'`
- `ButtonVariant` (union) for a unified button system:
  - `'primary' | 'secondary' | 'ghost' | 'text' | 'gradient'`

Validation rules:
- Visual components must only accept token-driven values (no hardcoded numeric font sizes/radii/shadows except where wrapped by tokens).

[Files]
Detailed breakdown:
- New files to be created:
  - `Neeva-AI/src/core/theme/spacingTokens.ts` (if spacing tokens need extension beyond `tokens.ts`)
  - `Neeva-AI/src/core/theme/typographyTokens.ts` (if typography tokens need extension beyond `tokens.ts`)
  - `Neeva-AI/src/shared/components/HomeCardShell.tsx` (optional: wrapper that guarantees consistent GlassCard layout/padding/border radius per “card system”)
  - `Neeva-AI/src/shared/components/NevaButton.tsx` (optional: unified button system if current GradientButton/Button diverge)
  - `Neeva-AI/src/shared/components/SectionHeaderTrailingAction.tsx` (optional: standard trailing action layout)

- Existing files to be modified:
  - `Neeva-AI/src/features/home/screens/HomeScreen.tsx`
    - Replace any hardcoded screen-level styles and repeated typography blocks with tokenized/shared components.
    - Remove “magic numbers” in HomeScreen styles (e.g., `paddingBottom: 110`, fixed widths, font sizes in bubble/restore/completed blocks) by introducing token-based styles or delegating to shared components.
    - Ensure consistent card wrappers for “Recommendation dismissed”, “Session Commenced”, and any temporary GlassCard containers.
  - `Neeva-AI/src/features/home/components/*.tsx`
    - For every implemented Home section component: enforce consistent Typography + Spacing tokens, ensure every card shell is derived from `GlassCard` (directly or via a new `HomeCardShell`).
    - Normalize section header usage:
      - Replace ad-hoc headers with `SectionHeader` or standardized `SectionHeader` props.
    - Normalize buttons:
      - Replace component-specific button styles with the unified button component (existing `GradientButton` or shared `Button`).
    - Normalize icons:
      - Enforce consistent size/stroke by using tokenized icon props or wrapper.
    - Mood cards / mood selection:
      - Standardize selected/pressed styles, elevation, gradient border, and glass intensity via shared mood-card primitives (refactor only styling and animation parameters).
    - Weekly History:
      - Ensure day indicators, selection/completed states, and spacing/animations match the card system and typography system.
  - `Neeva-AI/src/shared/components/GlassCard.tsx`
    - Ensure it meets the card-system requirements (consistent border radius, blur opacity, gradient border support, consistent shadow/elevation).
    - Add missing props (e.g., gradient border control) rather than relying on `className` hacks in each card.
  - `Neeva-AI/src/shared/components/GradientButton.tsx` and/or `Neeva-AI/src/shared/components/Button.tsx`
    - Consolidate into a single “button system” with variants and shared sizing rules.
    - Ensure consistent height, radius, shadow, typography.
  - `Neeva-AI/src/shared/components/SectionHeader.tsx`
    - Standardize title/subtitle/action row layout and uppercase/letterSpacing rules using typography tokens.
  - `Neeva-AI/src/features/home/components/AuroraBackground.tsx`
    - Improve radial gradient layering and opacity depth using tokenized values; ensure subtle non-distracting behavior.
  - `Neeva-AI/src/core/theme/index.ts`
    - Export any new tokens or helper theme utilities if introduced.
  - `Neeva-AI/src/core/theme/tokens.ts` and `Neeva-AI/src/core/theme/colors.ts`
    - Extend tokens only if needed to remove remaining hardcoded values across Home.

- Configuration file updates:
  - None expected; may update `tailwind.config.js` only if the project requires token-to-tailwind class generation for new token classes.

[Functions]
Single sentence describing function modifications.

Detailed breakdown:
- New functions (if any):
  - None expected beyond small style helper factories that map variants to tokenized styles.

- Modified functions:
  - `HomeScreen()` in `Neeva-AI/src/features/home/screens/HomeScreen.tsx`
    - Refactor inline styles (`styles.*`) to tokenized equivalents.
    - Replace ad-hoc GlassCard styling blocks with shared card-shell component(s).
  - Render functions inside every file under `Neeva-AI/src/features/home/components/*.tsx`
    - Replace hardcoded text styles (fontSize/fontWeight/letterSpacing/textTransform/lineHeight) with typography tokens.
    - Replace hardcoded padding/margins with spacing tokens.
    - Replace per-component card container styling with `GlassCard` (or `HomeCardShell`).

- Removed functions:
  - None required; only remove style helpers/constants once they are fully replaced with shared primitives.

[Classes]
Single sentence describing class modifications.

Detailed breakdown:
- New classes:
  - None (React components only).

- Modified components:
  - `GlassCard` (`Neeva-AI/src/shared/components/GlassCard.tsx`)
    - Enhance/standardize card-system props (e.g., border/gradient control) so Home sections stop embedding card styling.
  - `GradientButton`/`Button` (shared button system)
    - Add/normalize variants and sizing rules so Home cards stop implementing local button variants.

[Dependencies]
Single sentence describing dependency modifications.

Details:
- No new runtime dependencies are required.
- Use existing libraries already present in the repo: `react-native-reanimated`, `lucide-react-native`, existing shared components, and existing token/theming files.

[Testing]
Single sentence describing testing approach.

Details:
- Run TypeScript build/lint to ensure no broken imports or token references.
- Validate the Home screen render on iOS and Android:
  - Verify typography hierarchy, grid/card alignment rhythm, section header consistency, and button height/radius/shadow uniformity.
- Validate accessibility:
  - Ensure each interactive element has `accessibilityRole`, `accessibilityLabel` (when applicable), and touch target size >= 44px.
  - Check reduced motion preferences where animations exist (avoid motion overload, ensure reduced motion doesn’t break layout).
- Validate performance:
  - Confirm no new repeated renders introduced by wrapper components; keep keys stable for any list/timeline components.

[Implementation Order]
Single sentence describing the implementation sequence.

Numbered steps:
1. Create `implementation_plan.md` in repo root for traceability.
2. Inventory inconsistencies by reading all Home components and shared primitives (cards/buttons/headers/background) to locate hardcoded values and duplicated layouts.
3. Refactor design primitives first: update `GlassCard`, `GradientButton`/`Button`, and `SectionHeader` to encode design-system invariants via tokens.
4. Add `HomeCardShell` (optional) to guarantee card-system consistency invariants across every Home card.
5. Refactor each Home section component to use:
   - typography tokens
   - spacing tokens
   - standardized card shell
   - standardized button variants
   - standardized section headers
6. Normalize AuroraBackground layering and opacity depth to match the established subtle depth requirement.
7. Standardize motion usage and reduced-motion handling across the Home screen.
8. Perform accessibility + touch target pass across all interactive elements.
9. Performance pass: remove remaining inline “magic numbers” that cause style drift and ensure animation calls remain lightweight.
10. Final production readiness checklist: confirm no duplicated UI, no hardcoded typography/spacing/radius/shadow values remain in Home, and visual alignment is grid-consistent while scrolling.
