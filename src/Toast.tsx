import {
  ComponentProps,
  createContext,
  ReactNode,
  useCallback,
  useState,
} from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeInUp,
  LinearTransition,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import {
  ToastProps,
  ToastProviderProps,
  ToastMethod,
  ToastOptions,
} from "./types";

const SCREEN_WIDTH = Dimensions.get("window").width;
const DEFAULT_DURATION = 3000;

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const ToastContext = createContext<null>(null);

type CustomToastType = {
  show: (message: string, options: ToastOptions) => void;
  toastInstance: {
    toast: (message: string, options: ToastOptions) => void;
  };
  success: ToastMethod;
  error: ToastMethod;
  info: ToastMethod;
  warning: ToastMethod;
};

const Toast: CustomToastType = {
  toastInstance: {
    toast: () => {},
  },
  show: (message, options) => {
    Toast.toastInstance.toast(message, options);
  },
  success: (message, options) => {
    Toast.toastInstance.toast(message, {
      variant: "success",
      duration: options?.duration,
    });
  },
  error: (message, options) => {
    Toast.toastInstance.toast(message, {
      variant: "error",
      duration: options?.duration,
    });
  },
  info: (message, options) => {
    Toast.toastInstance.toast(message, {
      variant: "info",
      duration: options?.duration,
    });
  },
  warning: (message, options) => {
    Toast.toastInstance.toast(message, {
      variant: "warning",
      duration: options?.duration,
    });
  },
};

const THEME_COLORS = {
  success: "#22c55e",
  info: "#3b82f6",
  error: "#ef4444",
  warning: "#f59e0b",
  muted: "#1f2937",
  foreground: "#ffffff",
};

const ICON: Record<
  ToastOptions["variant"],
  ComponentProps<typeof Ionicons>["name"]
> = {
  success: "checkmark-circle",
  info: "information-circle",
  error: "alert-circle",
  warning: "warning",
};

const ToastUI = ({
  toast,
  close,
}: {
  toast: ToastProps;
  close: (id: string) => void;
}) => {
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector
      gesture={Gesture.Pan()
        .onUpdate((event) => {
          translateX.value = event.translationX;
        })
        .onEnd(() => {
          if (translateX.value > SCREEN_WIDTH * 0.3) {
            translateX.value = withSpring(SCREEN_WIDTH);
            runOnJS(close)(toast.id);
          } else {
            translateX.value = withSpring(0);
          }
        })}
    >
      <Animated.View entering={FadeInUp}>
        <AnimatedBlurView
          intensity={50}
          tint="dark"
          style={[
            animatedStyle,
            styles.toastContainer,
            { backgroundColor: `${THEME_COLORS.muted}70` },
          ]}
        >
          <Ionicons
            name={ICON[toast.options.variant]}
            size={30}
            color={THEME_COLORS[toast.options.variant]}
            style={styles.icon}
          />
          <Animated.Text
            style={[styles.message, { color: THEME_COLORS.foreground }]}
          >
            {toast.message}
          </Animated.Text>
          <Ionicons
            name="close-circle"
            size={24}
            color={THEME_COLORS.foreground}
            onPress={() => close(toast.id)}
            style={styles.closeIcon}
          />
        </AnimatedBlurView>
      </Animated.View>
    </GestureDetector>
  );
};

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const { top } = useSafeAreaInsets();

  const closeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const toast = useCallback(
    (
      message: string,
      { variant, duration = DEFAULT_DURATION }: ToastOptions
    ) => {
      const id = Date.now().toString();
      const newToast = { id, message, options: { variant, duration } };

      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => closeToast(id), duration);
    },
    [closeToast]
  );

  Toast.toastInstance = { toast };

  return (
    <ToastContext.Provider value={null}>
      {children}
      <Animated.FlatList
        itemLayoutAnimation={LinearTransition}
        style={[
          styles.listContainer,
          { height: toasts.length > 0 ? "auto" : 0, marginTop: top },
        ]}
        contentContainerStyle={styles.listContent}
        data={[...toasts].reverse()}
        renderItem={({ item }) => <ToastUI toast={item} close={closeToast} />}
      />
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  listContent: {
    marginHorizontal: 20,
    gap: 10,
  },
  toastContainer: {
    borderRadius: 16,
    overflow: "hidden",
    alignItems: "center",
    flexDirection: "row",
    padding: 8,
  },
  icon: {
    marginRight: 4,
  },
  message: {
    fontSize: 14,
    fontWeight: "500",
    flexShrink: 1,
  },
  closeIcon: {
    marginLeft: "auto",
  },
});

export { Toast };
