# React Native Animated Toast

A beautiful, animated toast component for React Native with haptic feedback.

## Features

- 🎨 Beautiful, minimal design with blur effect
- 🎭 Smooth animations using Reanimated
- 📱 Haptic feedback
- 🎯 Gesture-based dismissal
- 🌈 Multiple variants (success, error, info, warning)
- 🔧 Customizable duration
- 📱 Safe area aware
- 🎨 Theme support

## Installation

```bash
npm install rn-toast-kit
```

### Dependencies

This package requires the following dependencies:

```bash
npm install react-native-reanimated react-native-gesture-handler expo-blur expo-haptics react-native-safe-area-context
```

## Usage

1. Wrap your app with the ToastProvider:

```jsx
import { ToastProvider } from "rn-toast-kit";

export default function App() {
  return (
    <ToastProvider>
      <YourApp />
    </ToastProvider>
  );
}
```

2. Use the Toast methods anywhere in your app:

```jsx
import { Toast } from "rn-toast-kit";

// Success toast
Toast.success("Operation completed successfully!");

// Error toast
Toast.error("Something went wrong!");

// Info toast
Toast.info("Did you know?");

// Warning toast
Toast.warning("Please be careful!");

// Custom duration
Toast.success("Quick message", { duration: 1000 });
```

## API

### Toast Methods

- `Toast.success(message, options?)`
- `Toast.error(message, options?)`
- `Toast.info(message, options?)`
- `Toast.warning(message, options?)`

### Options

```typescript
type ToastOptions = {
  duration?: number; // Duration in milliseconds (default: 3000)
  variant: "success" | "info" | "error" | "warning";
};
```

## License

MIT
