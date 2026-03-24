import "./stub-react-refresh";
import ReactDOM from "react-dom/client";
import App from "./App";
import { installGlobalLoggers } from "./main";
// Widget CSS as raw strings so we inject into shadow root (does not depend on document timing)
import indexCss from "./index.css?raw";
import feedbackBubbleCss from "./components/FeedbackBubble.css?raw";
import ticketModalCss from "./components/TicketModal.css?raw";

const WIDGET_CSS = [indexCss, feedbackBubbleCss, ticketModalCss].join("\n");

type WidgetConfig = {
  apiBaseUrl?: string;
  hideCustomerFields?: boolean;
  customer?: {
    name?: string;
    email?: string;
  };
};

function getConfigFromScriptSrc(): WidgetConfig {
  try {
    const current = document.currentScript as HTMLScriptElement | null;
    const src = current?.src;
    if (!src) return {};

    const url = new URL(src, window.location.href);
    const params = url.searchParams;

    const config: WidgetConfig = {};

    const apiBaseUrl = params.get("apiBaseUrl");
    if (apiBaseUrl) {
      config.apiBaseUrl = apiBaseUrl;
    }

    const hideCustomerFields = params.get("hideCustomerFields");
    if (hideCustomerFields === "true" || hideCustomerFields === "1") {
      config.hideCustomerFields = true;
    }

    const customerName =
      params.get("customerName") ?? params.get("customer_name") ?? undefined;
    const customerEmail =
      params.get("customerEmail") ?? params.get("customer_email") ?? undefined;

    if (customerName || customerEmail) {
      config.customer = {};
      if (customerName) config.customer.name = customerName;
      if (customerEmail) config.customer.email = customerEmail;
    }

    return config;
  } catch {
    return {};
  }
}

let currentConfig: WidgetConfig = {};
let root: ReactDOM.Root | null = null;

function ensureMounted() {
  let container = document.getElementById("zoho-ticket-widget");
  if (container) {
    // Already mounted once; just re-render with latest config.
    if (!root) {
      const shadowRoot = (container as HTMLElement).shadowRoot;
      if (!shadowRoot) return;
      const mountPoint = shadowRoot.querySelector("div");
      if (!mountPoint) return;
      root = ReactDOM.createRoot(mountPoint as HTMLElement);
    }
    root.render(<App widgetConfig={currentConfig} />);
    return;
  }

  installGlobalLoggers();

  container = document.createElement("div");
  container.id = "zoho-ticket-widget";

  const shadowRoot = container.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = WIDGET_CSS;
  shadowRoot.appendChild(style);

  const mountPoint = document.createElement("div");
  shadowRoot.appendChild(mountPoint);

  // Stop keyboard events from propagating to the host app so its global
  // shortcut listeners (e.g. "g h" → Go Home) don't fire while the user
  // is typing inside the widget (DS-1707).
  (["keydown", "keyup", "keypress"] as const).forEach((eventType) => {
    container!.addEventListener(eventType, (e) => e.stopPropagation(), true);
  });

  document.body.appendChild(container);

  root = ReactDOM.createRoot(mountPoint);
  root.render(<App widgetConfig={currentConfig} />);
}

const globalAny = window as any;

let autoInitTimer: number | null = null;
currentConfig = getConfigFromScriptSrc();

globalAny.TicketWidget = {
  init(config: WidgetConfig = {}) {
    // Merge new config on top of whatever we already have (e.g. from script URL).
    currentConfig = { ...currentConfig, ...config };

    if (!globalAny.__TicketWidgetInitialized) {
      globalAny.__TicketWidgetInitialized = true;
      if (autoInitTimer !== null) {
        clearTimeout(autoInitTimer);
        autoInitTimer = null;
      }
      ensureMounted();
    } else {
      // Already auto-initialized or previously init'ed: re-render with new config.
      ensureMounted();
    }
  },
};

autoInitTimer = window.setTimeout(() => {
  if (globalAny.__TicketWidgetInitialized) return;
  globalAny.__TicketWidgetInitialized = true;
  ensureMounted();
}, 0);
