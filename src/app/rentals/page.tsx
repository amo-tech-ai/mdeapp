/**
 * /rentals — full rental search surface (W5–W7, not yet built).
 * Redirect to the concierge chat where Camila can search rentals today.
 */
import { redirect } from "next/navigation";

export default function RentalsPage() {
  redirect("/chat");
}
