import { NextResponse } from "next/server";
import { getWalletOrderByToken } from "@/lib/tickets/get-wallet-order";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");
  const token = searchParams.get("token");

  if (!orderId || !token) {
    return NextResponse.json(
      { error: { message: "orderId and token are required" } },
      { status: 400 },
    );
  }

  const payload = await getWalletOrderByToken(orderId, token);
  if (!payload) {
    return NextResponse.json(
      { error: { message: "Order not found" } },
      { status: 404 },
    );
  }

  return NextResponse.json(payload);
}
