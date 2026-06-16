import { describe, expect, it, vi } from "vitest";
import { sendConciergeUserMessage } from "../concierge-send-user-message";

function makeHandlers() {
  return {
    handleRentalMessage: vi.fn(async () => false),
    handleEventVenueBookingMessage: vi.fn(async () => false),
    handleEventMessage: vi.fn(async () => false),
    handleGroundedMessage: vi.fn(async () => false),
    handleRestaurantMessage: vi.fn(async () => false),
    onAgentSend: vi.fn(async () => true),
  };
}

describe("SAN-867 · VEB-MVP-001 — Router hijack fix — sendConciergeUserMessage pipeline", () => {
  it("plan my weekend reaches agent without event fast-path", async () => {
    const handlers = makeHandlers();
    await sendConciergeUserMessage("plan my weekend", handlers);

    expect(handlers.onAgentSend).toHaveBeenCalledOnce();
    expect(handlers.onAgentSend).toHaveBeenCalledWith("plan my weekend");
    expect(handlers.handleEventMessage).not.toHaveBeenCalled();
    expect(handlers.handleRentalMessage).not.toHaveBeenCalled();
  });

  it("what can I do tonight reaches agent without event fast-path", async () => {
    const handlers = makeHandlers();
    await sendConciergeUserMessage("what can I do tonight", handlers);

    expect(handlers.onAgentSend).toHaveBeenCalledOnce();
    expect(handlers.handleEventMessage).not.toHaveBeenCalled();
  });

  it("venue booking still uses event_venue_booking handler", async () => {
    const handlers = makeHandlers();
    handlers.handleEventVenueBookingMessage.mockResolvedValueOnce(true);

    await sendConciergeUserMessage(
      "I need a venue for a birthday party for 30 people",
      handlers,
    );

    expect(handlers.handleEventVenueBookingMessage).toHaveBeenCalledOnce();
    expect(handlers.onAgentSend).not.toHaveBeenCalled();
  });

  it("salsa events still uses event handler before agent", async () => {
    const handlers = makeHandlers();
    handlers.handleEventMessage.mockResolvedValueOnce(true);

    await sendConciergeUserMessage("salsa events this weekend", handlers);

    expect(handlers.handleEventMessage).toHaveBeenCalledOnce();
    expect(handlers.onAgentSend).not.toHaveBeenCalled();
  });
});
