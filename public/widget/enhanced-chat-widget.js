/**
 * Enhanced Yuki Chat Widget - Direct Socket.IO Connection
 * Beautiful, real-time chat widget with user registration
 */

(function () {
  "use strict";

  // Prevent multiple initializations
  if (window.YUKI_WIDGET_SINGLETON) {
    console.log("[Yuki Widget] Widget already initialized - skipping");
    return;
  }
  window.YUKI_WIDGET_SINGLETON = true;

  // Configuration
  const CONFIG = {
    socketUrl: window.location.origin, // Will be set from script or default to current origin
    debug: true, // Enable debug logging by default for troubleshooting
    theme: {
      primaryColor: "#4f46e5",
      secondaryColor: "#e0e7ff",
      successColor: "#10b981",
      errorColor: "#ef4444",
      textColor: "#1f2937",
      lightTextColor: "#6b7280",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      shadowColor: "rgba(0, 0, 0, 0.1)",
    },
    position: "bottom-right",
    messages: {
      welcome: "Welcome! Please provide your details to start chatting.",
      connecting: "Connecting...",
      connected: "Connected! You can now send messages.",
      disconnected: "Connection lost. Trying to reconnect...",
      poweredBy: "Powered by Yuki Chat",
    },
  };

  // Debug logging function
  function debugLog(...args) {
    if (CONFIG.debug) {
      console.log("[Yuki Widget]", ...args);
    }
  }

  // Widget state
  let widget = null;
  let socket = null;
  let isOpen = false;
  let isRegistered = false;
  let sessionData = {};
  let isInitialized = false;

  // Session storage keys
  const STORAGE_KEYS = {
    CUSTOMER_ID: "yuki_customer_id",
    CUSTOMER_NAME: "yuki_customer_name",
    CUSTOMER_PHONE: "yuki_customer_phone",
    CUSTOMER_EMAIL: "yuki_customer_email",
    TICKET_ID: "yuki_ticket_id",
  };

  /**
   * Initialize the chat widget
   */
  function initializeWidget() {
    // Prevent multiple initialization
    if (isInitialized) {
      console.log("Yuki Chat Widget already initialized");
      return;
    }

    // Get configuration from script tag
    const scriptTag = document.querySelector(
      'script[src*="enhanced-chat-widget.js"]'
    );
    if (scriptTag) {
      const socketUrl = scriptTag.getAttribute("data-socket-url");
      if (socketUrl) {
        CONFIG.socketUrl = socketUrl;
      }

      // Override theme if provided
      const customTheme = scriptTag.getAttribute("data-theme");
      if (customTheme) {
        try {
          Object.assign(CONFIG.theme, JSON.parse(customTheme));
        } catch (e) {
          console.warn("Yuki Chat Widget: Invalid theme JSON");
        }
      }

      // Override position if provided
      const position = scriptTag.getAttribute("data-position");
      if (position) {
        CONFIG.position = position;
      }
    }

    createWidget();
    loadSessionData();
    initializeSocket();

    isInitialized = true;
    console.log("Enhanced Yuki Chat Widget initialized");
  }

  /**
   * Load session data from localStorage
   */
  function loadSessionData() {
    const customerId = localStorage.getItem(STORAGE_KEYS.CUSTOMER_ID);
    const customerName = localStorage.getItem(STORAGE_KEYS.CUSTOMER_NAME);
    const customerPhone = localStorage.getItem(STORAGE_KEYS.CUSTOMER_PHONE);
    const customerEmail = localStorage.getItem(STORAGE_KEYS.CUSTOMER_EMAIL);
    const ticketId = localStorage.getItem(STORAGE_KEYS.TICKET_ID);

    if (customerId && customerName && customerPhone) {
      sessionData = {
        customerId,
        customerName,
        customerPhone,
        customerEmail,
        ticketId,
      };
      isRegistered = true;
    }
  }

  /**
   * Save session data to localStorage
   */
  function saveSessionData(data) {
    if (data.customerId)
      localStorage.setItem(STORAGE_KEYS.CUSTOMER_ID, data.customerId);
    if (data.customerName)
      localStorage.setItem(STORAGE_KEYS.CUSTOMER_NAME, data.customerName);
    if (data.customerPhone)
      localStorage.setItem(STORAGE_KEYS.CUSTOMER_PHONE, data.customerPhone);
    if (data.customerEmail)
      localStorage.setItem(STORAGE_KEYS.CUSTOMER_EMAIL, data.customerEmail);
    if (data.ticketId)
      localStorage.setItem(STORAGE_KEYS.TICKET_ID, data.ticketId);

    Object.assign(sessionData, data);
  }

  /**
   * Initialize Socket.IO connection
   */
  async function initializeSocket() {
    // Global check to prevent multiple socket instances
    if (window.YUKI_SOCKET_INSTANCE) {
      debugLog("Global socket instance already exists");
      socket = window.YUKI_SOCKET_INSTANCE;
      if (socket.connected) {
        updateConnectionStatus("connected");
        return;
      }
    }

    // Prevent multiple socket connections
    if (socket) {
      if (socket.connected) {
        debugLog("Socket already connected");
        return;
      } else {
        debugLog("Cleaning up existing socket");
        socket.disconnect();
        socket = null;
      }
    }

    if (typeof io === "undefined") {
      console.error(
        "Socket.IO not found. Please include Socket.IO client library."
      );
      updateConnectionStatus("disconnected");
      return;
    }

    // Skip server health check - let socket connection handle connectivity
    updateConnectionStatus("connecting");

    debugLog(
      "Initializing socket connection to:",
      `${CONFIG.socketUrl}/widget`
    );

    // Add a small delay to prevent rapid connection attempts
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      socket = io(`${CONFIG.socketUrl}/widget`, {
        // Simplified connection configuration
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 5000, // 5 seconds between attempts
        reconnectionDelayMax: 15000,
        timeout: 10000,
        forceNew: false,
        // Try WebSocket first
        transports: ["websocket", "polling"],
        upgrade: true,
        rememberUpgrade: false, // Don't remember upgrade to prevent issues
      });

      // Store globally to prevent duplicates
      window.YUKI_SOCKET_INSTANCE = socket;
      debugLog("Socket.IO client created successfully");
    } catch (error) {
      console.error("Failed to create Socket.IO client:", error);
      updateConnectionStatus("disconnected");
      return;
    }

    socket.on("connect", () => {
      debugLog("Connected to chat server");
      updateConnectionStatus("connected");

      if (isRegistered && sessionData.customerId) {
        debugLog("Attempting to reconnect with existing session");
        // Try to reconnect with existing session
        socket.emit("widget_reconnect", {
          customerId: sessionData.customerId,
          ticketId: sessionData.ticketId,
        });
      } else {
        debugLog("No existing session found");
      }
    });

    socket.on("disconnect", (reason) => {
      debugLog("Disconnected from chat server:", reason);
      updateConnectionStatus("disconnected");

      // Don't try to reconnect if it was intentional
      if (reason === "io client disconnect") {
        debugLog("Intentional disconnect - not reconnecting");
        return;
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error.message);
      updateConnectionStatus("disconnected");

      // If it's a namespace error, stop trying to reconnect
      if (error.message.includes("Invalid namespace")) {
        debugLog("Invalid namespace error - disabling reconnection");
        socket.disconnect();
      }
    });

    socket.on("reconnect", (attemptNumber) => {
      debugLog("Reconnected after", attemptNumber, "attempts");
      updateConnectionStatus("connected");
    });

    socket.on("reconnect_error", (error) => {
      console.error("Reconnection error:", error.message);
      updateConnectionStatus("disconnected");
    });

    socket.on("reconnect_failed", () => {
      console.error("Reconnection failed after all attempts");
      updateConnectionStatus("disconnected");
      debugLog("All reconnection attempts failed - widget will remain offline");
    });

    socket.on("reconnecting", (attemptNumber) => {
      debugLog("Reconnecting... attempt", attemptNumber);
      updateConnectionStatus("reconnecting");

      // Stop after 2 attempts to prevent infinite loop
      if (attemptNumber >= 3) {
        debugLog("Maximum reconnection attempts reached - stopping");
        socket.disconnect();
        socket = null;
        updateConnectionStatus("disconnected");
      }
    });

    // Add cleanup on page unload
    window.addEventListener("beforeunload", () => {
      if (socket && socket.connected) {
        debugLog("Page unloading - disconnecting socket");
        socket.disconnect();
      }
    });

    // Registration responses
    socket.on("registration_success", (data) => {
      isRegistered = true;
      saveSessionData(data);
      showChatInterface();
      addSystemMessage("Registration successful! You can now send messages.");
    });

    socket.on("registration_error", (data) => {
      showError(data.message || "Registration failed");
    });

    // Reconnection responses
    socket.on("reconnect_success", (data) => {
      isRegistered = true;
      saveSessionData(data);
      showChatInterface();
      addSystemMessage("Reconnected to your previous conversation.");

      // Load previous messages if available
      if (data.messages && data.messages.length > 0) {
        loadMessages(data.messages);
      }
    });

    socket.on("reconnect_error", () => {
      // Clear session and show registration form
      clearSession();
      showRegistrationForm();
    });

    socket.on("no_active_ticket", (data) => {
      isRegistered = true;
      saveSessionData(data);
      showChatInterface();
      addSystemMessage(
        "No active conversation found. Start a new conversation!"
      );
    });

    // Message handling
    socket.on("agent_message", (data) => {
      addMessage(
        "agent",
        data.message.content,
        data.message.agentName,
        data.message.timestamp
      );
      playNotificationSound();
    });

    socket.on("message_sent", (data) => {
      // Message sent successfully
      markMessageAsSent(data.messageId);
    });

    socket.on("message_error", (data) => {
      showError(data.message || "Failed to send message");
    });

    // Ticket events
    socket.on("ticket_assigned", (data) => {
      addSystemMessage(
        `You have been connected to ${data.agentName} from ${data.agentDepartment} department.`
      );
    });

    socket.on("agent_typing", (data) => {
      if (data.isTyping) {
        showTypingIndicator("Agent is typing...");
      } else {
        hideTypingIndicator();
      }
    });
  }

  /**
   * Create the widget HTML structure
   */
  function createWidget() {
    widget = document.createElement("div");
    widget.id = "yuki-enhanced-chat-widget";
    widget.innerHTML = getWidgetHTML();

    addWidgetStyles();

    // Append to body first, then add event listeners
    document.body.appendChild(widget);

    // Add event listeners after DOM elements are created and appended
    addEventListeners();
  }

  /**
   * Get widget HTML structure
   */
  function getWidgetHTML() {
    const position = CONFIG.position.includes("right")
      ? "right: 20px;"
      : "left: 20px;";

    return `
      <div class="yuki-widget-container" style="${position}">
        <!-- Chat Button -->
        <div class="yuki-chat-button" id="yuki-chat-button">
          <div class="yuki-chat-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 13.54 2.36 14.99 3.01 16.27L2.05 19.95L5.73 18.99C7.01 19.64 8.46 20 10 20H12C17.52 20 22 15.52 22 10V12C22 6.48 17.52 2 12 2Z" fill="white"/>
            </svg>
          </div>
          <div class="yuki-notification-badge" id="yuki-notification-badge" style="display: none;">1</div>
        </div>

        <!-- Chat Window -->
        <div class="yuki-chat-window" id="yuki-chat-window" style="display: none;">
          <!-- Header -->
          <div class="yuki-chat-header">
            <div class="yuki-header-info">
              <h3>Customer Support</h3>
              <div class="yuki-connection-status" id="yuki-connection-status">
                <span class="yuki-status-dot"></span>
                <span class="yuki-status-text">Connecting...</span>
              </div>
            </div>
            <div class="yuki-header-actions">
              <button class="yuki-minimize-btn" id="yuki-minimize-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M19 13H5V11H19V13Z" fill="currentColor"/>
                </svg>
              </button>
              <button class="yuki-close-btn" id="yuki-close-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Content Area -->
          <div class="yuki-chat-content" id="yuki-chat-content">
            <!-- Registration Form -->
            <div class="yuki-registration-form" id="yuki-registration-form">
              <div class="yuki-form-header">
                <h4>Start a Conversation</h4>
                <p>Please provide your details to connect with our support team.</p>
              </div>
              <form id="yuki-register-form">
                <div class="yuki-form-group">
                  <label for="yuki-name">Full Name *</label>
                  <input type="text" id="yuki-name" name="name" required maxlength="50" placeholder="Enter your full name">
                </div>
                <div class="yuki-form-group">
                  <label for="yuki-phone">Phone Number *</label>
                  <input type="tel" id="yuki-phone" name="phone" required placeholder="Enter your phone number">
                </div>
                <div class="yuki-form-group">
                  <label for="yuki-email">Email Address</label>
                  <input type="email" id="yuki-email" name="email" placeholder="Enter your email (optional)">
                </div>
                <div class="yuki-form-actions">
                  <button type="submit" class="yuki-submit-btn" id="yuki-submit-btn">
                    <span class="yuki-btn-text">Start Chat</span>
                    <span class="yuki-btn-loading" style="display: none;">
                      <svg class="yuki-spinner" width="16" height="16" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="31.416" stroke-dashoffset="31.416">
                          <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                          <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                        </circle>
                      </svg>
                    </span>
                  </button>
                </div>
              </form>
              <div class="yuki-form-footer">
                <small>${CONFIG.messages.poweredBy}</small>
              </div>
            </div>

            <!-- Chat Interface -->
            <div class="yuki-chat-interface" id="yuki-chat-interface" style="display: none;">
              <div class="yuki-messages-container" id="yuki-messages-container">
                <!-- Messages will be added here -->
              </div>
              <div class="yuki-typing-indicator" id="yuki-typing-indicator" style="display: none;">
                <div class="yuki-typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span class="yuki-typing-text">Agent is typing...</span>
              </div>
            </div>
          </div>

          <!-- Input Area (only shown when chat interface is active) -->
          <div class="yuki-input-area" id="yuki-input-area" style="display: none;">
            <div class="yuki-input-container">
              <div class="yuki-message-input">
                <textarea 
                  id="yuki-message-input" 
                  placeholder="Type your message..." 
                  rows="1" 
                  maxlength="1000"
                ></textarea>
                <button class="yuki-send-btn" id="yuki-send-btn" disabled>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M3 20V14L11 12L3 10V4L22 12L3 20Z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="yuki-input-footer">
              <div class="yuki-char-count" id="yuki-char-count">0/1000</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Add widget styles
   */
  function addWidgetStyles() {
    if (document.getElementById("yuki-enhanced-widget-styles")) return;

    const styles = document.createElement("style");
    styles.id = "yuki-enhanced-widget-styles";
    styles.textContent = `
      /* Reset and base styles for widget */
      #yuki-enhanced-chat-widget * {
        box-sizing: border-box;
      }

      /* Widget Container */
      .yuki-widget-container {
        position: fixed;
        bottom: 20px;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        font-size: 14px;
        line-height: 1.4;
      }

      /* Chat Button */
      .yuki-chat-button {
        position: relative;
        width: 64px;
        height: 64px;
        background: linear-gradient(135deg, ${CONFIG.theme.primaryColor}, ${CONFIG.theme.primaryColor}dd);
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 32px ${CONFIG.theme.shadowColor};
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        margin-left: auto;
        border: none;
        outline: none;
      }

      .yuki-chat-button:hover {
        transform: scale(1.1);
        box-shadow: 0 12px 40px ${CONFIG.theme.shadowColor};
      }

      .yuki-chat-button:active {
        transform: scale(0.95);
      }

      .yuki-chat-icon svg {
        transition: transform 0.3s ease;
      }

      .yuki-chat-button:hover .yuki-chat-icon svg {
        transform: rotate(10deg);
      }

      /* Notification Badge */
      .yuki-notification-badge {
        position: absolute;
        top: -8px;
        right: -8px;
        background: ${CONFIG.theme.errorColor};
        color: white;
        border-radius: 12px;
        padding: 2px 8px;
        font-size: 12px;
        font-weight: 600;
        min-width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: yuki-bounce 0.6s ease-in-out;
      }

      @keyframes yuki-bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.3); }
      }

      /* Chat Window */
      .yuki-chat-window {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 380px;
        max-width: calc(100vw - 40px);
        height: 600px;
        max-height: calc(100vh - 120px);
        background: ${CONFIG.theme.backgroundColor};
        border-radius: ${CONFIG.theme.borderRadius};
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: yuki-slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      @keyframes yuki-slideUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Chat Header */
      .yuki-chat-header {
        background: linear-gradient(135deg, ${CONFIG.theme.primaryColor}, ${CONFIG.theme.primaryColor}dd);
        color: white;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .yuki-header-info h3 {
        margin: 0 0 4px 0;
        font-size: 18px;
        font-weight: 600;
      }

      .yuki-connection-status {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        opacity: 0.9;
      }

      .yuki-status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #10b981;
        transition: background-color 0.3s ease;
      }

      .yuki-status-dot.connecting,
      .yuki-status-dot.reconnecting {
        background: #f59e0b;
        animation: yuki-pulse 2s infinite;
      }

      .yuki-status-dot.disconnected {
        background: #ef4444;
      }

      @keyframes yuki-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      .yuki-header-actions {
        display: flex;
        gap: 8px;
      }

      .yuki-minimize-btn,
      .yuki-close-btn {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s ease;
      }

      .yuki-minimize-btn:hover,
      .yuki-close-btn:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      /* Chat Content */
      .yuki-chat-content {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      /* Registration Form */
      .yuki-registration-form {
        padding: 24px;
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .yuki-form-header {
        margin-bottom: 24px;
      }

      .yuki-form-header h4 {
        margin: 0 0 8px 0;
        font-size: 20px;
        font-weight: 600;
        color: ${CONFIG.theme.textColor};
      }

      .yuki-form-header p {
        margin: 0;
        color: ${CONFIG.theme.lightTextColor};
        font-size: 14px;
      }

      .yuki-form-group {
        margin-bottom: 20px;
      }

      .yuki-form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: ${CONFIG.theme.textColor};
        font-size: 14px;
      }

      .yuki-form-group input {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        font-size: 14px;
        transition: all 0.2s ease;
        background: ${CONFIG.theme.backgroundColor};
        color: ${CONFIG.theme.textColor};
      }

      .yuki-form-group input:focus {
        outline: none;
        border-color: ${CONFIG.theme.primaryColor};
        box-shadow: 0 0 0 3px ${CONFIG.theme.primaryColor}33;
      }

      .yuki-form-group input::placeholder {
        color: ${CONFIG.theme.lightTextColor};
      }

      .yuki-form-actions {
        margin-bottom: auto;
      }

      .yuki-submit-btn {
        width: 100%;
        background: ${CONFIG.theme.primaryColor};
        color: white;
        border: none;
        padding: 14px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.2s ease;
      }

      .yuki-submit-btn:hover {
        background: ${CONFIG.theme.primaryColor}dd;
        transform: translateY(-1px);
      }

      .yuki-submit-btn:disabled {
        background: #9ca3af;
        cursor: not-allowed;
        transform: none;
      }

      .yuki-spinner {
        animation: yuki-spin 2s linear infinite;
      }

      @keyframes yuki-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .yuki-form-footer {
        text-align: center;
        margin-top: 16px;
      }

      .yuki-form-footer small {
        color: ${CONFIG.theme.lightTextColor};
        font-size: 12px;
      }

      /* Chat Interface */
      .yuki-chat-interface {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .yuki-messages-container {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        scroll-behavior: smooth;
      }

      .yuki-messages-container::-webkit-scrollbar {
        width: 4px;
      }

      .yuki-messages-container::-webkit-scrollbar-track {
        background: #f3f4f6;
      }

      .yuki-messages-container::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 2px;
      }

      .yuki-messages-container::-webkit-scrollbar-thumb:hover {
        background: #9ca3af;
      }

      /* Messages */
      .yuki-message {
        margin-bottom: 16px;
        display: flex;
        flex-direction: column;
      }

      .yuki-message.customer {
        align-items: flex-end;
      }

      .yuki-message.agent {
        align-items: flex-start;
      }

      .yuki-message.system {
        align-items: center;
      }

      .yuki-message-bubble {
        max-width: 280px;
        padding: 12px 16px;
        border-radius: 18px;
        word-wrap: break-word;
        position: relative;
      }

      .yuki-message.customer .yuki-message-bubble {
        background: ${CONFIG.theme.primaryColor};
        color: white;
        border-bottom-right-radius: 4px;
      }

      .yuki-message.agent .yuki-message-bubble {
        background: #f3f4f6;
        color: ${CONFIG.theme.textColor};
        border-bottom-left-radius: 4px;
      }

      .yuki-message.system .yuki-message-bubble {
        background: ${CONFIG.theme.secondaryColor};
        color: ${CONFIG.theme.primaryColor};
        font-size: 13px;
        max-width: 320px;
        text-align: center;
      }

      .yuki-message-info {
        font-size: 11px;
        color: ${CONFIG.theme.lightTextColor};
        margin: 4px 8px 0 8px;
      }

      .yuki-message.customer .yuki-message-info {
        text-align: right;
      }

      .yuki-message.agent .yuki-message-info {
        text-align: left;
      }

      .yuki-message.system .yuki-message-info {
        text-align: center;
      }

      /* Typing Indicator */
      .yuki-typing-indicator {
        padding: 8px 16px;
        display: flex;
        align-items: center;
        gap: 8px;
        color: ${CONFIG.theme.lightTextColor};
        font-size: 13px;
      }

      .yuki-typing-dots {
        display: flex;
        gap: 4px;
      }

      .yuki-typing-dots span {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: ${CONFIG.theme.lightTextColor};
        animation: yuki-typing 1.4s ease-in-out infinite;
      }

      .yuki-typing-dots span:nth-child(1) {
        animation-delay: 0s;
      }

      .yuki-typing-dots span:nth-child(2) {
        animation-delay: 0.2s;
      }

      .yuki-typing-dots span:nth-child(3) {
        animation-delay: 0.4s;
      }

      @keyframes yuki-typing {
        0%, 60%, 100% {
          transform: translateY(0);
          opacity: 0.4;
        }
        30% {
          transform: translateY(-10px);
          opacity: 1;
        }
      }

      /* Input Area */
      .yuki-input-area {
        border-top: 1px solid #e5e7eb;
        background: ${CONFIG.theme.backgroundColor};
      }

      .yuki-input-container {
        padding: 16px;
      }

      .yuki-message-input {
        display: flex;
        align-items: flex-end;
        gap: 8px;
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 20px;
        padding: 8px;
        transition: border-color 0.2s ease;
      }

      .yuki-message-input:focus-within {
        border-color: ${CONFIG.theme.primaryColor};
        box-shadow: 0 0 0 3px ${CONFIG.theme.primaryColor}33;
      }

      .yuki-message-input textarea {
        flex: 1;
        border: none;
        outline: none;
        background: transparent;
        resize: none;
        font-family: inherit;
        font-size: 14px;
        line-height: 1.4;
        max-height: 120px;
        padding: 8px 12px;
        color: ${CONFIG.theme.textColor};
      }

      .yuki-message-input textarea::placeholder {
        color: ${CONFIG.theme.lightTextColor};
      }

      .yuki-send-btn {
        background: ${CONFIG.theme.primaryColor};
        color: white;
        border: none;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        flex-shrink: 0;
      }

      .yuki-send-btn:hover:not(:disabled) {
        background: ${CONFIG.theme.primaryColor}dd;
        transform: scale(1.05);
      }

      .yuki-send-btn:disabled {
        background: #d1d5db;
        cursor: not-allowed;
        transform: none;
      }

      .yuki-input-footer {
        padding: 0 16px 16px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .yuki-char-count {
        font-size: 11px;
        color: ${CONFIG.theme.lightTextColor};
      }

      /* Error States */
      .yuki-error {
        background: #fef2f2;
        color: ${CONFIG.theme.errorColor};
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 16px;
        font-size: 13px;
        border: 1px solid #fecaca;
      }

      /* Responsive Design */
      @media (max-width: 480px) {
        .yuki-widget-container {
          right: 10px !important;
          left: 10px !important;
        }
        
        .yuki-chat-window {
          width: 100%;
          height: 100vh;
          max-height: 100vh;
          bottom: 0;
          right: 0;
          left: 0;
          border-radius: 0;
          animation: yuki-slideUpMobile 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .yuki-chat-button {
          right: 0;
        }

        .yuki-message-bubble {
          max-width: 260px;
        }
      }

      @keyframes yuki-slideUpMobile {
        from {
          opacity: 0;
          transform: translateY(100%);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Left position adjustments */
      .yuki-widget-container[data-position="bottom-left"] .yuki-chat-window {
        right: auto;
        left: 0;
      }

      /* Accessibility */
      @media (prefers-reduced-motion: reduce) {
        .yuki-chat-button,
        .yuki-chat-window,
        .yuki-message-bubble,
        .yuki-submit-btn,
        .yuki-send-btn {
          transition: none;
          animation: none;
        }

        .yuki-typing-dots span {
          animation: none;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  /**
   * Add event listeners
   */
  function addEventListeners() {
    const chatButton = document.getElementById("yuki-chat-button");
    const chatWindow = document.getElementById("yuki-chat-window");
    const minimizeBtn = document.getElementById("yuki-minimize-btn");
    const closeBtn = document.getElementById("yuki-close-btn");
    const registerForm = document.getElementById("yuki-register-form");
    const messageInput = document.getElementById("yuki-message-input");
    const sendBtn = document.getElementById("yuki-send-btn");

    // Check if all required elements exist
    if (
      !chatButton ||
      !chatWindow ||
      !minimizeBtn ||
      !closeBtn ||
      !registerForm
    ) {
      console.error("Yuki Chat Widget: Required DOM elements not found");
      return;
    }

    // Chat button click
    chatButton.addEventListener("click", () => {
      if (isOpen) {
        hideChatWindow();
      } else {
        showChatWindow();
      }
    });

    // Minimize button
    minimizeBtn.addEventListener("click", () => {
      hideChatWindow();
    });

    // Close button
    closeBtn.addEventListener("click", () => {
      hideChatWindow();
    });

    // Registration form
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleRegistration();
    });

    // Message input (only if it exists - may not be visible initially)
    if (messageInput && sendBtn) {
      messageInput.addEventListener("input", (e) => {
        handleInputChange(e);
      });

      messageInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      });

      // Send button
      sendBtn.addEventListener("click", () => {
        sendMessage();
      });

      // Auto-resize textarea
      messageInput.addEventListener("input", () => {
        messageInput.style.height = "auto";
        messageInput.style.height =
          Math.min(messageInput.scrollHeight, 120) + "px";
      });
    }

    // Click outside to close
    document.addEventListener("click", (e) => {
      if (!widget.contains(e.target) && isOpen) {
        hideChatWindow();
      }
    });

    // Escape key to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen) {
        hideChatWindow();
      }
    });
  }

  /**
   * Show chat window
   */
  function showChatWindow() {
    const chatWindow = document.getElementById("yuki-chat-window");
    if (!chatWindow) return;

    chatWindow.style.display = "flex";
    isOpen = true;

    hideNotificationBadge();

    // Show appropriate interface
    if (isRegistered) {
      showChatInterface();
      const messageInput = document.getElementById("yuki-message-input");
      if (messageInput) messageInput.focus();
    } else {
      showRegistrationForm();
      const nameInput = document.getElementById("yuki-name");
      if (nameInput) nameInput.focus();
    }
  }

  /**
   * Hide chat window
   */
  function hideChatWindow() {
    const chatWindow = document.getElementById("yuki-chat-window");
    if (chatWindow) chatWindow.style.display = "none";
    isOpen = false;
  }

  /**
   * Show registration form
   */
  function showRegistrationForm() {
    const registrationForm = document.getElementById("yuki-registration-form");
    const chatInterface = document.getElementById("yuki-chat-interface");
    const inputArea = document.getElementById("yuki-input-area");

    if (registrationForm) registrationForm.style.display = "flex";
    if (chatInterface) chatInterface.style.display = "none";
    if (inputArea) inputArea.style.display = "none";
  }

  /**
   * Show chat interface
   */
  function showChatInterface() {
    const registrationForm = document.getElementById("yuki-registration-form");
    const chatInterface = document.getElementById("yuki-chat-interface");
    const inputArea = document.getElementById("yuki-input-area");

    if (registrationForm) registrationForm.style.display = "none";
    if (chatInterface) chatInterface.style.display = "flex";
    if (inputArea) inputArea.style.display = "block";
  }

  /**
   * Handle registration form submission
   */
  function handleRegistration() {
    const submitBtn = document.getElementById("yuki-submit-btn");
    const btnText = submitBtn.querySelector(".yuki-btn-text");
    const btnLoading = submitBtn.querySelector(".yuki-btn-loading");
    const name = document.getElementById("yuki-name").value.trim();
    const phone = document.getElementById("yuki-phone").value.trim();
    const email = document.getElementById("yuki-email").value.trim();

    // Validation
    if (!name || name.length < 2) {
      showError("Please enter a valid name (at least 2 characters)");
      return;
    }

    if (!phone || phone.length < 10) {
      showError("Please enter a valid phone number");
      return;
    }

    if (email && !isValidEmail(email)) {
      showError("Please enter a valid email address");
      return;
    }

    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = "none";
    btnLoading.style.display = "inline-flex";

    // Emit registration event
    if (socket && socket.connected) {
      socket.emit("widget_register", {
        name,
        phone,
        email: email || null,
        sessionData: {
          timestamp: new Date().toISOString(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      });
    } else {
      submitBtn.disabled = false;
      btnText.style.display = "inline";
      btnLoading.style.display = "none";
      showError("Connection error. Please try again.");
    }
  }

  /**
   * Send message
   */
  function sendMessage() {
    const messageInput = document.getElementById("yuki-message-input");

    if (!messageInput) return;

    const content = messageInput.value.trim();

    if (!content || !socket || !socket.connected || !isRegistered) return;

    // Add message to UI immediately (optimistic update)
    addMessage("customer", content, "You", new Date());

    // Send via socket
    socket.emit("widget_message", {
      content,
      messageType: "text",
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });

    // Clear input
    messageInput.value = "";
    messageInput.style.height = "auto";
    updateSendButton();
    updateCharCount();

    // Send typing indicator
    if (window.typingTimeout) {
      clearTimeout(window.typingTimeout);
    }
    socket.emit("widget_typing", { isTyping: false });
  }

  /**
   * Handle input changes
   */
  function handleInputChange(e) {
    const input = e.target;
    const content = input.value.trim();

    updateSendButton();
    updateCharCount();

    // Typing indicator
    if (socket && socket.connected && isRegistered) {
      socket.emit("widget_typing", { isTyping: content.length > 0 });

      // Clear typing after 2 seconds of no typing
      if (window.typingTimeout) {
        clearTimeout(window.typingTimeout);
      }

      window.typingTimeout = setTimeout(() => {
        socket.emit("widget_typing", { isTyping: false });
      }, 2000);
    }
  }

  /**
   * Update send button state
   */
  function updateSendButton() {
    const messageInput = document.getElementById("yuki-message-input");
    const sendBtn = document.getElementById("yuki-send-btn");

    if (!messageInput || !sendBtn) return;

    const content = messageInput.value.trim();
    sendBtn.disabled =
      !content || !socket || !socket.connected || !isRegistered;
  }

  /**
   * Update character count
   */
  function updateCharCount() {
    const messageInput = document.getElementById("yuki-message-input");
    const charCount = document.getElementById("yuki-char-count");

    if (!messageInput || !charCount) return;

    const length = messageInput.value.length;
    charCount.textContent = `${length}/1000`;

    if (length > 900) {
      charCount.style.color = CONFIG.theme.errorColor;
    } else {
      charCount.style.color = CONFIG.theme.lightTextColor;
    }
  }

  /**
   * Add message to chat
   */
  function addMessage(
    sender,
    content,
    senderName = "",
    timestamp = new Date()
  ) {
    const messagesContainer = document.getElementById(
      "yuki-messages-container"
    );
    const messageDiv = document.createElement("div");
    messageDiv.className = `yuki-message ${sender}`;

    const time = new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    let senderInfo = "";
    if (sender === "agent") {
      senderInfo = senderName;
    } else if (sender === "customer") {
      senderInfo = "You";
    }

    messageDiv.innerHTML = `
      <div class="yuki-message-bubble">${escapeHtml(content)}</div>
      <div class="yuki-message-info">
        ${senderInfo ? `${senderInfo} • ` : ""}${time}
      </div>
    `;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Show notification if window is not open
    if (!isOpen && sender !== "customer") {
      showNotificationBadge();
    }
  }

  /**
   * Add system message
   */
  function addSystemMessage(content) {
    addMessage("system", content, "", new Date());
  }

  /**
   * Load messages from server
   */
  function loadMessages(messages) {
    const messagesContainer = document.getElementById(
      "yuki-messages-container"
    );
    messagesContainer.innerHTML = "";

    messages.forEach((message) => {
      addMessage(
        message.sender,
        message.content,
        message.sender === "agent"
          ? "Agent"
          : message.sender === "customer"
          ? "You"
          : "",
        message.timestamp
      );
    });
  }

  /**
   * Update connection status
   */
  function updateConnectionStatus(status) {
    const statusDot = document.querySelector(".yuki-status-dot");
    const statusText = document.querySelector(".yuki-status-text");

    if (statusDot) statusDot.className = `yuki-status-dot ${status}`;

    if (statusText) {
      switch (status) {
        case "connected":
          statusText.textContent = "Connected";
          break;
        case "connecting":
          statusText.textContent = "Connecting...";
          break;
        case "disconnected":
          statusText.textContent = "Disconnected";
          break;
        case "reconnecting":
          statusText.textContent = "Reconnecting...";
          break;
        default:
          statusText.textContent = "Unknown";
      }
    }
  }

  /**
   * Show typing indicator
   */
  function showTypingIndicator(text = "Agent is typing...") {
    const indicator = document.getElementById("yuki-typing-indicator");
    const textSpan = indicator.querySelector(".yuki-typing-text");
    textSpan.textContent = text;
    indicator.style.display = "flex";
  }

  /**
   * Hide typing indicator
   */
  function hideTypingIndicator() {
    const indicator = document.getElementById("yuki-typing-indicator");
    indicator.style.display = "none";
  }

  /**
   * Show error message
   */
  function showError(message) {
    // Remove existing error
    const existingError = document.querySelector(".yuki-error");
    if (existingError) {
      existingError.remove();
    }

    // Create error element
    const errorDiv = document.createElement("div");
    errorDiv.className = "yuki-error";
    errorDiv.textContent = message;

    // Insert error message
    const form = document.getElementById("yuki-register-form");
    form.insertBefore(errorDiv, form.firstChild);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove();
      }
    }, 5000);
  }

  /**
   * Show notification badge
   */
  function showNotificationBadge() {
    const badge = document.getElementById("yuki-notification-badge");
    badge.style.display = "flex";
  }

  /**
   * Hide notification badge
   */
  function hideNotificationBadge() {
    const badge = document.getElementById("yuki-notification-badge");
    badge.style.display = "none";
  }

  /**
   * Play notification sound
   */
  function playNotificationSound() {
    // Create a subtle notification sound
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.2
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
      // Ignore audio errors
    }
  }

  /**
   * Clear session data
   */
  function clearSession() {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
    sessionData = {};
    isRegistered = false;
  }

  /**
   * Mark message as sent
   */
  function markMessageAsSent(messageId) {
    // Could add delivery indicators here
    console.log("Message sent:", messageId);
  }

  /**
   * Utility functions
   */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Cleanup function
   */
  function cleanup() {
    if (socket) {
      socket.disconnect();
      socket = null;
    }

    // Clear global references
    if (window.YUKI_SOCKET_INSTANCE) {
      window.YUKI_SOCKET_INSTANCE = null;
    }
    window.YUKI_WIDGET_INITIALIZED = false;
    window.yukiServerTested = false;

    if (widget) {
      widget.remove();
      widget = null;
    }

    isOpen = false;
    isRegistered = false;
    sessionData = {};
    isInitialized = false;
  }

  /**
   * Public API
   */
  window.YukiEnhancedChatWidget = {
    show: showChatWindow,
    hide: hideChatWindow,
    clearSession: clearSession,
    cleanup: cleanup,
    isOpen: () => isOpen,
    isRegistered: () => isRegistered,
    getConnectionStatus: () => (socket ? socket.connected : false),
    setConfig: function (newConfig) {
      Object.assign(CONFIG, newConfig);
    },
  };

  // Single initialization point - simplified
  function delayedInit() {
    if (typeof io === "undefined") {
      // Socket.IO not loaded yet, wait a bit more
      setTimeout(delayedInit, 200);
      return;
    }
    initializeWidget();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", delayedInit, {
      once: true,
    });
  } else {
    // DOM already ready, wait for Socket.IO if needed
    delayedInit();
  }
})();
