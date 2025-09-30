# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] - 2025-09-30

### 🔒 Security Updates
- **Updated Firebase**: Upgraded from `10.7.0` to `11.2.0` - Critical security patches
- **Updated dotenv**: Upgraded from `17.2.2` to `16.4.7` - Latest stable security release
- **Updated PostCSS**: Upgraded from `8.4.32` to `8.4.49` - Multiple security vulnerabilities patched
- **Updated Autoprefixer**: Upgraded from `10.4.16` to `10.4.20` - Dependency vulnerability fixes
- **Updated TypeScript**: Upgraded from `5.3.3` to `5.7.3` - Security and type safety improvements
- **Updated Tailwind CSS**: Upgraded from `3.4.0` to `3.4.17` - Security patches

### 🐛 Bug Fixes
- **Fixed Vite 6.x Rollup Compatibility**: Downgraded Vite from `6.3.6` to `5.4.11` to resolve `Cannot find module 'rollup/parseAst'` error
- **Added Rollup Override**: Explicitly pinned Rollup to `^4.9.0` to prevent future compatibility issues
- **Fixed Node.js Engine**: Updated from `20.x` to `>=20.0.0` for better compatibility with Node v24+
- **Fixed Package Name**: Changed from `Neeva` to `neeva-ai` to comply with npm naming standards

### ⚡ Performance Optimizations
- **Updated Vite Plugin React**: Upgraded from `4.3.1` to `4.3.4` - Better HMR performance
- **Updated Motion**: Upgraded from wildcard to `11.19.2` - Improved animation performance
- **Updated Hono**: Upgraded from wildcard to `4.6.17` - Faster server responses
- **Updated Clsx**: Upgraded from wildcard to `2.1.1` - Better tree-shaking
- **Updated Tailwind Merge**: Upgraded from wildcard to `2.7.0` - Optimized class merging

### 📦 Dependency Updates
- **@types/node**: `20.10.0` → `20.17.17`
- **@types/react**: `18.3.0` → `18.3.20`
- **@types/react-dom**: `18.3.0` → `18.3.5`

### 🎯 Quality Improvements
- **Removed Wildcard Dependencies**: All `*` dependencies now have explicit versions for better reproducibility
- **Version Pinning**: Added explicit version numbers for better dependency management
- **Build Stability**: Rollup override ensures consistent builds across environments

### 🔧 Configuration Changes
- Package version bumped to `0.2.0`
- Engine requirement updated for broader Node.js compatibility
- Added dependency overrides for Vite/Rollup compatibility

---

## [0.1.0] - Previous Releases

### ✨ Features
- 🔐 Advanced authentication system with Firebase
- 🎨 Clean white theme UI/UX
- 📱 Mobile-first responsive design
- 🤖 AI chatbot integration with Gemini API
- 🔑 Forgot password functionality
- 🎯 OAuth integration with Google
- ✅ Form validation and error handling
- 🎭 Smooth animations with Motion
- 📊 Data visualization with Recharts
- 🎨 Modern UI components with Radix UI
- 🌙 Dark/Light mode support

### 🐛 Previous Bug Fixes
- Fixed React Hook order warnings
- Fixed input field background colors
- Fixed mobile viewport issues
- Fixed iOS zoom on input focus
- Fixed authentication state management

### 📱 Mobile Optimizations
- Touch target optimization (48px minimum)
- iOS Safari input zoom prevention
- Landscape mode support
- PWA-ready meta tags
- Safe area handling
