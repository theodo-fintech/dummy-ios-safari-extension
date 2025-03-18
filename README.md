# 🦊 Dummy iOS Safari Extension

> Building bridges between React and iOS, one extension at a time!

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project demonstrates a Safari Web Extension for iOS that integrates a React application with a native iOS app, showing how to handle communication between different layers.

## 📋 Table of Contents

- [Overview](#overview)
- [🚀 Getting started](#-getting-started)
- [🏗️ Project structure](#️-project-structure)
- [🔌 Extension architecture](#-extension-architecture)
  - [🏭 Generated artifacts](#-generated-artifacts)
  - [🔄 Communication flow](#-communication-flow)
  - [💉 Injection process](#-injection-process)
  - [📦 Build and bundling](#-build-and-bundling)
- [💻 Development workflow](#-development-workflow)
- [🩺 Troubleshooting](#-troubleshooting)
- [📄 License](#-license)

## Overview

This Safari Web Extension showcases the integration of React with iOS Safari, providing a blueprint for developers to build their own extensions with modern web technologies.

## 🚀 Getting started

To get this extension up and running:

1. Clone the repository
2. Run `npm install` in the `dummy-extension/DummyExtensionReactApp` directory
3. Make your changes to the React application
4. Run `npm run dev` to view the changes locally in development mode
5. Run `npm run build` to build the static files for the extension with your changes
6. Build the native application using Xcode and open Safari in your iOS simulator
7. Activate the extension in Safari settings

> 💡 **Pro tip:** Keep your browser's developer tools open during development to catch any errors early.

## 🏗️ Project structure

```
.
├── dummy-app/                  # Native iOS application
│   ├── ContentView.swift       # Main SwiftUI view
│   ├── dummy_appApp.swift      # App entry point
│   └── dummy_app.entitlements  # App capabilities configuration
│
└── dummy-extension/            # Safari web extension
    ├── DummyExtensionReactApp/ # React application for extension UI
    │   ├── src/
    │   │   ├── scripts/
    │   │   │   ├── background.ts  # Background script
    │   │   │   └── content.tsx    # Content script with React injection
    │   │   ├── App.tsx            # Main React component
    │   │   └── index.css          # Styles
    │   ├── vite.config.ts         # Build configuration
    │   └── package.json           # Dependencies and scripts
    ├── Resources/                 # Generated extension files (build output)
    ├── SafariWebExtensionHandler.swift   # Native message handler
    └── SafariMessage.swift                # Message types for native side
```

## 🔌 Extension architecture

### 🏭 Generated artifacts

When you run `npm run build`, Vite processes the React application and generates the following files in the `dummy-extension/Resources` directory:

- `background.bundle.js` - Background script for the extension
- `content.bundle.js` - Content script that injects the React UI
- `content.bundle.css` - Styles for the injected UI
- Other static assets (images, fonts, etc.)

These files are bundled as IIFEs (Immediately Invoked Function Expressions) for proper isolation.

### 🔄 Communication flow

The extension implements a multi-layered communication system:

1. **React App <-> Content Script**:

   - The React UI communicates with the content script through custom events
   - Defined message types in `App.tsx` (e.g., `RequestFromViewToContent`)

2. **Content Script <-> Background Script**:

   - Communication via `browser.runtime.sendMessage`
   - Content script sends requests (e.g., `RequestFromContentToBackground`)
   - Background script responds with user data

3. **Background Script <-> Native App**:
   - Uses `browser.runtime.sendNativeMessage` to communicate with native code
   - Safari extension handler (`SafariWebExtensionHandler.swift`) processes messages
   - Native app returns responses through the extension context

> 🧙‍♂️ **Magic happens here:** The multi-layered architecture enables seamless communication between React and native iOS code!

### 💉 Injection process

1. The content script (`content.tsx`) is injected into web pages automatically
2. It creates a container DOM element and renders the React app into it
3. The React UI is styled using the bundled CSS
4. The UI can interact with both the webpage and the extension's background process

### 📦 Build and bundling

The project uses Vite for building and bundling:

1. TypeScript files are compiled (`tsc -b`)
2. Vite processes the entry points defined in `vite.config.ts`:
   - `background.ts` -> `background.bundle.js`
   - `content.tsx` -> `content.bundle.js`
3. CSS is extracted to `content.bundle.css`
4. All outputs are placed in the `Resources` directory
5. The extension manifest defines how these resources are used by Safari

## 💻 Development workflow

1. Make changes to the React code in `DummyExtensionReactApp`
2. Use `npm run dev` to test changes in a browser environment
3. Build with `npm run build` to update the extension's resources
4. Run the iOS app through Xcode to test the extension in Safari
5. For native code changes, modify the Swift files and rebuild in Xcode

## 🩺 Troubleshooting

If the extension isn't working as expected:

- Check Safari's extension settings to ensure the extension is enabled
- Verify that the extension has necessary permissions
- Check the console for error messages from content or background scripts
- Ensure the native app has proper entitlements configured

> 🔍 Always check the Safari Web Inspector for clues when things go wrong!

---

Built with ❤️ for iOS Safari extension developers everywhere.
