# Neeva AI - Mental Health Companion

Neeva AI is an innovative mental health companion application designed to provide personalized support, guidance, and resources for mental wellness. Built with modern web technologies, it offers a safe and approachable platform for users to track their mood, engage in CBT exercises, connect with community support, and access AI-powered mental health assistance.

## Features

- **AI Mental Health Companion**: Chat with Neeva, your personalized AI mental health assistant
- **Mood Tracking**: Monitor and visualize your emotional wellbeing over time
- **CBT Exercises**: Practice evidence-based cognitive behavioral therapy techniques
- **Community Support**: Connect with others on similar mental health journeys
- **Guided Meditation**: Access calming meditation sessions for stress relief
- **Crisis Support**: Immediate access to crisis resources and helplines
- **Insights Dashboard**: Gain valuable insights into your mental health patterns

## Technology Stack

- **Frontend**: React with TypeScript, Vite, Tailwind CSS
- **UI Components**: Radix UI, Shadcn UI
- **State Management**: React Context API
- **AI Integration**: OpenRouter API for LLM capabilities
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/DataScyther/Neeva-AI.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Neeva-AI
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add your OpenRouter API key:
   ```env
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```
   
   You can use the `.env.example` file as a template.

### Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

To create a production build:

```bash
npm run build
```

The build output will be in the `dist` directory.

## Deployment

### Deploying to Netlify

1. **Prepare for deployment**:
   ```bash
   npm run deploy:netlify
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Deploy to Netlify**:
   - Go to [Netlify](https://netlify.com)
   - Connect your GitHub repository or drag and drop the `dist` folder
   - Set the build command to `npm run build`
   - Set the publish directory to `dist`
   - Add your environment variables in the Netlify dashboard:
     - `VITE_OPENROUTER_API_KEY` - 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
     - `VITE_OPENROUTER_MODEL` - deepseek/deepseek-chat-v3.1:free
     - `VITE_OPENROUTER_BASE_URL` - https://openrouter.ai/api/v1
   - Deploy!

## Project Structure

```
src/
├── components/          # React components
├── contexts/            # React context providers
├── hooks/               # Custom React hooks
├── lib/                 # Library functions and utilities
├── styles/              # Global styles
├── utils/               # Utility functions
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
docs/
├── SUPABASE_REDIRECT_URL_UPDATE.md   # Guide to update Supabase redirect URLs
├── SUPABASE_GOOGLE_AUTH_FIX.md       # Guide to fix Google auth redirect URLs
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all contributors who have helped shape Neeva AI
- Special recognition to mental health professionals who provided guidance on best practices