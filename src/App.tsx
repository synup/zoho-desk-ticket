import { FeedbackBubble } from './components/FeedbackBubble';
import type { TicketSuccessInfo } from './components/TicketModal';

type WidgetConfig = {
  apiBaseUrl?: string;
  customer?: {
    name?: string;
    email?: string;
  };
};

function App({ widgetConfig }: { widgetConfig?: WidgetConfig }) {
  const handleTicketSuccess = (info: TicketSuccessInfo) => {
    // optional analytics hook
    console.log("Ticket created:", info.ticketId);
  };

  return (
    <FeedbackBubble
      onTicketSuccess={handleTicketSuccess}
      config={widgetConfig}
    />
  );
}

export default App;
