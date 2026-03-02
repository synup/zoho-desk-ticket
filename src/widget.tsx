import "./stub-react-refresh";
import ReactDOM from "react-dom/client";
import App from "./App";
import { installGlobalLoggers } from "./main";
// Widget CSS as raw strings so we inject into shadow root (does not depend on document timing)
import indexCss from "./index.css?raw";
import feedbackBubbleCss from "./components/FeedbackBubble.css?raw";
import ticketModalCss from "./components/TicketModal.css?raw";

const WIDGET_CSS = [indexCss, feedbackBubbleCss, ticketModalCss].join("\n");

function getConfigFromScriptSrc(): any {
  try {
    const current = document.currentScript as HTMLScriptElement | null;
    const src = current?.src;
    if (!src) return {};

    const url = new URL(src, window.location.href);
    const params = url.searchParams;

    const config: any = {};

    const apiBaseUrl = params.get("apiBaseUrl");
    if (apiBaseUrl) {
      config.apiBaseUrl = apiBaseUrl;
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

function mount(config: any = {}) {
  if (document.getElementById("zoho-ticket-widget")) return;

  installGlobalLoggers();

  const container = document.createElement("div");
  container.id = "zoho-ticket-widget";

  const shadowRoot = container.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = WIDGET_CSS;
  shadowRoot.appendChild(style);

  const mountPoint = document.createElement("div");
  shadowRoot.appendChild(mountPoint);

  document.body.appendChild(container);

  const root = ReactDOM.createRoot(mountPoint);
  root.render(<App widgetConfig={config} />);
}

const globalAny = window as any;

let autoInitTimer: number | null = null;
const scriptConfig = getConfigFromScriptSrc();

globalAny.TicketWidget = {
  init(config: any = {}) {
    if (globalAny.__TicketWidgetInitialized) return;
    globalAny.__TicketWidgetInitialized = true;
    if (autoInitTimer !== null) {
      clearTimeout(autoInitTimer);
      autoInitTimer = null;
    }
    mount(config);
  },
};

autoInitTimer = window.setTimeout(() => {
  if (globalAny.__TicketWidgetInitialized) return;
  globalAny.__TicketWidgetInitialized = true;
  mount(scriptConfig);
}, 0);
