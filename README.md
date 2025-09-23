
# Neeva AI: Next-Gen Mental Health Companion

[![GitHub Release](https://img.shields.io/github/v/release/DataScyther/Neeva-AI?color=4F46E5&style=for-the-badge)](https://github.com/DataScyther/Neeva-AI/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-4F46E5.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-4F46E5.svg?style=for-the-badge)](http://makeapullrequest.com)

---

## 🌟 Project Overview

Neeva AI revolutionizes mental health support by marrying cutting-edge AI with evidence-based therapeutic practices. Designed for *daily emotional maintenance* and *crisis support*, the platform offers:

- 🗨️ Natural language conversations with an empathetic AI companion
- 📈 Data-driven insights into emotional patterns
- 🧠 Clinically-validated CBT exercises
- 🔒 Military-grade encryption for all user data


### Key Technologies
- **Frontend:** React Native, Expo CLI, TypeScript, Vite
- **UI:** Tailwind CSS, Radix UI, Shadcn UI
- **AI:** OpenRouter API, Google Gemini
- **Backend:** Node.js, PostgreSQL, Supabase
- **Deployment:** Netlify

---

## 📋 Table of Contents
- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Installation Instructions](#-installation-instructions)
- [Usage Examples](#-usage-examples)
- [Contributing Guidelines](#-contributing-guidelines)
- [License](#-license)
- [Support & Contact](#-support--contact)

---

## ✨ Key Features

| Feature                     | Description                                  | Benefits                                  |
|-----------------------------|----------------------------------------------|-------------------------------------------|
| 🤖 AI Mental Health Companion| Chat naturally with a supportive AI          | Personalized conversation, empathy        |
| 📊 Mood Tracking            | Log moods, visualize emotional patterns      | Self-awareness, progress tracking         |
| 🧠 CBT Exercises            | Guided cognitive behavioral therapy          | Resilience, healthier habits              |
| 👥 Community Support        | Anonymous forums, connect with others        | Solidarity, shared experiences            |
| 🚨 Crisis Support           | Instant access to helplines & emergency      | Safety, immediate professional help       |
| 📈 Insights Dashboard       | Analytics based on your interactions         | Data-driven growth and self-care          |
| 🧘 Guided Meditation        | Calming, mindfulness sessions                | Reduced anxiety, better sleep             |

---

## 🛠 Technology Stack

- **React (TypeScript):** Type-safe, modular components
- **Tailwind CSS:** Responsive, utility-first design
- **Radix UI & Shadcn UI:** Accessible UI primitives
- **AI Integration:** OpenRouter API, Google Gemini
- **Backend:** Node.js, PostgreSQL, Hasura GraphQL
- **Deployment:** Netlify CI/CD

---

## 🚀 Installation Instructions

### Prerequisites
- Node.js v16+
- npm or Yarn
- pnpm (recommended for rapid builds)

### Setup
Clone the repository
git clone https://github.com/DataScyther/Neeva-AI.git
cd Neeva-AI

Install dependencies
npm install # or: yarn install

Environment variables
cp .env.example .env

Add your API keys in .env file
Run development server
npm run dev # or: yarn dev

Build for production
npm run build

text
Visit `http://localhost:5173` to experience Neeva AI locally.

---

**Conversation Workflow (Mermaid)**
graph LR
A[User Input] --> B(NLP Processing)
B --> C{Emotion Detection}
C --> D[Therapeutic Response]
C --> E[Crisis Detection]
D --> F[Personalized CBT Exercise]
E --> G[Emergency Resources]

---

## 🤝 Contributing Guidelines

- Fork the repository
- Create your feature branch: `git checkout -b feature/your-feature`
- Commit changes and push: `git push origin feature/your-feature`
- Open a Pull Request

**Standards & Practices**
- Adhere to [Code of Conduct](CODE_OF_CONDUCT.md)
- Use Tailwind + Shadcn for UI
- Document your code and add tests
- Report bugs or features using [Issues](https://github.com/DataScyther/Neeva-AI/issues)

---

## 📄 License

Licensed under MIT. See [`LICENSE`](LICENSE) for use, modification, and distribution permissions.

---

## 📞 Support & Contact

- Report issues via [GitHub Issues](https://github.com/DataScyther/Neeva-AI/issues)
- For questions and discussions, join our [GitHub Discussions](https://github.com/DataScyther/Neeva-AI/discussions)
- **Professional contact:**  
  - Email: support@neeva-ai.com *(or your preferred contact)*
  - LinkedIn: [Nishant Kumar](https://www.linkedin.com/in/datascyther/)

*If you’re in crisis, contact local helplines (e.g., India: 9152987821) or emergency services.*

---

*Made with ❤️ by passionate developers for mental health — let's build a kinder future together!*
