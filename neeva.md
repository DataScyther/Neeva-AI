# Neeva Design System (neeva.md)

Version: 1.0
Status: Foundation Specification
Product: Neeva AI
Category: Personal AI Wellness Companion

---

# 1. Product Vision

Neeva is not:

* A dashboard
* A chatbot wrapper
* A therapy replacement
* A medical portal
* A productivity application

Neeva is:

* A personal AI companion
* A reflection partner
* A wellness guide
* A memory-aware AI
* A trusted private space

The user should feel:

* Safe
* Calm
* Understood
* Supported
* Intelligent
* Hopeful

Every design decision must reinforce these emotions.

---

# 2. Core Design Principles

Priority Order:

1. Emotional Safety
2. Clarity
3. Personalization
4. Accessibility
5. Beauty
6. Functionality

Every screen must answer:

* Does this reduce anxiety?
* Does this feel personal?
* Does this feel private?
* Does this feel intelligent?

If the answer is no, redesign it.

---

# 3. Visual Identity

Design Language:

* Premium
* Minimal
* Warm
* Intelligent
* Futuristic
* Human

Visual Characteristics:

* Soft glassmorphism
* Ambient depth
* Aurora gradients
* Dynamic edge lighting
* Floating surfaces
* Smooth motion
* Organic spacing

Avoid:

* Corporate SaaS aesthetics
* Clinical healthcare visuals
* Childish illustrations
* Excessive gamification
* Dense dashboards

---

# 4. Mobile First Philosophy

Mobile is the primary platform.

Desktop is an enhancement.

Never design desktop first.

Primary Target Devices:

* iPhone 15 / 16 Pro
* Pixel devices
* Samsung Galaxy S series

Reference Widths:

* 360px
* 390px
* 393px
* 430px

Rules:

* Thumb-friendly interactions
* Minimum touch target: 48x48
* No horizontal scrolling
* Critical actions near thumb zone
* One-handed usability

---

# 5. Landscape Orientation Rules

Landscape support is mandatory.

Use Cases:

* Meditation
* Journaling
* Chat
* Reflection
* Tablet usage

Landscape Layout Pattern:

Left:

* Navigation
* Context
* Memory

Center:

* Main Content

Right:

* Insights
* AI Memory
* Related Actions

Never simply stretch portrait layouts.

---

# 6. Color System

Background:

Primary:
#0A0B14

Secondary:
#121521

Surface:
#171A27

Glass:
rgba(255,255,255,0.08)

Border:
rgba(255,255,255,0.10)

Text:

Primary:
#FFFFFF

Secondary:
#C7D2FE

Muted:
#94A3B8

---

Primary Gradient:

#7C3AED
#A855F7
#3B82F6

---

Emotional Colors

Calm:
#60A5FA

Growth:
#34D399

Reflection:
#A78BFA

Support:
#F472B6

Warning:
#F59E0B

Crisis:
#EF4444

Success:
#22C55E

---

# 7. Typography

Primary Font:

SF Pro Display
SF Pro Text

Fallback:

Inter

Hierarchy:

Display XL:
48px

Display L:
40px

Display M:
32px

Heading:
24px

Subheading:
20px

Body:
16px

Caption:
14px

Button:
16px

Rules:

* Strong hierarchy
* High readability
* No decorative fonts
* Consistent spacing

---

# 8. Spacing System

Base Unit:

4px

Scale:

4
8
12
16
24
32
48
64
96

Rules:

* Consistent rhythm
* No arbitrary spacing
* All layouts use token values

---

# 9. Border Radius

Small:
12px

Medium:
16px

Large:
24px

Pill:
999px

Use consistently.

---

# 10. Glass System

Surface Background:

rgba(255,255,255,0.08)

Blur:

24px

Border:

1px rgba(255,255,255,0.08)

Opacity Range:

0.60
0.70
0.80

Glass surfaces must feel premium and lightweight.

---

# 11. Dynamic Edge Lighting

Neeva Signature Effect

Purpose:

Represent AI intelligence flowing through the interface.

Properties:

1px animated border

Gradient:

Purple
Blue
Pink
Purple

Animation Duration:

6-8 seconds

Infinite Loop

Apply To:

* Authentication Card
* Active Navigation
* Chat Input
* AI Message Cards
* Focused Components

Do Not Apply Everywhere.

Use selectively.

---

# 12. Motion System

Animation Philosophy:

Calm > Fast

Durations:

150ms
250ms
400ms

Effects:

* Breathing glow
* Gentle elevation
* Aurora movement
* Soft fade transitions

Avoid:

* Aggressive motion
* Bouncing effects
* Attention-seeking animations

---

# 13. Navigation System

Mobile:

Bottom Navigation

Primary Tabs:

Home
Chat
Mood
Exercises
Profile

Desktop:

Sidebar Navigation

Persistent
Collapsible

Current page clearly highlighted.

---

# 14. Authentication Experience

Goal:

Trust

Privacy

Personal Connection

Features:

* Dynamic edge lighting
* Glass card
* Continue with Google
* Guest Mode
* Email Login

Priority:

Google
Guest
Email

Trust Message:

Private by Design

User data is never sold.

---

# 15. Dashboard Blueprint

Purpose:

Reflection

Progress

Next Action

Must Include:

* Personalized greeting
* Mood summary
* Recommended action
* Daily reflection
* Recent activity

Avoid:

Analytics overload

---

# 16. Chat Experience

Purpose:

Companionship

Understanding

Reflection

Rules:

* AI feels human
* Context aware
* Memory aware
* Never robotic

Features:

* Persistent memory
* Voice support
* Reflection suggestions
* Smart summaries

Landscape:

Conversation + Memory panel

---

# 17. Mood Tracker

Purpose:

Self-awareness

Not data collection.

Features:

* Mood selection
* Reflection notes
* Trend visualization
* AI observations

Avoid:

Spreadsheet feeling

---

# 18. CBT Studio

Purpose:

Guided Growth

Sections:

* Thought reframing
* Journaling
* Mindfulness
* Guided exercises

Experience should feel guided.

Not educational content management.

---

# 19. Meditation Experience

Purpose:

Calm Environment

Features:

* Full-screen mode
* Ambient visuals
* Breathing animations
* Audio controls

Landscape optimized.

---

# 20. Wellness Insights

Purpose:

Meaningful Understanding

Show:

* Mood trends
* Patterns
* Correlations
* Personalized insights

Avoid:

Complex analytics dashboards

Insight > Data

---

# 21. Community

Purpose:

Belonging

Rules:

* Safe interactions
* Anonymous options
* Positive environment

Never feel like Reddit.

Never feel like a forum.

---

# 22. Crisis Support

Purpose:

Speed

Safety

Clarity

Rules:

* Immediate actions visible
* Large emergency buttons
* Minimal navigation

No distractions.

---

# 23. Settings

Purpose:

Control

Privacy

Customization

Sections:

* Profile
* Privacy
* Notifications
* AI Preferences
* Appearance
* Security

---

# 24. Personalization System

Dynamic Experience

Morning:

Warm Gold

Afternoon:

Neutral

Evening:

Purple Blue

Night:

Deep Indigo

Personalization Includes:

* Greeting
* Recommendations
* Memory Context
* Wellness Suggestions

---

# 25. Accessibility

WCAG AA minimum.

Requirements:

* Keyboard navigation
* Screen reader support
* Contrast compliance
* Reduced motion support
* Focus visibility

Accessibility is not optional.

---

# 26. Design Do Nots

Never:

* Design desktop first
* Create corporate dashboards
* Use random colors
* Add unnecessary charts
* Use excessive shadows
* Create inconsistent spacing
* Add visual clutter
* Sacrifice usability for aesthetics

---

# 27. Development Workflow

Step 1:
Build design tokens.

Step 2:
Build typography system.

Step 3:
Build spacing system.

Step 4:
Build glass system.

Step 5:
Build component library.

Step 6:
Build mobile layouts.

Step 7:
Build landscape layouts.

Step 8:
Build accessibility.

Step 9:
Build motion system.

Step 10:
Build page blueprints.

Never build pages before the design system exists.

Design System → Components → Layouts → Pages

Always in that order.
