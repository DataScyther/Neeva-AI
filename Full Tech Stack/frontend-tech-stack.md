# Neeva AI Frontend Technology Stack
implification
Version: 1.0

Purpose:
Defines the approved frontend technologies for Neeva AI.

Any new dependency must provide significant value over the existing stack.

---

# MVP Rule: Keep the required stack lean

Required technologies must directly improve one of:

1. User Experience
2. Product Quality
3. Portfolio Quality
4. Interview Demonstration Value

Features that don’t materially improve MVP outcomes belong in “Future Enhancement”.

---

# Core Frontend Stack

## React

Status: Required

Purpose:

* UI rendering
* component architecture
* frontend foundation

---

## TypeScript

Status: Required

Rules:

* Strict Mode enabled
* No implicit any
* Prefer interfaces for public contracts

---

## Vite

Status: Approved

---

## Tailwind CSS

Status: Required

Rules:

* Prefer utility classes
* Avoid custom CSS when possible
* Use design tokens

---

## shadcn/ui

Status: Required

---

## Radix UI

Status: Required

---

# State / Data / Forms

## Zustand

Status: Required

Use for:

* global client state (auth + UI state)

Do not use for:

* query/cache data

---

## TanStack Query

Status: Required

Use for:

* server reads
* synchronization and background refetching

---

## React Hook Form

Status: Required

---

## Zod

Status: Required

Use for:

* runtime validation
* form validation
* API validation

---

# UI / UX Libraries

## Motion

Status: Approved

---

## Lucide React

Status: Approved

---

## Sonner

Status: Approved

---

## Recharts

Status: Approved

---

# Backend & Mobile Runtime

## Firebase Auth

Status: Required

---

## Firestore

Status: Required

---

## Capacitor

Status: Required

---

## NVIDIA API

Status: Required

(Frontend uses the AI Service Layer; do not call providers directly.)

---

# AI Architecture (Simplified, Flagship)

Target flow:

Frontend
↓
AI Service Layer
↓
POST /api/ai/chat
↓
NVIDIA API

Rules:

* Keep provider abstraction.
* Do not introduce multi-provider routing.
* Do not introduce agent orchestration.
* Do not introduce enterprise gateway patterns.

---

# Streaming

Streaming Transport Policy:

* Use Fetch Streaming only.

Do not include SSE fallback requirements.

---

# Future Enhancements (not required for flagship MVP)

The following are explicitly future enhancements (must not be marked Required):

* Dexie
* Offline Queue Architecture (offline writes + durable sync)
* Biometric Authentication
* Advanced PWA Features (complex offline strategies + offline write queueing)
* Complex offline synchronization / reconciliation

---

# Installation Lists

## Required Installation List

npm install zustand
npm install @tanstack/react-query
npm install react-hook-form
npm install zod
npm install motion
npm install lucide-react
npm install recharts

npm install @capacitor-community/face-id
npm install @capacitor/cli

## App Notes (do not add unless justified for MVP)

* Keep dependency count minimal.
* Every required dependency must improve:
  1) User Experience
  2) Product Quality
  3) Portfolio Quality
  4) Interview Demonstration Value

---

# Rejected Technologies

Do Not Introduce:

* Redux
* MobX
* GraphQL
* Apollo Client
* jQuery
* Bootstrap
* Material UI
* Chakra UI
* Multiple UI Libraries
* Direct LLM Calls From Frontend

Reason:
Increased complexity with minimal benefit for Neeva AI.

---

# Frontend Philosophy

The frontend must be:

* Mobile-first
* Accessible
* Performant
* Maintainable

Technology choices should optimize for product shipping—not experimenting with frameworks.

# Neeva AI Frontend Technology Stack

Version: 1.1 (Enforced Refactor Spec)

Purpose:
Defines the approved frontend technologies for Neeva AI.

Any new dependency must provide significant value over the existing stack.

---

# MVP Rule: Keep the required stack lean

Required technologies must directly improve one of:

1. User Experience
2. Product Quality
3. Portfolio Quality
4. Interview Demonstration Value

Features that don’t materially improve MVP outcomes belong in “Future Enhancement”.

# Core Frontend Stack

## Framework

React 19

Purpose:

* UI Rendering
* Component Architecture
* Frontend Foundation

Status:
Approved

---

## Language

TypeScript

Purpose:

* Type Safety
* Better Refactoring
* AI Agent Compatibility
* Maintainability

Rules:

* Strict Mode Enabled
* No implicit any
* Prefer interfaces for public contracts

Status:
Required

---

## Build Tool

Vite

Purpose:

* Development Server
* Build Pipeline
* HMR

Why:

* Fastest development experience
* Excellent React support
* Simple configuration

Status:
Approved

---

# Styling

## Tailwind CSS v4

Purpose:

* Utility-first styling
* Design consistency
* Faster development

Rules:

* Prefer utility classes
* Avoid custom CSS when possible
* Use design tokens

Status:
Required

---

# Component System

## shadcn/ui

Purpose:

* Base UI Components
* Accessibility
* Consistency

Components:

* Button
* Input
* Dialog
* Sheet
* Tabs
* Dropdown
* Select
* Toast

Status:
Required

---

## Radix UI

Purpose:

* Accessibility primitives
* Complex UI interactions

Status:
Required

---

# Icons

## Lucide React

Purpose:

* Consistent iconography

Status:
Approved

---

# Animation

## Motion

Purpose:

* Page transitions
* Micro interactions
* Edge lighting animations

Rules:

* Keep animations subtle
* Prioritize performance

Status:
Approved

---

# Forms

## React Hook Form

Purpose:

* Form state management

Use For:

* Authentication
* Mood Tracking
* Settings
* User Preferences

Status:
Required

---

## Zod

Purpose:

* Runtime validation
* Form validation
* API validation

Status:
Required

---

# State Management

## Zustand

Purpose:

* Global Client State

Use For:

* Authentication State
* User Preferences
* UI State
* Theme State

Do Not Use For:

* API Data
* Query Data

Status:
Required

---

# Server State

## TanStack Query

Purpose:

* API Caching
* Data Synchronization
* Background Refetching

Use For:

* Firestore Queries
* User Data
* Analytics Data
* Chat History

Status:
Required

---

# Charts

## Recharts

Purpose:

* Mood Analytics
* Wellness Trends
* Insights Dashboard

Status:
Approved

---

# Date Handling

## date-fns

Purpose:

* Date Formatting
* Relative Time
* Calendar Features

Status:
Approved

---

# Notifications

## Sonner

Purpose:

* Toast Notifications

Status:
Approved

---

# Theme System

## next-themes

Purpose:

* Theme Management
* Dark Mode

Status:
Approved

---

# Mobile Layer

## Capacitor

Purpose:

* Android Packaging
* iOS Packaging
* Native Device Access

Status:
Approved

---

# Analytics

## PostHog

Purpose:

* Product Analytics
* Feature Usage Tracking
* Retention Analysis

Status:
Approved

---

# Monitoring

## Sentry

Purpose:

* Error Tracking
* Performance Monitoring

Status:
Approved

---

# AI Integration Layer (Enforced)

Frontend must never directly call:

* Gemini
* Claude
* GPT
* NVIDIA NIM

Frontend communicates only with:

```text
AI Service Layer
```

Architecture:

```text
Frontend
    ↓
AI Service Layer (src/services/ai)
    ↓
API Layer (REST/SSE/streaming endpoints)
    ↓
AI Gateway
    ↓
LLM Providers
```

Status:
Required

---

## Streaming AI Contract (Required)

UI must support streaming responses for chat.

### Transport

* Fetch Streaming only

### Provider adapter output (contract)

The AI Service Layer must expose one of the following (preferred: fetch streaming):

```ts
type StreamChunk = {
  id: string;          // stable completion/message id
  contentDelta: string; // incremental token/text
  reasoningDelta?: string; // optional incremental reasoning
  done?: boolean;     // true when finished
};

async function generateResponseStream(params: {
  uid: string;
  conversationId?: string;
  input: {
    text: string;
    attachments?: Array<{ mimeType: string; name: string; size: number }>;
  };
  history: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
}): AsyncIterable<StreamChunk>;
```

### UI behavior rules

* Insert an assistant message immediately (empty initial content).

* Append `contentDelta` as chunks arrive.
* Render a typing/loading indicator while stream is active.
* Finalize the assistant message when `done === true`.
* Never block the UI waiting for the full payload.

---

## Offline Tolerance (Optional future support)

The app must be resilient to intermittent connectivity.

### Persistence

* Use **IndexedDB (Dexie)** for offline caching of:
  * pending mood entries
  * pending chat messages (optimistic drafts)
  * pending exercise completions

* Use TanStack Query for server reads, but offline writes must go through a service abstraction that persists to IndexedDB first.

### Sync strategy

* Queue writes while offline.

* Flush queue when online.
* On flush success:
  * reconcile server state
  * invalidate relevant TanStack Query caches

Status:
Future Enhancement

---

## Biometric Protection (Optional future support)

Enable biometric unlock for the app on mobile.

### Plugin

* Use: **@aparajita/capacitor-biometric-auth**

### Rules

* Biometric auth must gate access to protected content (chat/mood data).

* The frontend must handle:
  * first-time setup vs returning-user unlock
  * cancellation/denial states
  * fallback to standard login if biometric fails
* Biometric and unlock state must be stored as UI/auth state in Zustand only.

Status:
Future Enhancement

# Approved Installation List

npm install zustand

npm install @tanstack/react-query

npm install react-hook-form

npm install zod

npm install @hookform/resolvers

npm install motion

npm install lucide-react

npm install recharts

npm install date-fns

npm install sonner

npm install next-themes

npm install class-variance-authority

npm install clsx

npm install tailwind-merge

npm install tailwind-merge

npm install @capacitor-community/face-id

npm install @aparajita/capacitor-biometric-auth

---

## Future Enhancement Installation List

npm install dexie

---

# Rejected Technologies

=======

---

# Rejected Technologies

Do Not Introduce
=======

---

# Approved Installation List

## Required Installation List

npm install zustand

npm install @tanstack/react-query

npm install react-hook-form

npm install zod

npm install @hookform/resolvers

npm install motion

npm install lucide-react

npm install recharts

npm install date-fns

npm install sonner

npm install next-themes

npm install class-variance-authority

npm install clsx

npm install tailwind-merge

---

## Future Enhancement Installation List

npm install dexie

npm install @capacitor-community/face-id

npm install @aparajita/capacitor-biometric-auth

---

# Rejected Technologies

Do Not Introduce:

=======

# Approved Installation List

npm install zustand

npm install @tanstack/react-query

npm install react-hook-form

npm install zod

npm install @hookform/resolvers

npm install motion

npm install lucide-react

npm install recharts

npm install date-fns

npm install sonner

npm install next-themes

npm install class-variance-authority

npm install clsx

npm install tailwind-merge

npm install tailwind-merge

npm install @capacitor-community/face-id

npm install @aparajita/capacitor-biometric-auth

---

## Future Enhancement Installation List

npm install dexie

---

# Rejected Technologies

=======

---

# Rejected Technologies

Do Not Introduce:

* Redux
* MobX
* GraphQL
* Apollo Client
* jQuery
* Bootstrap
* Material UI
* Chakra UI
* Multiple UI Libraries
* Direct LLM Calls From Frontend

Reason:
Increased complexity with minimal benefit for Neeva AI.

---

# PWA Support (Future Requirement — High Priority)

Neeva must run as:

* Web
* PWA (installable)
* Android
* iOS

### PWA Rules

* Service worker must:
  * cache static assets (app shell)
  * support best-effort offline reads (where possible)
  * allow offline queueing of writes (mood/chat/exercises)

* Include:
  * manifest.json
  * proper icons
  * offline fallback page (or cached root shell)

### Connectivity UX

* Show connectivity state in UI (subtle indicator).

* Never show blank screens—always show cached/offline content when available.

Status:
High priority (implement in next milestone)

---

# Frontend Philosophy

The frontend must be:

* Mobile First
* AI Native
* Accessible
* Performant
* Maintainable

Technology choices should optimize for shipping product features, not experimenting with frameworks.
