# Neeva AI – Objectives, Problem Definition, Requirements, and Methodology

## Objectives of the System
- Provide instant, empathetic AI support for youth mental wellness.
- Reduce friction in daily mood logging, journaling, and reflection.
- Offer guided CBT and mindfulness sessions with pre-configured, easy-to-start flows.
- Ensure safety with crisis-sensitive responses and localized resources.
- Deliver a visually appealing, accessible, and user-friendly interface across devices.
- Maintain strong privacy and security postures for sensitive mental health data.

---

## Problem Definition
While youth increasingly turn to digital platforms for support, practical barriers persist:

1. Inconsistent, Delayed Support
- Access to timely, judgment-free support is limited, especially outside clinical settings.
- Users often abandon apps due to slow or unhelpful responses and lack of direction.

2. High Friction in Self-Care Routines
- Manual journaling/mood logging can feel burdensome.
- Users struggle to decide “what to do next” during stress or anxiety spikes.

3. Lack of Personalization and Gentle Guidance
- One-size-fits-all flows overwhelm users and reduce adherence.
- Youth benefit from concise, compassionate nudges and small steps.

4. Safety and Crisis Handling Gaps
- Many products lack clear escalation guidance and local resources.
- Ambiguous or clinical language can increase distress.

5. Privacy and Trust Concerns
- Sensitive data requires careful handling; unclear policies reduce engagement and trust.

Neeva AI addresses these challenges through an empathetic AI companion, low-friction workflows, guided exercises, and privacy-by-design architecture.

---

## Specific Requirements

### Functional Requirements
- AI Chat Companion
  - Empathetic, concise, non-clinical guidance with crisis sensitivity.
  - Guardrails to avoid diagnosis and to encourage positive action steps.
- Mood Tracking & Journaling
  - Quick daily check-ins, tags, and optional reflections.
  - Trend summaries and gentle insights.
- Guided Exercises
  - CBT/mindfulness flows with streaks and micro-wins.
  - In-session timers, audio/text guidance, and completion receipts.
- Crisis Support
  - Keyword detection and supportive scripts.
  - Localized resource links and encourage contacting trusted persons.
- Insights & Dashboard
  - Patterns over time, adherence, and suggested routines.

### Non-Functional Requirements
- Accessibility & Usability
  - Mobile-first, responsive UI; inclusive design and readable typography.
  - Simple navigation with minimal cognitive load.
- Performance
  - Low-latency AI responses; smooth interactions on mid-range devices.
  - Rate-limit-aware UX and graceful fallbacks.
- Security & Privacy
  - HTTPS/TLS; scoped API keys; least-privilege access.
  - Clear disclaimers; opt-in data practices; minimal PHI; export/delete options.
- Compatibility
  - Modern browsers (Chrome, Firefox, Safari, Edge) and Android/iOS via Capacitor.
- Observability
  - Client logs (non-PII) and optional server metrics for stability/performance.

---

## Minimum System Requirements

### Web/Edge Services
- Processor: Dual-core 2.5 GHz+ (scales with traffic).
- Memory: 8 GB RAM (16 GB+ recommended for heavier analytics).
- Disk: 20–50 GB for app assets, logs, and build artifacts.
- OS: Ubuntu Server, macOS, or Windows Server (64-bit), current LTS preferred.
- Network: Stable connection; CDN delivery for static assets.

### Client Devices
- Browsers: Latest Chrome, Firefox, Safari, Edge.
- Mobile: Android/iOS via Capacitor builds; mid-range devices should run smoothly.
- Connectivity: 5–10 Mbps recommended; tolerate intermittent connectivity.

---

## Methodology

1. Requirements Gathering
- Stakeholder interviews (youth, educators/NGOs, clinicians as advisors).
- Define safety boundaries, privacy expectations, and cultural context (India-first).

2. System Design
- Architecture: React + TS frontend, Capacitor mobile, OpenRouter/Gemini AI layer, optional Supabase for auth/data.
- Modules: Conversation engine, mood/journal, exercise orchestrator, insights, crisis flow.
- Data: Minimal PHI, opt-in analytics, retention policies.

3. Implementation
- Frontend: Type-safe components, Tailwind/Radix/shadcn, Framer Motion micro-interactions.
- AI: System prompt enforcing empathy and safety; keyword heuristics; fallbacks.
- Backend (optional): Supabase auth/storage; Node.js services as needed.

4. Testing
- Unit: Utilities (prompt building, validation, heuristics, reducers).
- Integration: Chat flows, mood logs, exercise progression, rate-limit UX.
- Accessibility: Keyboard navigation, contrast, screen reader checks.
- Safety: Crisis-path tests and safe-response assertions.

5. Deployment
- CI/CD to Netlify (web) and mobile build pipelines for Android/iOS.
- Environment-managed API keys and per-env configurations.
- Monitoring of performance and error rates (non-PII).

6. Maintenance & Updates
- Regular prompt audits and safety reviews.
- Content packs for exercises and localized resources.
- Privacy policy updates and dependency hardening.

7. Documentation
- User Guide: Onboarding, daily check-ins, exercises, and crisis help.
- Technical Docs: Architecture, env vars, prompts, and module boundaries.
- Ethics & Safety: Scope, disclaimers, data handling, escalation policies.

---

## Notes on Scope
Neeva AI is not a diagnostic or therapeutic tool. It provides supportive guidance and educational content. Users in crisis should be directed to local resources and trusted contacts.
