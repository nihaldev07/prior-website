"use client";
import React, { useEffect, useRef } from "react";

interface YukiChatWidgetProps {
  pageId: string; // Facebook Page ID
  theme?: {
    primaryColor?: string;
    textColor?: string;
    backgroundColor?: string;
    borderRadius?: string;
  };
  websiteUrl?: string; // Optional, if you want to set a specific website URL
  position?: "bottom-right" | "bottom-left";
  welcomeMessage?: string;
  onWidgetOpen?: () => void;
  onMessengerOpen?: () => void;
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    YukiChatWidget?: {
      show: () => void;
      hide: () => void;
      openMessenger: () => void;
      setConfig: (config: any) => void;
    };
  }
}

const YukiChatWidget: React.FC<YukiChatWidgetProps> = ({
  pageId,
  theme,
  position = "bottom-right",
  welcomeMessage,
  onWidgetOpen,
  websiteUrl = "",
  onMessengerOpen,
}) => {
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const isLoadedRef = useRef(false);

  useEffect(() => {
    // Prevent double loading
    if (isLoadedRef.current) return;

    // Remove existing widget if any
    const existingWidget = document.getElementById("yuki-chat-widget");
    if (existingWidget) {
      existingWidget.remove();
    }

    const existingStyles = document.getElementById("yuki-widget-styles");
    if (existingStyles) {
      existingStyles.remove();
    }

    // Load the widget script
    const script = document.createElement("script");
    script.src = `${
      websiteUrl || "https://yourdomain.com"
    }/widget/chat-widget.min.js`;
    script.setAttribute("data-page-id", pageId);

    if (theme) {
      script.setAttribute("data-theme", JSON.stringify(theme));
    }

    if (position) {
      script.setAttribute("data-position", position);
    }

    if (welcomeMessage) {
      script.setAttribute("data-welcome-message", welcomeMessage);
    }

    script.onload = () => {
      isLoadedRef.current = true;

      // Set up event listeners if callbacks provided
      if (onWidgetOpen || onMessengerOpen) {
        // Override tracking function to call our callbacks
        const originalConsoleLog = console.log;
        console.log = (...args) => {
          if (args[0] === "Yuki Chat Widget Event:") {
            const eventName = args[1];
            if (eventName === "widget_opened" && onWidgetOpen) {
              onWidgetOpen();
            } else if (eventName === "messenger_opened" && onMessengerOpen) {
              onMessengerOpen();
            }
          }
          originalConsoleLog.apply(console, args);
        };
      }
    };

    script.onerror = () => {
      console.error("Failed to load Yuki Chat Widget");
    };

    document.head.appendChild(script);
    scriptRef.current = script;

    // Cleanup function
    return () => {
      if (scriptRef.current) {
        document.head.removeChild(scriptRef.current);
      }

      // Remove widget elements
      const widget = document.getElementById("yuki-chat-widget");
      if (widget) {
        widget.remove();
      }

      const styles = document.getElementById("yuki-widget-styles");
      if (styles) {
        styles.remove();
      }

      // Remove global reference
      if (window.YukiChatWidget) {
        delete window.YukiChatWidget;
      }

      isLoadedRef.current = false;
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // This component doesn't render anything visible
  // The widget is injected via script
  return null;
};

export default YukiChatWidget;

// Hook for programmatic control
export const useYukiChatWidget = () => {
  const showWidget = () => {
    if (window.YukiChatWidget) {
      window.YukiChatWidget.show();
    }
  };

  const hideWidget = () => {
    if (window.YukiChatWidget) {
      window.YukiChatWidget.hide();
    }
  };

  const openMessenger = () => {
    if (window.YukiChatWidget) {
      window.YukiChatWidget.openMessenger();
    }
  };

  const updateConfig = (config: any) => {
    if (window.YukiChatWidget) {
      window.YukiChatWidget.setConfig(config);
    }
  };

  return {
    showWidget,
    hideWidget,
    openMessenger,
    updateConfig,
  };
};
