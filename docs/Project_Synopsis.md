# Neeva AI – Youth Mental Wellness Application

## Abstract
Neeva AI is a youth-focused mental wellness application that combines an empathetic AI companion, structured self-help exercises, and a mind wellness studio with analytics to promote emotional resilience, early support, and healthy habits. Built for India’s rapidly evolving mental health landscape, Neeva helps users log moods, reflect, complete evidence-informed CBT and mindfulness sessions, and access crisis resources. The system prioritizes privacy, safety, and accessibility, offering real-time supportive conversations and personalized insights while avoiding diagnosis or therapy claims.

Neeva addresses anxiety, depression, and stress management through immediate, compassionate guidance and seamless daily workflows (check-ins → support → exercises → insights). The design supports high-volume usage (e.g., daily mood logging, guided sessions) and is optimized for low-friction engagement on mobile devices. By aligning technology with warmth and safety, Neeva aims to reduce barriers to care and empower youth to build sustainable mental wellness habits.


## Technical Implementation
- **AI Layer**: Conversations powered via OpenRouter and/or Google Gemini with a specialized system prompt that ensures an empathetic, supportive, non-clinical tone.
- **Frontend**: React 18 + TypeScript + Vite, Tailwind CSS, Radix UI, shadcn/ui; Capacitor for mobile builds.
- **Backend & Data**: Optional Supabase for auth and real-time data; Node.js services where needed.
- **Analytics**: Client-side trend analysis for mood logs and adherence; optional server-side aggregation via Supabase/PostgreSQL.
- **Security & Privacy**:
  - TLS/HTTPS for transport security.
  - Scoped API keys via environment variables.
  - Principle of least privilege for user data.
  - Sensitive content warnings and crisis-handling flows.
- **Performance**: Vite dev server, code-splitting, lightweight components, and haptic-optimized interactions for mobile.


## Key Features
- **AI Mental Health Companion**: Empathetic, concise, and action-oriented responses with crisis sensitivity.
- **Mood Tracking & Journaling**: Daily check-ins, tags, and reflections feeding analytics and insights.
- **CBT & Mindfulness Exercises**: Guided, bite-sized activities with streaks and progress visualization.
- **Mind Wellness Studio**: Curated sessions (breathing, grounding, guided meditations) with supportive audio/text.
- **Community (Optional/Private)**: AI-moderated prompts and safe, anonymous support options.
- **Crisis Support**: Localized crisis information and in-app escalation guidance.
- **Insights Dashboard**: Patterns across time, triggers, and helpful routines; gentle, non-judgmental framing.


## Impact and Applications
- **For Youth**: Accessible, stigma-reduced entry point to emotional support and daily self-care.
- **For Families/Educators (opt-in programs)**: Aggregate, privacy-preserving trends to understand support needs.
- **For NGOs/Institutions**: Scalable, low-cost, multilingual-friendly tool for proactive wellness engagement.
- **Outcomes**: Improved adherence to wellness practices, early identification of distress, and reduced friction in seeking support.


## Research Objectives
### Primary
- **System Development**: Robust AI companion with reliable mood tracking and wellness sessions.
- **Technical Excellence**: Optimize latency, response quality, and UI performance across devices.
- **Safety & Security**: Clear crisis protocols, safe prompting, privacy-by-design storage.
- **User Experience**: Minimal learning curve, inclusive design, gentle tone, offline-tolerant UX.

### Secondary
- **Performance Metrics**: Response time, completion rate of exercises, streak retention, and error rate.
- **Adoption & Engagement**: DAU/WAU, session length, and opt-in feedback ratings.
- **Integration**: Modular APIs for auth, analytics, and content packs; extensible design for institutional pilots.


## Literature Review (Pointers)
- **Digital Mental Health**: Effectiveness of CBT-based digital interventions; adherence strategies and ethical considerations.
- **Conversational Agents**: Empathy modeling, crisis detection heuristics, and guardrails in supportive chat systems.
- **Youth Wellness**: Cultural context in India, language accessibility, and mobile-first engagement.
- **Privacy & Safety**: Best practices for handling sensitive data and crisis escalation in consumer health apps.


## System Design
- **Modules**:
  - **Conversation Engine**: Empathetic system prompt + message history shaping, with crisis keyword heuristics and fallback responses.
  - **Mood & Journal Module**: Structured entries, tagging, and lightweight NLP for trends.
  - **Exercise Orchestrator**: CBT and mindfulness flows, streak logic, and gentle nudges.
  - **Analytics & Insights**: Client-first trend summaries; optional server aggregation with privacy controls.
  - **Error & State Handling**: Resilient UI states, rate limiting UX, and clear user-facing messages.
  - **Output/Receipts**: Session summaries, progress confirmations, and optional export of personal data.
- **Architectural Considerations**:
  - **Scalability**: Stateless frontend + optional serverless APIs; CDN delivery.
  - **Interoperability**: Modular service adapters (OpenRouter, Gemini, Supabase) with env-based switching.
  - **Maintainability**: Strong typing, clear module boundaries, and testable utilities.


## Software Development
- **Frontend**: React 18, TypeScript, Tailwind, Radix UI, shadcn/ui, Framer Motion for micro-interactions.
- **Mobile**: Capacitor for Android/iOS; Android Studio toolchain.
- **AI Integration**: OpenRouter and Gemini clients with structured prompts and safety fallbacks.
- **Data**: Supabase auth and Postgres storage (optional, minimal PHI); environment-driven configuration.
- **Tooling**: VSCode, Node.js 18+, Git workflows, CI/CD to Netlify.


## Core In-App Workflows
- **Daily Check-in → AI Support → Suggested Exercise → Reflection → Insight Update**
- **Crisis Pathway**: Keyword detection → supportive message → localized resources → encourage trusted contact.
- **Onboarding**: Preferences, topics of interest, gentle consent for analytics, and privacy briefing.


## Ethical and Safety Notes
- Not a substitute for professional therapy or diagnosis.
- Clear disclaimers, opt-in data practices, and localization of crisis resources.
- Guardrails for model outputs and safe fallback responses.


## Conclusion
Neeva AI delivers a privacy-aware, empathetic, and engaging mental wellness experience tailored for youth, especially within the Indian context. With a strong technical foundation, clear safety boundaries, and human-centered design, the platform enables consistent self-care, timely support, and meaningful insights—without clinical claims. The modular architecture allows future expansion into schools, NGOs, and community programs while maintaining user trust and safety.
