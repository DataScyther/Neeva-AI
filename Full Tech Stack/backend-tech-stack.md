# backend-tech-stack.md

# Neeva AI Backend Technology Stack

Version: 1.0

Purpose:

Defines the approved backend technologies and architecture for Neeva AI.

This document is the single source of truth for backend decisions.

New technologies must provide significant product value before being introduced.

---

# Backend Philosophy

Neeva is a flagship AI Product Engineering project.

Backend decisions must optimize for:

1. Product Quality
2. User Experience
3. Simplicity
4. Maintainability
5. Portfolio Value

Avoid startup-scale infrastructure.

Avoid premature optimization.

---

# Approved Backend Stack

## Authentication

Technology:

Firebase Authentication

Providers:

* Google Authentication
* Email/Password Authentication
* Guest Mode

Status:

Required

---

## Database

Technology:

Firestore

Purpose:

* User Profiles
* Chat Sessions
* Mood Entries
* Reflections
* Goals
* Insights Data

Status:

Required

---

## Backend Functions

Technology:

Firebase Functions

Purpose:

* Secure AI Requests
* Prompt Assembly
* Context Building
* Analytics Processing

Status:

Required

---

# AI Layer

Provider:

NVIDIA API

Status:

Required

Current Policy:

Neeva uses a single AI provider.

Do not introduce:

* Multi-provider routing
* AI orchestration frameworks
* Agent frameworks

without a product requirement.

---

# AI Architecture

Frontend
↓
AI Service Layer
↓
POST /api/ai/chat
↓
Firebase Function
↓
NVIDIA API

Rules:

Frontend must never call NVIDIA directly.

Provider credentials must remain server-side.

---

# Context Builder

Purpose:

Provide lightweight personalization.

Current Sources:

* Recent Conversation History
* Recent Mood History
* User Profile
* Preferred Tone
* Wellness Goals

Storage:

Firestore

Do Not Implement:

* Vector Databases
* RAG
* Embeddings
* Semantic Search

for v1.

---

# API Layer

Approved Endpoint:

POST /api/ai/chat

Purpose:

* AI Conversations
* Streaming Responses
* Context Assembly

Future Endpoints:

POST /api/insights/generate

POST /api/reflection/analyze

Status:

Optional

---

# Streaming

Transport:

Fetch Streaming

Status:

Required

Rules:

* Stream assistant responses
* Support abort requests
* Support loading states

Do not implement SSE fallback.

---

# Data Model

Collections:

users

chatSessions

messages

moodEntries

reflections

insights

Structure should remain simple and human-readable.

---

# Analytics

Version 1:

Firestore-based aggregation.

Examples:

* Weekly Mood Trends
* Reflection Counts
* Mood Distribution

Do not introduce:

* BigQuery
* Snowflake
* Data Warehouses

for v1.

---

# Monitoring

Future Enhancement

Technology:

Sentry

Purpose:

* Error Tracking
* Crash Monitoring

Not required for MVP.

---

# Product Analytics

Future Enhancement

Technology:

PostHog

Purpose:

* Usage Tracking
* Retention Metrics

Not required for MVP.

---

# Future Enhancements

Not Required:

* Redis
* Kafka
* PostgreSQL
* pgvector
* Pinecone
* LangGraph
* CrewAI
* Multi-Agent Systems
* Microservices
* Kubernetes

These technologies require clear product justification before adoption.

---

# Final Approved Backend Stack

Authentication:
Firebase Auth

Database:
Firestore

Backend:
Firebase Functions

AI:
NVIDIA API

Streaming:
Fetch Streaming

Mobile:
Capacitor Compatible

Architecture:
Simple Monolithic Backend

Status:
Approved
